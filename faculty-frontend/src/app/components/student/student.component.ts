import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ActivityService } from '../../services/activity.service';
import { Subscription, combineLatest, finalize } from 'rxjs';
import { Student, Section } from '../../models/api.models';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  externalStudents: any[] = [];
  sections: Section[] = [];
  newStudent = { name: '', section_id: '' };
  isAdding = false;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  isLoadingExternal = false;
  
  // Filters
  filterText = '';
  filterSection = '';

  // Pagination
  pageSize = 10;
  currentPage = 1;

  private sub?: Subscription;

  constructor(
    private apiService: ApiService, 
    private dataService: DataService,
    private toast: ToastService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = combineLatest([
      this.dataService.students$,
      this.dataService.sections$
    ]).subscribe(([students, sections]) => {
      this.students = students;
      this.sections = sections;
      this.applyFilters();
    });
    this.dataService.refreshStudents();
    this.dataService.refreshSections(); // Now with optimized caching
    this.loadExternalStudents();
  }

  loadExternalStudents(forceAutoEnroll: boolean = false) {
    this.isLoadingExternal = true;
    this.apiService.getExternalStudents().pipe(
      finalize(() => this.isLoadingExternal = false)
    ).subscribe({
      next: (res) => {
        const rawData = Array.isArray(res) ? res : (res?.data || []);
        // Normalize external student data
        this.externalStudents = rawData.map((s: any) => ({
          external_id: s.student_number || s.id || s.student_id || s.admission_id,
          name: s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown Student',
          email: s.email || s.contact_email || null,
          source: 'admission'
        }));

        if (forceAutoEnroll && this.externalStudents.length > 0) {
          this.autoEnrollStudents();
        }
      },
      error: (err) => {
        this.isLoadingExternal = false;
        console.error('Admission API Sync Error:', err);
        const errorMsg = err.error?.message || err.message || 'Admission API unreachable';
        this.toast.error(`Sync Failed: ${errorMsg}`);
      }
    });
  }

  autoEnrollStudents() {
    if (this.sections.length === 0) {
      console.warn('Waiting for local sections to load before auto-enrollment...');
      // If sections aren't loaded yet, try again in 500ms
      setTimeout(() => this.autoEnrollStudents(), 500);
      return;
    }

    console.log('Starting auto-enrollment for', this.externalStudents.length, 'external students');
    
    // Default section ID fallback: use the first available section
    const defaultSectionId = this.sections[0].id;
    let enrollmentCount = 0;
    
    this.externalStudents.forEach(extStudent => {
      console.log('Checking student:', extStudent.name, extStudent.external_id);
      // Check if student already exists in the local 'students' array
      // Note: We use the normalized external_id and source for comparison
      const alreadyExistsLocally = this.students.some(s => {
        const match = (s as any).external_id?.toString() === extStudent.external_id?.toString() && 
        (s as any).source === 'admission';
        if (match) console.log('Student already exists locally:', extStudent.name);
        return match;
      });

      if (!alreadyExistsLocally) {
        console.log('Enrolling new student:', extStudent.name);
        this.apiService.createStudent({
          name: extStudent.name,
          email: extStudent.email,
          section_id: defaultSectionId,
          source: 'admission',
          external_id: extStudent.external_id
        }).subscribe({
          next: (res: any) => {
            console.log(`Auto-enrolled: ${extStudent.name}`);
            enrollmentCount++;
            // Refresh directory after each successful save to keep UI updated
            this.dataService.refreshStudents();
          },
          error: (err) => {
            console.error(`Auto-enrollment failed for ${extStudent.name}:`, err);
          }
        });
      }
    });

    if (enrollmentCount === 0 && this.externalStudents.length > 0) {
      console.log('No new students to enroll. All external students already exist locally.');
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(s => {
      const matchText = !this.filterText || s.name.toLowerCase().includes(this.filterText.toLowerCase());
      const matchSection = !this.filterSection || (s.section_id?.toString() === this.filterSection);
      return matchText && matchSection;
    });
    this.currentPage = 1;
  }

  refreshAll() {
    this.dataService.refreshStudents();
    this.dataService.refreshSections(true); // Force sync from remote
    this.loadExternalStudents(true); // Also trigger auto-enrollment
    this.toast.info('Refreshing all data and syncing with external APIs...');
  }

  resetFilters() {
    this.filterText = '';
    this.filterSection = '';
    this.applyFilters();
  }

  get paginatedStudents() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredStudents.length / this.pageSize);
  }

  getSectionName(sectionId: number | null): string {
    if (sectionId === null) return 'Unassigned';
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return 'Unassigned';
    return section.section_name || (section as any).name || 'Unknown Section';
  }

  getSectionInfo(sectionId: number | null): string {
    if (sectionId === null) return '';
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return '';
    const details = [];
    if (section.subject?.name) details.push(section.subject.name);
    if (section.schedule) details.push(section.schedule);
    if (section.room) details.push(`Room: ${section.room}`);
    return details.join(' | ');
  }

  addStudent() {
    if (!this.newStudent.name || !this.newStudent.section_id) {
      this.toast.warning('Please provide name and section');
      return;
    }

    this.isLoading = true;
    const studentData = { name: this.newStudent.name, section_id: parseInt(this.newStudent.section_id) };
    
    const action = this.isEditing && this.editingId 
      ? this.apiService.updateStudent(this.editingId, studentData)
      : this.apiService.createStudent(studentData);

    action.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.toast.success(res.message || (this.isEditing ? 'Student updated' : 'Student added'));
        const activity = this.isEditing ? 'Updated Student' : 'Enrolled New Student';
        this.activityService.addActivity('student', activity, this.newStudent.name);
        
        if (res.data) {
          if (this.isEditing && this.editingId) {
            const index = this.students.findIndex(s => s.id === this.editingId);
            if (index !== -1) {
              this.students[index] = res.data;
            }
          } else {
            this.students.unshift(res.data);
          }
        }
        
        this.applyFilters();
        this.cancelEdit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Student save failed', err);
        this.toast.error(err.error?.message || `Failed to ${this.isEditing ? 'update' : 'add'} student`);
      }
    });
  }

  editStudent(student: Student) {
    this.isEditing = true;
    this.isAdding = true;
    this.editingId = student.id;
    this.newStudent = { name: student.name, section_id: student.section_id?.toString() || '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.isAdding = false;
    this.editingId = null;
    this.newStudent = { name: '', section_id: '' };
    this.cdr.detectChanges();
  }

  toggleAddForm() {
    if (this.isAdding) {
      this.cancelEdit();
    } else {
      this.isAdding = true;
      this.isEditing = false;
      this.newStudent = { name: '', section_id: '' };
    }
    this.cdr.detectChanges();
  }

  deleteStudent(id: number) {
    const studentToDelete = this.students.find(s => s.id === id);
    if (confirm('Are you sure you want to delete this student?')) {
      this.isLoading = true;
      this.apiService.deleteStudent(id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.toast.success('Student deleted');
          this.activityService.addActivity('student', 'Removed Student', studentToDelete?.name || 'Unknown');
          this.students = this.students.filter(s => s.id !== id);
          this.applyFilters();
        },
        error: () => {
          this.toast.error('Failed to delete student');
        }
      });
    }
  }
}

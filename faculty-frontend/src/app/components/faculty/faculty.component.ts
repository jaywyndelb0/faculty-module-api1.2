import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ActivityService } from '../../services/activity.service';
import { Subscription, finalize } from 'rxjs';
import { Faculty, Subject } from '../../models/api.models';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.css'
})
export class FacultyComponent implements OnInit, OnDestroy {
  facultyList: Faculty[] = [];
  filteredFaculty: Faculty[] = [];
  subjects: Subject[] = [];
  newFaculty = { name: '', email: '', department: 'Computer Science', subject_id: null as number | null };
  isAdding = false;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  isLoadingSubjects = false;
  
  // Filters
  filterText = '';
  filterDept = '';

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
    this.sub = this.dataService.faculty$.subscribe(data => {
      this.facultyList = data;
      this.applyFilters();
    });
    
    // Subscribe to subjects from DataService for sync support
    this.dataService.subjects$.subscribe(subjects => {
      this.subjects = subjects;
    });

    this.dataService.refreshFaculty();
    this.dataService.refreshSubjects();
  }

  loadSubjects() {
    // This method is now redundant if we use DataService, but keeping it 
    // for compatibility or as a manual refresh if needed.
    // Changing to use the updated getSubjects() which is local.
    this.isLoadingSubjects = true;
    this.apiService.getSubjects().pipe(
      finalize(() => this.isLoadingSubjects = false)
    ).subscribe({
      next: (res) => {
        const raw = Array.isArray(res) ? res : (res?.data || []);   
        this.subjects = raw.map((s: any) => ({
          id: s.id,
          name: s.subject_name || s.name || 'Unknown Subject',
          code: s.code || ''
        }));
      },
      error: (err) => {
        this.toast.error('Failed to load subjects from local database');
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  applyFilters() {
    this.filteredFaculty = this.facultyList.filter(f => {
      const matchText = !this.filterText || 
        f.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        f.email.toLowerCase().includes(this.filterText.toLowerCase());
      const matchDept = !this.filterDept || f.department === this.filterDept;
      return matchText && matchDept;
    });
    this.currentPage = 1;
  }

  refreshAll() {
    this.dataService.refreshFaculty();
    this.dataService.refreshSubjects(true); // Force sync
    this.toast.info('Refreshing faculty and syncing subjects...');
  }

  resetFilters() {
    this.filterText = '';
    this.filterDept = '';
    this.applyFilters();
  }

  get paginatedFaculty() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFaculty.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredFaculty.length / this.pageSize);
  }

  addFaculty() {
    if (!this.newFaculty.name || !this.newFaculty.email) {
      this.toast.warning('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    const action = this.isEditing && this.editingId 
      ? this.apiService.updateFaculty(this.editingId, this.newFaculty)
      : this.apiService.createFaculty(this.newFaculty);

    action.pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Faculty saved successfully');
        const activity = this.isEditing ? 'Updated Faculty' : 'Added New Faculty';
        this.activityService.addActivity('faculty', activity, this.newFaculty.name);
        
        if (res.data) {
          if (this.isEditing && this.editingId) {
            const index = this.facultyList.findIndex((f: any) => f.id === this.editingId);
            if (index !== -1) {
              this.facultyList[index] = res.data;
            }
          } else {
            this.facultyList.unshift(res.data);
          }
        }
        
        this.applyFilters();
        this.cancelEdit(); // Single source of truth for closing form
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Faculty save failed', err);
        this.toast.error(err.error?.message || `Failed to ${this.isEditing ? 'update' : 'add'} faculty`);
      }
    });
  }

  editFaculty(faculty: Faculty) {
    this.isEditing = true;
    this.isAdding = true;
    this.editingId = faculty.id;
    this.newFaculty = { 
      name: faculty.name, 
      email: faculty.email, 
      department: faculty.department,
      subject_id: (faculty as any).subject_id || null
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.newFaculty = { name: '', email: '', department: 'Computer Science', subject_id: null };
    this.isEditing = false;
    this.isAdding = false;
    this.editingId = null;
    this.isLoading = false;
  }

  toggleAddForm() {
    if (this.isAdding) {
      this.cancelEdit();
    } else {
      this.isAdding = true;
      this.isEditing = false;
      this.newFaculty = { name: '', email: '', department: 'Computer Science', subject_id: null };
    }
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.resetForm();
    this.cdr.detectChanges();
  }

  deleteFaculty(id: number) {
    const facultyToDelete = this.facultyList.find(f => f.id === id);
    if (confirm('Are you sure you want to delete this faculty member?')) {
      this.isLoading = true;
      this.apiService.deleteFaculty(id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: () => {
          this.toast.success('Faculty member deleted');
          this.activityService.addActivity('faculty', 'Deleted Faculty', facultyToDelete?.name || 'Unknown');
          this.facultyList = this.facultyList.filter(f => f.id !== id);
          if (this.editingId === id) {
            this.cancelEdit();
          }
          this.applyFilters();
        },
        error: (err) => {
          this.toast.error('Failed to delete faculty member');
        }
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getSubjectName(subjectId: number | null | undefined): string {
    if (!subjectId) return 'N/A';
    const subject = this.subjects.find(s => s.id === subjectId);
    if (!subject) return 'N/A';
    return subject.name || 'Unknown Subject';
  }
}


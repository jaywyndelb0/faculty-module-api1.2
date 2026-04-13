import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { Subscription, combineLatest } from 'rxjs';
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
  sections: Section[] = [];
  newStudent = { name: '', section_id: '' };
  isAdding = false;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  
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
    private toast: ToastService
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
    this.dataService.refreshSections();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(s => {
      const matchText = !this.filterText || s.name.toLowerCase().includes(this.filterText.toLowerCase());
      const matchSection = !this.filterSection || s.section_id.toString() === this.filterSection;
      return matchText && matchSection;
    });
    this.currentPage = 1;
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

  addStudent() {
    if (!this.newStudent.name || !this.newStudent.section_id) {
      this.toast.warning('Please provide name and section');
      return;
    }

    this.isLoading = true;
    const studentData = { name: this.newStudent.name, section_id: parseInt(this.newStudent.section_id) };
    
    if (this.isEditing && this.editingId) {
      this.apiService.updateStudent(this.editingId, studentData).subscribe({
        next: () => {
          this.toast.success('Student updated');
          this.dataService.refreshStudents();
          this.cancelEdit();
          this.isLoading = false;
        },
        error: () => {
          this.toast.error('Failed to update student');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createStudent(studentData).subscribe({
        next: () => {
          this.toast.success('Student added');
          this.dataService.refreshStudents();
          this.newStudent = { name: '', section_id: '' };
          this.isAdding = false;
          this.isLoading = false;
        },
        error: () => {
          this.toast.error('Failed to add student');
          this.isLoading = false;
        }
      });
    }
  }

  editStudent(student: Student) {
    this.isEditing = true;
    this.isAdding = true;
    this.editingId = student.id;
    this.newStudent = { name: student.name, section_id: student.section_id.toString() };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.isAdding = false;
    this.editingId = null;
    this.newStudent = { name: '', section_id: '' };
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.isLoading = true;
      this.apiService.deleteStudent(id).subscribe({
        next: () => {
          this.toast.success('Student deleted');
          this.dataService.refreshStudents();
          this.isLoading = false;
        },
        error: () => {
          this.toast.error('Failed to delete student');
          this.isLoading = false;
        }
      });
    }
  }
}

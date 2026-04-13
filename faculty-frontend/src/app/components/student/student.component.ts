import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  sections: any[] = [];
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

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.loadSections();
  }

  loadStudents() {
    this.isLoading = true;
    this.apiService.getStudents().subscribe({
      next: (data) => {
        this.students = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error('Failed to load students');
        this.isLoading = false;
      }
    });
  }

  loadSections() {
    this.apiService.getSections().subscribe({
      next: (data) => {
        this.sections = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
      }
    });
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
    if (this.isEditing && this.editingId) {
      this.apiService.updateStudent(this.editingId, this.newStudent).subscribe({
        next: () => {
          this.toast.success('Student updated');
          this.loadStudents();
          this.cancelEdit();
        },
        error: () => {
          this.toast.error('Failed to update student');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createStudent(this.newStudent).subscribe({
        next: () => {
          this.toast.success('Student added');
          this.loadStudents();
          this.newStudent = { name: '', section_id: '' };
          this.isAdding = false;
        },
        error: () => {
          this.toast.error('Failed to add student');
          this.isLoading = false;
        }
      });
    }
  }

  editStudent(student: any) {
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
          this.loadStudents();
        },
        error: () => {
          this.toast.error('Failed to delete student');
          this.isLoading = false;
        }
      });
    }
  }
}

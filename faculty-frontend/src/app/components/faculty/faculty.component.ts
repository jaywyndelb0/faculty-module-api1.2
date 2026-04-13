import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.css'
})
export class FacultyComponent implements OnInit {
  facultyList: any[] = [];
  filteredFaculty: any[] = [];
  newFaculty = { name: '', email: '', department: 'Computer Science' };
  isAdding = false;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  
  // Filters
  filterText = '';
  filterDept = '';

  // Pagination
  pageSize = 10;
  currentPage = 1;

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadFaculty();
  }

  loadFaculty() {
    this.isLoading = true;
    this.apiService.getFaculty().subscribe({
      next: (data) => {
        this.facultyList = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error('Failed to load faculty list');
        this.isLoading = false;
      }
    });
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
    if (this.isEditing && this.editingId) {
      this.apiService.updateFaculty(this.editingId, this.newFaculty).subscribe({
        next: () => {
          this.toast.success('Faculty updated successfully');
          this.loadFaculty();
          this.cancelEdit();
        },
        error: (err) => {
          this.toast.error('Failed to update faculty');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.createFaculty(this.newFaculty).subscribe({
        next: () => {
          this.toast.success('Faculty added successfully');
          this.loadFaculty();
          this.resetForm();
          this.isAdding = false;
        },
        error: (err) => {
          this.toast.error('Failed to add faculty');
          this.isLoading = false;
        }
      });
    }
  }

  editFaculty(faculty: any) {
    this.isEditing = true;
    this.isAdding = true;
    this.editingId = faculty.id;
    this.newFaculty = { 
      name: faculty.name, 
      email: faculty.email, 
      department: faculty.department 
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.newFaculty = { name: '', email: '', department: 'Computer Science' };
    this.isEditing = false;
    this.editingId = null;
  }

  cancelEdit() {
    this.isAdding = false;
    this.resetForm();
  }

  deleteFaculty(id: number) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      this.isLoading = true;
      this.apiService.deleteFaculty(id).subscribe({
        next: () => {
          this.toast.success('Faculty member deleted');
          this.loadFaculty();
        },
        error: (err) => {
          this.toast.error('Failed to delete faculty member');
          this.isLoading = false;
        }
      });
    }
  }
}

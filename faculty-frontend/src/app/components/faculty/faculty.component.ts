import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { Faculty } from '../../models/api.models';

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

  private sub?: Subscription;

  constructor(
    private apiService: ApiService, 
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.sub = this.dataService.faculty$.subscribe(data => {
      this.facultyList = data;
      this.applyFilters();
    });
    this.dataService.refreshFaculty();
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
          this.dataService.refreshFaculty();
          this.cancelEdit();
          this.isLoading = false;
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
          this.dataService.refreshFaculty();
          this.resetForm();
          this.isAdding = false;
          this.isLoading = false;
        },
        error: (err) => {
          this.toast.error('Failed to add faculty');
          this.isLoading = false;
        }
      });
    }
  }

  editFaculty(faculty: Faculty) {
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
          this.dataService.refreshFaculty();
          this.isLoading = false;
        },
        error: (err) => {
          this.toast.error('Failed to delete faculty member');
          this.isLoading = false;
        }
      });
    }
  }
}

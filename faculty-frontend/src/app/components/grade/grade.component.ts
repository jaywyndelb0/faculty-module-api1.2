import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './grade.html',
  styleUrl: './grade.css'
})
export class GradeComponent implements OnInit {
  grades: any[] = [];
  filteredGrades: any[] = [];
  students: any[] = [];
  subjects: any[] = [];
  
  newGrade = { student_id: '', subject: '', grade: '1.0' };
  isEditing = false;
  editingGradeId: number | null = null;
  isLoading = false;
  
  // Filters
  filterStudent = '';
  filterSubject = '';
  filterDate = '';

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadGrades();
    this.loadStudents();
    this.loadSubjects();
  }

  loadGrades() {
    this.isLoading = true;
    this.apiService.getGrades().subscribe({
      next: (data) => {
        this.grades = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error('Failed to load grades');
        this.isLoading = false;
      }
    });
  }

  loadStudents() {
    this.apiService.getStudents().subscribe({
      next: (data) => {
        this.students = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
      }
    });
  }

  loadSubjects() {
    this.apiService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res.data || [];
      }
    });
  }

  applyFilters() {
    this.filteredGrades = this.grades.filter(g => {
      const matchStudent = !this.filterStudent || g.student_name.toLowerCase().includes(this.filterStudent.toLowerCase());
      const matchSubject = !this.filterSubject || g.subject.toLowerCase().includes(this.filterSubject.toLowerCase());
      const matchDate = !this.filterDate || g.created_at.includes(this.filterDate);
      return matchStudent && matchSubject && matchDate;
    });
  }

  resetFilters() {
    this.filterStudent = '';
    this.filterSubject = '';
    this.filterDate = '';
    this.applyFilters();
  }

  submitGrade() {
    if (!this.newGrade.student_id || !this.newGrade.subject) {
      this.toast.warning('Please select a student and a subject');
      return;
    }

    this.isLoading = true;
    if (this.isEditing && this.editingGradeId) {
      this.apiService.updateGrade(this.editingGradeId, this.newGrade).subscribe({
        next: () => {
          this.toast.success('Grade updated');
          this.loadGrades();
          this.resetForm();
        },
        error: (err) => {
          this.toast.error('Failed to update grade');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.uploadGrade(this.newGrade).subscribe({
        next: () => {
          this.toast.success('Grade uploaded');
          this.loadGrades();
          this.resetForm();
        },
        error: (err) => {
          this.toast.error('Failed to upload grade');
          this.isLoading = false;
        }
      });
    }
  }

  editGrade(grade: any) {
    this.isEditing = true;
    this.editingGradeId = grade.id;
    const student = this.students.find(s => s.name === grade.student_name);
    this.newGrade = {
      student_id: student ? student.id.toString() : '',
      subject: grade.subject,
      grade: grade.grade
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteGrade(id: number) {
    if (confirm('Are you sure you want to delete this grade record?')) {
      this.isLoading = true;
      this.apiService.deleteGrade(id).subscribe({
        next: () => {
          this.toast.success('Grade deleted');
          this.loadGrades();
        },
        error: (err) => {
          this.toast.error('Failed to delete grade');
          this.isLoading = false;
        }
      });
    }
  }

  resetForm() {
    this.newGrade = { student_id: '', subject: '', grade: '1.0' };
    this.isEditing = false;
    this.editingGradeId = null;
  }

  exportCSV() {
    if (this.filteredGrades.length === 0) return;
    
    const headers = ['Student', 'Subject', 'Grade', 'Date'];
    const rows = this.filteredGrades.map(g => [
      g.student_name,
      g.subject,
      g.grade,
      new Date(g.created_at).toLocaleDateString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grades_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.info('Report exported as CSV');
  }
}

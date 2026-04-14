import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { NotificationService } from '../../services/notification.service';
import { ActivityService } from '../../services/activity.service';
import { Subscription, combineLatest } from 'rxjs';
import { Grade, Student, Subject } from '../../models/api.models';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './grade.html',
  styleUrl: './grade.css'
})
export class GradeComponent implements OnInit, OnDestroy {
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  students: Student[] = [];
  subjects: Subject[] = [];
  
  newGrade = { student_id: '', subject: '', grade: '1.0' };
  isEditing = false;
  editingGradeId: number | null = null;
  isLoading = false;
  
  // Filters
  filterStudent = '';
  filterSubject = '';
  filterDate = '';

  private sub?: Subscription;

  constructor(
    private apiService: ApiService, 
    private dataService: DataService,
    private toast: ToastService,
    private notifService: NotificationService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.sub = combineLatest([
      this.dataService.grades$,
      this.dataService.students$,
      this.dataService.subjects$
    ]).subscribe(([grades, students, subjects]) => {
      this.grades = grades;
      this.students = students;
      this.subjects = subjects;
      this.applyFilters();
    });
    
    this.dataService.refreshGrades();
    this.dataService.refreshStudents();
    this.dataService.refreshSubjects();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
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
    const gradeData = {
      student_id: parseInt(this.newGrade.student_id),
      subject: this.newGrade.subject,
      grade: this.newGrade.grade
    };

    if (this.isEditing && this.editingGradeId) {
      this.apiService.updateGrade(this.editingGradeId, gradeData).subscribe({
        next: () => {
          this.toast.success('Grade updated');
          const student = this.students.find(s => s.id.toString() === this.newGrade.student_id);
          this.activityService.addActivity('grade', 'Updated Grade', `for ${student?.name || 'Student'}`);
          this.dataService.refreshGrades();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.toast.error('Failed to update grade');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.uploadGrade(gradeData).subscribe({
        next: () => {
          this.toast.success('Grade uploaded');
          
          // Trigger Notification
          const student = this.students.find(s => s.id.toString() === this.newGrade.student_id);
          this.notifService.addNotification({
            icon: '📝',
            title: 'New Grade Uploaded',
            message: `New grade <strong>${this.newGrade.grade}</strong> uploaded for <strong>${student ? student.name : 'Unknown Student'}</strong> in <strong>${this.newGrade.subject}</strong>`,
            type: 'grade'
          });

          this.activityService.addActivity('grade', 'Uploaded Grade', `${this.newGrade.grade} for ${student?.name || 'Student'}`);

          this.dataService.refreshGrades();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.toast.error('Failed to upload grade');
          this.isLoading = false;
        }
      });
    }
  }

  editGrade(grade: Grade) {
    this.isEditing = true;
    this.editingGradeId = grade.id;
    this.newGrade = {
      student_id: grade.student_id.toString(),
      subject: grade.subject,
      grade: grade.grade
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteGrade(id: number) {
    const gradeToDelete = this.grades.find(g => g.id === id);
    if (confirm('Are you sure you want to delete this grade record?')) {
      this.isLoading = true;
      this.apiService.deleteGrade(id).subscribe({
        next: () => {
          this.toast.success('Grade deleted');
          this.activityService.addActivity('grade', 'Deleted Grade', `for ${gradeToDelete?.student_name || 'Student'}`);
          this.dataService.refreshGrades();
          this.isLoading = false;
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

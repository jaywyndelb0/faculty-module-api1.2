import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class AttendanceComponent implements OnInit {
  attendance = { student_id: '', date: new Date().toISOString().split('T')[0], status: 'Present' };
  attendanceHistory: any[] = [];
  filteredHistory: any[] = [];
  students: any[] = [];
  searchStudentId: string = '';
  isLoading = false;
  isEditing = false;
  editingId: number | null = null;

  // Stats Summary
  summary = {
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    rate: '0%'
  };

  // Filters
  filterStatus = '';
  filterStartDate = '';
  filterEndDate = '';

  get selectedStudentName(): string {
    const student = this.students.find(s => s.id.toString() === this.searchStudentId);
    return student ? student.name : '';
  }

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.apiService.getStudents().subscribe({
      next: (data) => {
        this.students = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.cdr.detectChanges();
      }
    });
  }

  submitAttendance() {
    if (!this.attendance.student_id || !this.attendance.date) {
      this.toast.warning('Please select student and date');
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.editingId) {
      this.apiService.updateAttendance(this.editingId, this.attendance).subscribe({
        next: () => {
          this.toast.success('Attendance updated successfully');
          this.loadAttendanceHistory();
          this.cancelEdit();
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update attendance');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.recordAttendance(this.attendance).subscribe({
        next: () => {
          this.toast.success('Attendance recorded successfully');
          this.isLoading = false;
          if (this.searchStudentId === this.attendance.student_id) {
            this.loadAttendanceHistory();
          }
          this.resetForm();
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to record attendance');
          this.isLoading = false;
        }
      });
    }
  }

  onSearchStudentChange() {
    if (this.searchStudentId) {
      this.loadAttendanceHistory();
    } else {
      this.attendanceHistory = [];
      this.filteredHistory = [];
      this.calculateSummary();
    }
  }

  loadAttendanceHistory() {
    if (!this.searchStudentId) {
      this.toast.warning('Please select a student to view history');
      return;
    }

    this.isLoading = true;
    this.apiService.getStudentAttendance(+this.searchStudentId).subscribe({
      next: (res) => {
        this.attendanceHistory = res.data || [];
        this.applyFilters();
        this.calculateSummary();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error('Failed to load attendance history');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredHistory = this.attendanceHistory.filter(h => {
      const matchStatus = !this.filterStatus || h.status === this.filterStatus;
      const matchStart = !this.filterStartDate || new Date(h.date) >= new Date(this.filterStartDate);
      const matchEnd = !this.filterEndDate || new Date(h.date) <= new Date(this.filterEndDate);
      return matchStatus && matchStart && matchEnd;
    });
    this.calculateSummary();
  }

  resetFilters() {
    this.filterStatus = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.applyFilters();
  }

  calculateSummary() {
    const total = this.filteredHistory.length;
    const present = this.filteredHistory.filter(h => h.status === 'Present').length;
    const late = this.filteredHistory.filter(h => h.status === 'Late').length;
    const absent = this.filteredHistory.filter(h => h.status === 'Absent').length;
    const excused = this.filteredHistory.filter(h => h.status === 'Excused').length;
    
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) + '%' : '0%';

    this.summary = { total, present, late, absent, excused, rate };
  }

  editRecord(record: any) {
    this.isEditing = true;
    this.editingId = record.id;
    this.attendance = {
      student_id: record.student_id.toString(),
      date: record.date.split(' ')[0], // Handle format YYYY-MM-DD
      status: record.status
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  deleteRecord(id: number) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.isLoading = true;
      this.apiService.deleteAttendance(id).subscribe({
        next: () => {
          this.toast.success('Attendance record deleted');
          this.loadAttendanceHistory();
        },
        error: () => {
          this.toast.error('Failed to delete attendance record');
          this.isLoading = false;
        }
      });
    }
  }

  resetForm() {
    this.attendance = { 
      student_id: '', 
      date: new Date().toISOString().split('T')[0], 
      status: 'Present' 
    };
  }

  exportCSV() {
    if (this.filteredHistory.length === 0) return;
    const student = this.students.find(s => s.id.toString() === this.searchStudentId);
    
    const headers = ['Date', 'Status'];
    const rows = this.filteredHistory.map(h => [
      new Date(h.date).toLocaleDateString(),
      h.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + `Attendance Report for ${student?.name || 'Student ID ' + this.searchStudentId}\n`
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `attendance_${student?.name.replace(/\s+/g, '_') || this.searchStudentId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.info('Attendance exported as CSV');
  }
}

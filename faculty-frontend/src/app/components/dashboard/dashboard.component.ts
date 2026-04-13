import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  modules = [
    { name: 'Faculty Management', route: '/faculty', icon: '👨‍🏫', description: 'Manage staff and view schedules' },
    { name: 'Student Management', route: '/student', icon: '🎓', description: 'Manage student records' },
    { name: 'Grades Management', route: '/grade', icon: '📊', description: 'Upload and track student grades' },
    { name: 'Attendance Management', route: '/attendance', icon: '📝', description: 'Record and monitor attendance' }
  ];

  stats = {
    facultyCount: 0,
    studentCount: 0,
    gradesCount: 0,
    avgPerformance: '0.00'
  };

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadStats();
  }

  loadStats() {
    this.apiService.getFaculty().subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.stats.facultyCount = list.length;
        this.cdr.detectChanges();
      }
    });

    this.apiService.getStudents().subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.stats.studentCount = list.length;
        this.cdr.detectChanges();
      }
    });

    this.apiService.getGrades().subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : (data && (data as any).data ? (data as any).data : []);
        this.stats.gradesCount = list.length;
        if (list.length > 0) {
          const sum = list.reduce((acc: number, curr: any) => acc + parseFloat(curr.grade), 0);
          this.stats.avgPerformance = (sum / list.length).toFixed(2);
        }
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

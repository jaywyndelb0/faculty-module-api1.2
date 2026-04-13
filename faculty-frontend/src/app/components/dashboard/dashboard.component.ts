import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  private sub?: Subscription;

  constructor(
    private router: Router, 
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.loadAll();
    this.sub = combineLatest([
      this.dataService.faculty$,
      this.dataService.students$,
      this.dataService.grades$
    ]).subscribe(([faculty, students, grades]) => {
      this.stats.facultyCount = faculty.length;
      this.stats.studentCount = students.length;
      this.stats.gradesCount = grades.length;
      
      if (grades.length > 0) {
        const sum = grades.reduce((acc, curr) => acc + parseFloat(curr.grade), 0);
        this.stats.avgPerformance = (sum / grades.length).toFixed(2);
      } else {
        this.stats.avgPerformance = '0.00';
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

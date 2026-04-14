import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ActivityService, Activity } from '../../services/activity.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container animate-fade-in">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your school system today.</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary">
            <span>+</span> Quick Action
          </button>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card premium-card">
          <div class="stat-icon faculty">👨‍🏫</div>
          <div class="stat-content">
            <span class="stat-label">Total Faculty</span>
            <h2 class="stat-value">{{ stats.facultyCount }}</h2>
            <span class="stat-trend positive">↑ 12% from last month</span>
          </div>
        </div>
        <div class="stat-card premium-card">
          <div class="stat-icon students">🎓</div>
          <div class="stat-content">
            <span class="stat-label">Total Students</span>
            <h2 class="stat-value">{{ stats.studentCount }}</h2>
            <span class="stat-trend positive">↑ 5% from last month</span>
          </div>
        </div>
        <div class="stat-card premium-card">
          <div class="stat-icon grades">📊</div>
          <div class="stat-content">
            <span class="stat-label">Grades Uploaded</span>
            <h2 class="stat-value">{{ stats.gradesCount }}</h2>
            <span class="stat-trend">Stable this week</span>
          </div>
        </div>
        <div class="stat-card premium-card">
          <div class="stat-icon performance">📈</div>
          <div class="stat-content">
            <span class="stat-label">Avg. Performance</span>
            <h2 class="stat-value">{{ stats.avgPerformance }}</h2>
            <span class="stat-trend positive">↑ 0.2pts increase</span>
          </div>
        </div>
      </div>

      <!-- Module Management Cards -->
      <div class="section-header">
        <h2>System Management</h2>
        <p>Quick access to core modules and administrative tools.</p>
      </div>

      <div class="modules-grid">
        <div *ngFor="let module of modules" 
             [routerLink]="module.route" 
             class="module-card premium-card clickable">
          <div class="module-icon-box">
            <span class="module-emoji">{{ module.icon }}</span>
          </div>
          <div class="module-info">
            <h3>{{ module.name }}</h3>
            <p>{{ module.description }}</p>
          </div>
          <div class="module-arrow">→</div>
        </div>
      </div>

      <!-- Recent Activity / Placeholder for future enhancements -->
      <div class="bottom-grid">
        <div class="activity-card premium-card">
          <div class="card-header-premium">
            <h3>Recent System Activity</h3>
            <button class="text-btn" (click)="clearActivities()">Clear All</button>
          </div>
          <div class="activity-list">
            <div class="activity-item animate-slide-in" *ngFor="let activity of activities; trackBy: trackByActivityId">
              <div class="activity-icon-box" [class]="activity.type">
                {{ activity.icon }}
              </div>
              <div class="activity-details">
                <p>
                  <span class="action-text">{{ activity.action }}</span> 
                  <span class="entity-text">{{ activity.entity }}</span>
                </p>
                <span class="activity-time">{{ getRelativeTime(activity.timestamp) }}</span>
              </div>
            </div>
            <div class="empty-activity" *ngIf="activities.length === 0">
              <div class="empty-icon">📭</div>
              <p>No recent activities found.</p>
            </div>
          </div>
        </div>

        <div class="quick-links-card premium-card">
          <div class="card-header-premium">
            <h3>Quick Resources</h3>
          </div>
          <div class="links-grid">
            <a href="#" class="quick-link">
              <span class="link-icon">📁</span>
              <span>Class Reports</span>
            </a>
            <a href="#" class="quick-link">
              <span class="link-icon">📅</span>
              <span>Academic Calendar</span>
            </a>
            <a href="#" class="quick-link">
              <span class="link-icon">📩</span>
              <span>Message Center</span>
            </a>
            <a href="#" class="quick-link">
              <span class="link-icon">🛡️</span>
              <span>Security Logs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2.5rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }

    .welcome-text h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .welcome-text p {
      color: var(--text-muted);
      font-size: 1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 1.75rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      flex-shrink: 0;
    }

    .stat-icon.faculty { background: var(--primary-surface); color: var(--primary); }
    .stat-icon.students { background: var(--info-surface); color: var(--info); }
    .stat-icon.grades { background: var(--success-surface); color: var(--success); }
    .stat-icon.performance { background: var(--warning-surface); color: var(--warning); }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
      line-height: 1;
    }

    .stat-trend {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
      display: block;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: var(--success);
    }

    /* Section Header */
    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .section-header p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    /* Module Cards */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .module-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      cursor: pointer;
      position: relative;
    }

    .module-icon-box {
      width: 64px;
      height: 64px;
      background: var(--bg-main);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      transition: all 0.3s ease;
    }

    .module-card:hover .module-icon-box {
      background: var(--primary-surface);
      transform: scale(1.1) rotate(-5deg);
    }

    .module-info h3 {
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .module-info p {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
    }

    .module-arrow {
      margin-left: auto;
      font-size: 1.25rem;
      color: var(--text-placeholder);
      transition: all 0.3s ease;
    }

    .module-card:hover .module-arrow {
      color: var(--primary);
      transform: translateX(5px);
    }

    /* Bottom Grid */
    .bottom-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .card-header-premium {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .card-header-premium h3 {
      font-size: 1.125rem;
      margin: 0;
    }

    .activity-list {
      padding: 0.5rem 1.5rem 1.5rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border-light);
      align-items: center;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .activity-item:hover .activity-icon-box {
      transform: scale(1.1);
    }

    .activity-icon-box.grade { background: var(--success-surface); }
    .activity-icon-box.attendance { background: var(--info-surface); }
    .activity-icon-box.faculty { background: var(--primary-surface); }
    .activity-icon-box.student { background: var(--info-surface); }

    .action-text {
      font-weight: 700;
      color: var(--text-main);
      margin-right: 4px;
    }

    .entity-text {
      color: var(--text-body);
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .empty-activity {
      padding: 3rem 2rem;
      text-align: center;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .links-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding: 1.5rem;
    }

    .quick-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background: var(--bg-main);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--text-body);
      font-size: 0.8125rem;
      font-weight: 700;
      gap: 0.5rem;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .quick-link:hover {
      background: white;
      border-color: var(--primary-light);
      color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .link-icon {
      font-size: 1.5rem;
    }

    .text-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
    }

    @media (max-width: 1024px) {
      .bottom-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .dashboard-container { padding: 1.5rem; }
      .welcome-section { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .links-grid { grid-template-columns: 1fr; }
    }
  `]
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

  activities: Activity[] = [];
  private sub?: Subscription;

  constructor(
    private router: Router, 
    private dataService: DataService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.dataService.loadAll();
    this.sub = combineLatest([
      this.dataService.faculty$,
      this.dataService.students$,
      this.dataService.grades$,
      this.activityService.activities$
    ]).subscribe(([faculty, students, grades, activities]) => {
      this.stats.facultyCount = faculty.length;
      this.stats.studentCount = students.length;
      this.stats.gradesCount = grades.length;
      this.activities = activities;
      
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

  getRelativeTime(date: Date): string {
    return this.activityService.getRelativeTime(date);
  }

  clearActivities() {
    if (confirm('Are you sure you want to clear all recent activity?')) {
      this.activityService.clearActivities();
    }
  }

  trackByActivityId(index: number, item: Activity) {
    return item.id;
  }
}

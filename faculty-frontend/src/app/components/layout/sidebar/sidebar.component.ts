import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <span class="logo-icon">🏫</span>
        </div>
        <div class="brand-info">
          <span class="brand-name">EduAdmin</span>
          <span class="brand-tag">Management System</span>
        </div>
      </div>

      <div class="sidebar-scroll custom-scrollbar">
        <div class="nav-section">
          <span class="section-label">Main Menu</span>
          <nav class="nav-list">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
              <span class="nav-indicator"></span>
            </a>
            <a routerLink="/faculty" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👨‍🏫</span>
              <span class="nav-text">Faculty</span>
              <span class="nav-indicator"></span>
            </a>
            <a routerLink="/student" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🎓</span>
              <span class="nav-text">Students</span>
              <span class="nav-indicator"></span>
            </a>
            <a routerLink="/grade" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📈</span>
              <span class="nav-text">Grades</span>
              <span class="nav-indicator"></span>
            </a>
            <a routerLink="/attendance" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              <span class="nav-text">Attendance</span>
              <span class="nav-indicator"></span>
            </a>
          </nav>
        </div>

        <div class="nav-section">
          <span class="section-label">Account</span>
          <nav class="nav-list">
            <button (click)="logout()" class="nav-item logout-nav-item">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">AD</div>
          <div class="user-details">
            <span class="user-name">Admin User</span>
            <span class="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: white;
      border-right: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-brand {
      height: var(--header-height);
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.4);
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.025em;
      line-height: 1.2;
    }

    .brand-tag {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 1rem;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .section-label {
      display: block;
      padding: 0 0.75rem;
      margin-bottom: 0.75rem;
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--text-placeholder);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.75rem;
      border-radius: var(--radius-md);
      color: var(--text-body);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      position: relative;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-item:hover {
      background: var(--bg-main);
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--primary-surface);
      color: var(--primary);
    }

    .logout-nav-item {
      color: var(--danger);
      font-weight: 700;
      margin-top: 0.5rem;
      border: 1px solid transparent;
    }

    .logout-nav-item:hover {
      background: var(--danger-surface);
      color: var(--danger-dark, #dc2626);
      border-color: rgba(220, 38, 38, 0.1);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-indicator {
      position: absolute;
      right: 0.75rem;
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
    }

    .nav-item.active .nav-indicator {
      opacity: 1;
      transform: scale(1);
    }

    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid var(--border-light);
      background: var(--bg-main);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-surface);
      color: var(--primary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.75rem;
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.65rem;
      color: var(--text-muted);
      font-weight: 600;
    }
  `]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}

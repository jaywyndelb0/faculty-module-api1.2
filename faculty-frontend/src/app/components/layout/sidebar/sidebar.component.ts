import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <span class="logo-icon">🏫</span>
        <span class="logo-text">EduAdmin</span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">📊</span>
              <span class="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/faculty" routerLinkActive="active">
              <span class="icon">👨‍🏫</span>
              <span class="text">Faculty</span>
            </a>
          </li>
          <li>
            <a routerLink="/student" routerLinkActive="active">
              <span class="icon">🎓</span>
              <span class="text">Students</span>
            </a>
          </li>
          <li>
            <a routerLink="/grade" routerLinkActive="active">
              <span class="icon">📈</span>
              <span class="text">Grades</span>
            </a>
          </li>
          <li>
            <a routerLink="/attendance" routerLinkActive="active">
              <span class="icon">📝</span>
              <span class="text">Attendance</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn">
          <span class="icon">🚪</span>
          <span class="text">Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: #1e293b;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    .sidebar-header {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid #334155;
    }
    .logo-icon { font-size: 1.5rem; }
    .logo-text { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.025em; }
    .sidebar-nav { flex: 1; padding: 1.5rem 0; }
    .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
    .sidebar-nav li { margin-bottom: 0.25rem; }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s;
    }
    .sidebar-nav a:hover { background: #334155; color: #f8fafc; }
    .sidebar-nav a.active { background: #3b82f6; color: #ffffff; }
    .sidebar-nav .icon { font-size: 1.25rem; }
    .sidebar-footer { padding: 1.5rem; border-top: 1px solid #334155; }
    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: transparent;
      border: 1px solid #334155;
      color: #94a3b8;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .logout-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
  `]
})
export class SidebarComponent {
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

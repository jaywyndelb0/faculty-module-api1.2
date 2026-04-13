import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-btn">
          <span class="icon">☰</span>
        </button>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search for data, records, or students...">
        </div>
      </div>
      <div class="header-right">
        <div class="notification-btn">
          <span class="icon">🔔</span>
          <span class="badge">3</span>
        </div>
        <div class="user-profile">
          <div class="user-avatar">AD</div>
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left { display: flex; align-items: center; gap: 1.5rem; flex: 1; }
    .menu-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #64748b;
      display: none; /* Mobile only toggle */
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: #f1f5f9;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      gap: 0.75rem;
      width: 100%;
      max-width: 400px;
    }
    .search-bar input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.875rem;
      width: 100%;
    }
    .header-right { display: flex; align-items: center; gap: 2rem; }
    .notification-btn {
      position: relative;
      font-size: 1.25rem;
      cursor: pointer;
      color: #64748b;
    }
    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: white;
      font-size: 0.65rem;
      padding: 2px 5px;
      border-radius: 50%;
      border: 2px solid white;
    }
    .user-profile { display: flex; align-items: center; gap: 0.75rem; }
    .user-avatar {
      width: 40px;
      height: 40px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
    .user-role { font-size: 0.75rem; color: #64748b; }
  `]
})
export class HeaderComponent implements OnInit {
  ngOnInit() {}
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
        <div class="notification-container">
          <button class="notification-btn" (click)="toggleNotifications($event)" [class.active]="showNotifications">
            <span class="icon">🔔</span>
            <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
          </button>
          
          <div class="notification-dropdown" *ngIf="showNotifications" (click)="$event.stopPropagation()">
            <div class="dropdown-header">
              <h4>Notifications</h4>
              <button class="mark-all" (click)="markAllAsRead()">Mark all as read</button>
            </div>
            <div class="dropdown-body">
              <div class="notification-item" *ngFor="let n of notifications" [class.unread]="n.unread">
                <div class="item-icon">{{ n.icon }}</div>
                <div class="item-content">
                  <p [innerHTML]="n.message"></p>
                  <span class="item-time">{{ n.time }}</span>
                </div>
              </div>
              <div class="empty-notifications" *ngIf="notifications.length === 0">
                No new notifications
              </div>
            </div>
            <div class="dropdown-footer">
              <a routerLink="/notifications">View all notifications</a>
            </div>
          </div>
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
    
    .notification-container {
      position: relative;
    }
    .notification-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 50%;
      font-size: 1.25rem;
      cursor: pointer;
      color: #64748b;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: 10;
    }
    .notification-btn:hover, .notification-btn.active {
      background: #f1f5f9;
      color: #3b82f6;
    }
    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: #ef4444;
      color: white;
      font-size: 0.65rem;
      padding: 2px 5px;
      border-radius: 10px;
      border: 2px solid white;
      min-width: 18px;
      text-align: center;
      z-index: 11;
      pointer-events: none;
    }
    
    .notification-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: -10px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      z-index: 1000;
      overflow: hidden;
      animation: dropdownIn 0.2s ease-out;
    }
    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dropdown-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dropdown-header h4 { margin: 0; font-size: 0.9375rem; font-weight: 600; color: #1e293b; }
    .mark-all {
      background: none;
      border: none;
      color: #3b82f6;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
    }
    .dropdown-body { max-height: 350px; overflow-y: auto; }
    .notification-item {
      padding: 1rem;
      display: flex;
      gap: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid #f1f5f9;
    }
    .notification-item:hover { background: #f8fafc; }
    .notification-item.unread { background: #eff6ff; }
    .notification-item.unread::after {
      content: '';
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
      margin-top: 8px;
    }
    .item-icon {
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      flex-shrink: 0;
    }
    .item-content p { margin: 0; font-size: 0.8125rem; color: #475569; line-height: 1.4; }
    .item-time { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; display: block; }
    .empty-notifications {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    .dropdown-footer {
      padding: 0.75rem;
      text-align: center;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .dropdown-footer a {
      color: #3b82f6;
      font-size: 0.8125rem;
      font-weight: 600;
      text-decoration: none;
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
export class HeaderComponent implements OnInit, OnDestroy {
  showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  private sub?: Subscription;

  constructor(private notifService: NotificationService) {
    // Close dropdown when clicking outside
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        this.showNotifications = false;
      });
    }
  }

  ngOnInit() {
    this.sub = this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = this.notifService.getUnreadCount();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    
    // When opening the dropdown, mark all as read
    if (this.showNotifications) {
      this.markAllAsRead();
    }
  }

  markAllAsRead() {
    this.notifService.markAllAsRead();
  }
}

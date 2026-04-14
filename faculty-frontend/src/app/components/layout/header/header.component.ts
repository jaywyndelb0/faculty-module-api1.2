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
      <div class="header-content-wrapper">
        <div class="header-left">
          <button class="mobile-toggle">
            <span>☰</span>
          </button>
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search students, faculty, or reports...">
            <span class="search-shortcut">⌘K</span>
          </div>
        </div>

        <div class="header-right">
          <div class="action-items">
            <div class="notification-wrapper">
              <button class="icon-btn notification-btn" (click)="toggleNotifications($event)" [class.active]="showNotifications">
                <span class="icon">🔔</span>
                <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
              </button>
              
              <div class="notification-dropdown animate-fade-in" *ngIf="showNotifications" (click)="$event.stopPropagation()">
                <div class="dropdown-header">
                  <div class="header-title">
                    <h4>Notifications</h4>
                    <span class="unread-tag" *ngIf="unreadCount > 0">{{ unreadCount }} new</span>
                  </div>
                  <button class="mark-all-btn" (click)="markAllAsRead()">Mark all as read</button>
                </div>
                <div class="dropdown-body custom-scrollbar">
                  <div class="notification-item" *ngFor="let n of notifications" [class.unread]="n.unread">
                    <div class="item-icon-wrapper" [class]="n.type">
                      {{ n.icon }}
                    </div>
                    <div class="item-details">
                      <p [innerHTML]="n.message"></p>
                      <span class="item-time">{{ n.time }}</span>
                    </div>
                    <div class="unread-dot" *ngIf="n.unread"></div>
                  </div>
                  <div class="empty-state" *ngIf="notifications.length === 0">
                    <div class="empty-icon">🔔</div>
                    <p>No new notifications</p>
                  </div>
                </div>
                <div class="dropdown-footer">
                  <a routerLink="/notifications">View all notifications →</a>
                </div>
              </div>
            </div>

            <button class="icon-btn">
              <span class="icon">⚙️</span>
            </button>
          </div>

          <div class="divider"></div>

          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">Admin User</span>
              <span class="user-role">Super Admin</span>
            </div>
            <div class="user-avatar-wrapper">
              <div class="user-avatar">AD</div>
              <div class="status-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: var(--header-height);
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-light);
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
    }

    .header-content-wrapper {
      max-width: 1600px;
      height: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Left Section */
    .header-left {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex: 1;
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
    }

    .search-container {
      position: relative;
      width: 100%;
      max-width: 440px;
      transition: all 0.3s ease;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-placeholder);
      font-size: 0.9rem;
    }

    .search-container input {
      width: 100%;
      height: 44px;
      background: var(--bg-main);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      padding: 0 3.5rem 0 2.75rem;
      font-size: 0.875rem;
      color: var(--text-main);
      transition: all 0.2s ease;
    }

    .search-container input:focus {
      background: white;
      border-color: var(--primary-light);
      box-shadow: 0 0 0 4px var(--primary-surface);
      outline: none;
    }

    .search-shortcut {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      pointer-events: none;
    }

    /* Right Section */
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .action-items {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .icon-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }

    .icon-btn:hover, .icon-btn.active {
      background: var(--bg-main);
      color: var(--primary);
    }

    .badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: var(--danger);
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: 10px;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .divider {
      width: 1px;
      height: 32px;
      background: var(--border-light);
    }

    /* User Profile */
    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 4px;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-profile:hover {
      background: var(--bg-main);
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .user-avatar-wrapper {
      position: relative;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--success);
      border: 2px solid white;
      border-radius: 50%;
    }

    /* Notifications Dropdown */
    .notification-wrapper {
      position: relative;
    }

    .notification-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: -10px;
      width: 360px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border);
      z-index: 1000;
      overflow: hidden;
    }

    .dropdown-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title h4 {
      font-size: 1rem;
      margin: 0;
    }

    .unread-tag {
      font-size: 0.7rem;
      background: var(--primary-surface);
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 700;
      margin-top: 4px;
      display: inline-block;
    }

    .mark-all-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }

    .dropdown-body {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      padding: 1.25rem 1.5rem;
      display: flex;
      gap: 1rem;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid var(--border-light);
    }

    .notification-item:hover {
      background: var(--bg-main);
    }

    .notification-item.unread {
      background: rgba(99, 102, 241, 0.02);
    }

    .item-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      background: var(--bg-main);
    }

    .item-icon-wrapper.grade { background: var(--success-surface); }
    .item-icon-wrapper.attendance { background: var(--info-surface); }
    .item-icon-wrapper.faculty { background: var(--primary-surface); }

    .item-details p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-body);
      line-height: 1.5;
    }

    .item-time {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 4px;
      display: block;
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      background: var(--primary);
      border-radius: 50%;
      position: absolute;
      right: 1.5rem;
      top: 1.5rem;
    }

    .dropdown-footer {
      padding: 1rem;
      text-align: center;
      background: var(--bg-main);
    }

    .dropdown-footer a {
      color: var(--primary);
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .header-content-wrapper { padding: 0 1rem; }
      .search-container { display: none; }
      .mobile-toggle { display: block; }
      .user-info { display: none; }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  private sub?: Subscription;

  constructor(private notifService: NotificationService) {
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
    if (this.showNotifications) {
      this.markAllAsRead();
    }
  }

  markAllAsRead() {
    this.notifService.markAllAsRead();
  }
}

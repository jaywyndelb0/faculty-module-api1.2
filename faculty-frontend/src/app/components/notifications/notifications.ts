import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <div class="header-content">
          <h1>All Notifications</h1>
          <p>Stay updated with the latest activities and alerts.</p>
        </div>
        <button class="btn btn-primary" (click)="markAllAsRead()" *ngIf="unreadCount > 0">Mark All as Read</button>
      </div>

      <div class="notifications-list card animate-fade-in">
        <div class="notification-item" *ngFor="let n of notifications" [class.unread]="n.unread">
          <div class="item-icon">{{ n.icon }}</div>
          <div class="item-details">
            <div class="item-header">
              <h3>{{ n.title }}</h3>
              <span class="time">{{ n.time }}</span>
            </div>
            <p [innerHTML]="n.message"></p>
          </div>
          <div class="item-actions">
            <button class="btn-icon">👁️</button>
            <button class="btn-icon">🗑️</button>
          </div>
        </div>
        <div class="empty-state" *ngIf="notifications.length === 0">
          <div class="empty-icon">📭</div>
          <h3>No notifications yet</h3>
          <p>We'll notify you when something important happens.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-page {
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 2rem;
    }
    .notifications-list {
      padding: 0;
      overflow: hidden;
      min-height: 200px;
    }
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      gap: 1.25rem;
      transition: all 0.2s;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .notification-item:hover {
      background: #f8fafc;
    }
    .notification-item.unread {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }
    .item-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }
    .item-details {
      flex: 1;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .item-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .time {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .item-details p {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.5;
    }
    .item-actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .notification-item:hover .item-actions {
      opacity: 1;
    }
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }
    .btn-icon:hover {
      background: #e2e8f0;
    }
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      color: #94a3b8;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .empty-state h3 {
      color: #475569;
      margin-bottom: 0.5rem;
    }
  `]
})
export class Notifications implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private sub?: Subscription;

  constructor(private notifService: NotificationService) {}

  ngOnInit() {
    this.sub = this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = this.notifService.getUnreadCount();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  markAllAsRead() {
    this.notifService.markAllAsRead();
  }
}

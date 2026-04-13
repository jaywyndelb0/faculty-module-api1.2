import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'grade' | 'attendance' | 'faculty' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      icon: '📝',
      title: 'New Grade Uploaded',
      message: 'A new grade has been uploaded for <strong>Cardo Dalisay</strong>',
      time: '2 mins ago',
      unread: true,
      type: 'grade'
    },
    {
      id: 2,
      icon: '📅',
      title: 'Attendance Report Ready',
      message: 'Attendance report for <strong>BSIT-1A</strong> is ready',
      time: '1 hour ago',
      unread: true,
      type: 'attendance'
    },
    {
      id: 3,
      icon: '👤',
      title: 'New Faculty Member',
      message: 'New faculty member <strong>Jose Rizal</strong> joined',
      time: '5 hours ago',
      unread: false,
      type: 'faculty'
    }
  ]);

  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: Omit<Notification, 'id' | 'time' | 'unread'>) {
    const current = this.notificationsSubject.value;
    const newNotif: Notification = {
      ...notification,
      id: Date.now(),
      time: 'Just now',
      unread: true
    };
    this.notificationsSubject.next([newNotif, ...current]);
  }

  markAllAsRead() {
    const current = this.notificationsSubject.value;
    const updated = current.map(n => ({ ...n, unread: false }));
    this.notificationsSubject.next(updated);
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => n.unread).length;
  }
}

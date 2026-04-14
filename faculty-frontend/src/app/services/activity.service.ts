import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Activity {
  id: number;
  type: 'faculty' | 'student' | 'grade' | 'attendance';
  action: string; // e.g., 'Added', 'Updated', 'Deleted'
  entity: string; // e.g., 'Juan Dela Cruz', 'BSIT-1A'
  timestamp: Date;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly STORAGE_KEY = 'edu_admin_activities';
  private activitiesSubject = new BehaviorSubject<Activity[]>(this.loadFromStorage());

  activities$ = this.activitiesSubject.asObservable();

  private getIcon(type: Activity['type']): string {
    const icons = {
      faculty: '👨‍🏫',
      student: '🎓',
      grade: '📊',
      attendance: '📝'
    };
    return icons[type];
  }

  private loadFromStorage(): Activity[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [
        {
          id: 1,
          type: 'grade',
          action: 'Grade Uploaded',
          entity: 'Section BSIT-1A',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          icon: '📊'
        },
        {
          id: 2,
          type: 'attendance',
          action: 'Attendance Recorded',
          entity: 'Section BSCS-2B',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          icon: '📝'
        }
      ];
    }
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
    } catch (e) {
      return [];
    }
  }

  private saveToStorage(activities: Activity[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
  }

  addActivity(type: Activity['type'], action: string, entity: string) {
    const current = this.activitiesSubject.value;
    const newActivity: Activity = {
      id: Date.now(),
      type,
      action,
      entity,
      timestamp: new Date(),
      icon: this.getIcon(type)
    };
    
    const updated = [newActivity, ...current].slice(0, 20); // Keep last 20
    this.activitiesSubject.next(updated);
    this.saveToStorage(updated);
  }

  clearActivities() {
    this.activitiesSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  }
}

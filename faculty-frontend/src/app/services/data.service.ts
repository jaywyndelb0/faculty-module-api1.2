import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { Faculty, Student, Grade, Section, Subject } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private facultySubject = new BehaviorSubject<Faculty[]>([]);
  faculty$ = this.facultySubject.asObservable();

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  students$ = this.studentsSubject.asObservable();

  private gradesSubject = new BehaviorSubject<Grade[]>([]);
  grades$ = this.gradesSubject.asObservable();

  private sectionsSubject = new BehaviorSubject<Section[]>([]);
  sections$ = this.sectionsSubject.asObservable();

  private subjectsSubject = new BehaviorSubject<Subject[]>([]);
  subjects$ = this.subjectsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadAll() {
    this.refreshFaculty();
    this.refreshStudents();
    this.refreshGrades();
    this.refreshSections();
    this.refreshSubjects();
  }

  refreshFaculty() {
    this.apiService.getFaculty().pipe(
      map(res => Array.isArray(res) ? res : res.data),
      tap(data => this.facultySubject.next(data))
    ).subscribe();
  }

  refreshStudents() {
    console.log('Refreshing Students Directory...');
    this.apiService.getStudents().pipe(
      map(res => {
        const data = Array.isArray(res) ? res : res.data;
        console.log('Students fetched from local API:', data);
        return data;
      }),
      tap(data => this.studentsSubject.next(data))
    ).subscribe({
      error: (err) => console.error('Failed to fetch students:', err)
    });
  }

  refreshGrades() {
    this.apiService.getGrades().pipe(
      map(res => Array.isArray(res) ? res : res.data),
      tap(data => this.gradesSubject.next(data))
    ).subscribe();
  }

  refreshSections(forceRefresh: boolean = false) {
    // If not forced and we already have data, just return
    if (!forceRefresh && this.sectionsSubject.value.length > 0) {
      // Still refresh from local DB to be sure, but skip the remote sync
      this.apiService.getSections().subscribe({
        next: (localRes) => {
          const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
          this.sectionsSubject.next(localData);
        }
      });
      return;
    }

    // Full sync from Registrar API
    this.apiService.getRemoteSections().subscribe({
      next: (res) => {
        const sections = Array.isArray(res) ? res : (res.data || []);
        if (sections.length > 0) {
          this.apiService.syncSections(sections).subscribe({
            next: () => {
              this.apiService.getSections().subscribe({
                next: (localRes) => {
                  const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
                  this.sectionsSubject.next(localData);
                }
              });
            }
          });
        }
      },
      error: (err) => {
        this.apiService.getSections().subscribe(localRes => {
          const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
          this.sectionsSubject.next(localData);
        });
      }
    });
  }

  refreshSubjects(forceRefresh: boolean = false) {
    // If not forced and we already have data, just return
    if (!forceRefresh && this.subjectsSubject.value.length > 0) {
      this.apiService.getSubjects().subscribe({
        next: (localRes) => {
          const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
          this.subjectsSubject.next(localData);
        }
      });
      return;
    }

    this.apiService.getRemoteSubjects().subscribe({
      next: (res) => {
        const subjects = Array.isArray(res) ? res : (res.data || []);
        if (subjects.length > 0) {
          this.apiService.syncSubjects(subjects).subscribe({
            next: () => {
              this.apiService.getSubjects().subscribe({
                next: (localRes) => {
                  const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
                  this.subjectsSubject.next(localData);
                }
              });
            }
          });
        }
      },
      error: (err) => {
        this.apiService.getSubjects().subscribe(localRes => {
          const localData = Array.isArray(localRes) ? localRes : (localRes.data || []);
          this.subjectsSubject.next(localData);
        });
      }
    });
  }

  // Helper methods to get current snapshot
  getStudentsSnapshot() { return this.studentsSubject.value; }
  getFacultySnapshot() { return this.facultySubject.value; }
  getGradesSnapshot() { return this.gradesSubject.value; }
}

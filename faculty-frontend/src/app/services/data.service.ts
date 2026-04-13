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
    this.apiService.getStudents().pipe(
      map(res => Array.isArray(res) ? res : res.data),
      tap(data => this.studentsSubject.next(data))
    ).subscribe();
  }

  refreshGrades() {
    this.apiService.getGrades().pipe(
      map(res => Array.isArray(res) ? res : res.data),
      tap(data => this.gradesSubject.next(data))
    ).subscribe();
  }

  refreshSections() {
    this.apiService.getSections().pipe(
      map(res => Array.isArray(res) ? res : res.data),
      tap(data => this.sectionsSubject.next(data))
    ).subscribe();
  }

  refreshSubjects() {
    this.apiService.getSubjects().pipe(
      map(res => res.data),
      tap(data => this.subjectsSubject.next(data))
    ).subscribe();
  }

  // Helper methods to get current snapshot
  getStudentsSnapshot() { return this.studentsSubject.value; }
  getFacultySnapshot() { return this.facultySubject.value; }
  getGradesSnapshot() { return this.gradesSubject.value; }
}

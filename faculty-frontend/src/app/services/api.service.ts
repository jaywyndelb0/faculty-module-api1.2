import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Faculty, Student, Section, Subject, Grade, Attendance, ApiResponse 
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://faculty-module-api12-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Auth
  login(credentials: any): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Faculty
  getFaculty(): Observable<Faculty[] | { data: Faculty[] }> {
    return this.http.get<Faculty[] | { data: Faculty[] }>(`${this.apiUrl}/faculty`, { headers: this.getHeaders() });
  }

  createFaculty(faculty: Partial<Faculty>): Observable<Faculty> {
    return this.http.post<Faculty>(`${this.apiUrl}/faculty`, faculty, { headers: this.getHeaders() });
  }

  updateFaculty(id: number, faculty: Partial<Faculty>): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.apiUrl}/faculty/${id}`, faculty, { headers: this.getHeaders() });
  }

  deleteFaculty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/faculty/${id}`, { headers: this.getHeaders() });
  }

  // Students
  getStudents(): Observable<Student[] | { data: Student[] }> {
    return this.http.get<Student[] | { data: Student[] }>(`${this.apiUrl}/students`, { headers: this.getHeaders() });
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student, { headers: this.getHeaders() });
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${id}`, student, { headers: this.getHeaders() });
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`, { headers: this.getHeaders() });
  }

  // Sections
  getSections(): Observable<Section[] | { data: Section[] }> {
    return this.http.get<Section[] | { data: Section[] }>(`${this.apiUrl}/sections`, { headers: this.getHeaders() });
  }

  // Grades
  getGrades(): Observable<Grade[] | { data: Grade[] }> {
    return this.http.get<Grade[] | { data: Grade[] }>(`${this.apiUrl}/grades`, { headers: this.getHeaders() });
  }

  uploadGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade, { headers: this.getHeaders() });
  }

  updateGrade(id: number, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/grades/${id}`, grade, { headers: this.getHeaders() });
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grades/${id}`, { headers: this.getHeaders() });
  }

  getSubjects(): Observable<{ data: Subject[] }> {
    return this.http.get<{ data: Subject[] }>(`${this.apiUrl}/subjects`, { headers: this.getHeaders() });
  }

  // Attendance
  recordAttendance(attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/attendance`, attendance, { headers: this.getHeaders() });
  }

  updateAttendance(id: number, attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/attendance/${id}`, attendance, { headers: this.getHeaders() });
  }

  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attendance/${id}`, { headers: this.getHeaders() });
  }

  getStudentAttendance(studentId: number): Observable<Attendance[] | { data: Attendance[] }> {
    return this.http.get<Attendance[] | { data: Attendance[] }>(`${this.apiUrl}/attendance/${studentId}`, { headers: this.getHeaders() });
  }
}

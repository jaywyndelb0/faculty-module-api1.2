import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Students
  getStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`, { headers: this.getHeaders() });
  }

  createStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, student, { headers: this.getHeaders() });
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}`, student, { headers: this.getHeaders() });
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`, { headers: this.getHeaders() });
  }

  // Sections
  getSections(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sections`, { headers: this.getHeaders() });
  }

  getSectionClasslist(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sections/${id}/classlist`, { headers: this.getHeaders() });
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Faculty
  getFaculty(): Observable<any> {
    return this.http.get(`${this.apiUrl}/faculty`, { headers: this.getHeaders() });
  }

  getFacultyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/faculty/${id}`, { headers: this.getHeaders() });
  }

  createFaculty(faculty: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/faculty`, faculty, { headers: this.getHeaders() });
  }

  updateFaculty(id: number, faculty: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/faculty/${id}`, faculty, { headers: this.getHeaders() });
  }

  deleteFaculty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/faculty/${id}`, { headers: this.getHeaders() });
  }

  // Grades
  getGrades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/grades`, { headers: this.getHeaders() });
  }

  uploadGrade(grade: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/grades`, grade, { headers: this.getHeaders() });
  }

  updateGrade(id: number, grade: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/grades/${id}`, grade, { headers: this.getHeaders() });
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grades/${id}`, { headers: this.getHeaders() });
  }

  getSubjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subjects`, { headers: this.getHeaders() });
  }

  // Attendance
  recordAttendance(attendance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance`, attendance, { headers: this.getHeaders() });
  }

  updateAttendance(id: number, attendance: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/attendance/${id}`, attendance, { headers: this.getHeaders() });
  }

  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attendance/${id}`, { headers: this.getHeaders() });
  }

  getStudentAttendance(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/${studentId}`, { headers: this.getHeaders() });
  }
}

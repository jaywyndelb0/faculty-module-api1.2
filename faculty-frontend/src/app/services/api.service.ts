import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Faculty, Student, Section, Subject, Grade, Attendance 
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(credentials: any): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Faculty
  getFaculty(): Observable<Faculty[] | { data: Faculty[] }> {
    return this.http.get<Faculty[] | { data: Faculty[] }>(`${this.apiUrl}/faculty`);
  }

  createFaculty(faculty: Partial<Faculty>): Observable<Faculty> {
    return this.http.post<Faculty>(`${this.apiUrl}/faculty`, faculty);
  }

  updateFaculty(id: number, faculty: Partial<Faculty>): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.apiUrl}/faculty/${id}`, faculty);
  }

  deleteFaculty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/faculty/${id}`);
  }

  // Students
  getStudents(): Observable<Student[] | { data: Student[] }> {
    return this.http.get<Student[] | { data: Student[] }>(`${this.apiUrl}/students`);
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`);
  }

  // Sections
  getSections(): Observable<Section[] | { data: Section[] }> {
    return this.http.get<Section[] | { data: Section[] }>(`${this.apiUrl}/sections`);
  }

  // Grades
  getGrades(): Observable<Grade[] | { data: Grade[] }> {
    return this.http.get<Grade[] | { data: Grade[] }>(`${this.apiUrl}/grades`);
  }

  uploadGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade);
  }

  updateGrade(id: number, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/grades/${id}`, grade);
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grades/${id}`);
  }

  getSubjects(): Observable<{ data: Subject[] }> {
    return this.http.get<{ data: Subject[] }>(`${this.apiUrl}/subjects`);
  }

  // Attendance
  recordAttendance(attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/attendance`, attendance);
  }

  updateAttendance(id: number, attendance: Partial<Attendance>): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/attendance/${id}`, attendance);
  }

  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/attendance/${id}`);
  }

  getStudentAttendance(studentId: number): Observable<Attendance[] | { data: Attendance[] }> {
    return this.http.get<Attendance[] | { data: Attendance[] }>(`${this.apiUrl}/attendance/${studentId}`);
  }
}

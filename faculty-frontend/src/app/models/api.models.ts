export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface Student {
  id: number;
  name: string;
  section_id: number;
}

export interface Section {
  id: number;
  section_name: string;
  faculty_id: number;
}

export interface Subject {
  id: number;
  subject_name: string;
  code: string;
}

export interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  subject: string;
  grade: string;
  created_at: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  student_name?: string;
  date: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

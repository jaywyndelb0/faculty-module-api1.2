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
  subject_id?: number | null;
  created_at?: string;
}

export interface Student {
  id: number;
  name: string;
  email?: string;
  section_id: number | null;
  section_name?: string;
  source?: string;
  external_id?: string;
}

export interface Section {
  id: number;
  section_name: string;
  name?: string; // For template compatibility
  subject_id: number;
  instructor_id: number;
  capacity: number;
  schedule: string;
  room: string;
  status: string;
  subject?: Subject;
  instructor?: Faculty;
  created_at?: string;
}

export interface Subject {
  id: number;
  subject_name: string;
  name?: string; // For template compatibility
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

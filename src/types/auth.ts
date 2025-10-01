export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNo?: string;
  department?: string;
  school?: string;
  course?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  fatherName: string;
  school: string;
  course: string;
  department: string;
  semester?: number;
  photos?: string[];
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  rollNo: string;
  timestamp: Date;
  subjectCode: string;
  subjectName: string;
  teacherId: string;
}

export interface ClassSession {
  code: string;
  teacherId: string;
  subjectCode: string;
  subjectName: string;
  school: string;
  course: string;
  department: string;
  semester: number;
  createdAt: Date;
  expiresAt: Date;
  attendanceRecords: AttendanceRecord[];
}
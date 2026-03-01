export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type ExamType = "MIDTERM" | "FINAL" | "QUIZ" | "ASSIGNMENT";
export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "CARD"
  | "MOBILE_PAYMENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  phone: string;
  departmentId: string;
  year: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  description: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  courseId: string;
  teacherId: string;
  semester: number;
  year: number;
  room: string;
  schedule: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  sectionId: string;
  enrolledAt: string;
  status: string;
}

export interface Grade {
  id: string;
  enrollmentId: string;
  grade: string;
  gpa: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  sectionId: string;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Fee {
  id: string;
  studentId: string;
  type: string;
  amount: number;
  dueDate: string;
  semester: number;
  year: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  feeId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  sectionId: string;
  type: ExamType;
  date: string;
  duration: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  maxScore: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

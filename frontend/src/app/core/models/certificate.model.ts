import { Course } from './course.model';

export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  course?: Course;
  certificateNumber: string;
  qrCodeData?: string;
  pdfUrl?: string;
  completionScore: number;
  grade?: string;
  valid: boolean;
  issuedAt: string;
}

import { DifficultyLevel } from './common.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl?: string;
  difficulty: DifficultyLevel;
  orderIndex: number;
  premium: boolean;
  published: boolean;
  totalLessons: number;
  estimatedHours: number;
  iconClass?: string;
  colorCode?: string;
  createdAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  orderIndex: number;
  durationMinutes: number;
  premium: boolean;
  published: boolean;
  lessonType: 'TEXT' | 'VIDEO' | 'INTERACTIVE';
  sqlExamples?: string;
  keyPoints?: string;
  xpReward: number;
  courseId: number;
}

export interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  courseId: number;
  completed: boolean;
  completedAt?: string;
  timeSpentSeconds: number;
  xpEarned: number;
  createdAt: string;
}

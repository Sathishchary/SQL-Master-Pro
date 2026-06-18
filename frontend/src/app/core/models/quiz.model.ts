import { DifficultyLevel } from './common.model';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;
  passScore: number;
  published: boolean;
  premium: boolean;
  randomizeQuestions: boolean;
  questions?: Question[];
  courseId?: number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 'MCQ' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'CODING' | 'SHORT_ANSWER';
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  explanation?: string;
  hint?: string;
  points: number;
  difficulty: DifficultyLevel;
  topic?: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  passed: boolean;
  xpEarned: number;
  attemptedAt: string;
}

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  xpEarned: number;
  timeTakenSeconds: number;
}

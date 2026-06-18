// Core domain models for SQL Master Pro

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  roles: string[];
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiry?: string;
  emailVerified: boolean;
  totalXp: number;
  learningStreak: number;
  createdAt: string;
}

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type DifficultyLevel = 'BEGINNER' | 'EASY' | 'INTERMEDIATE' | 'MEDIUM' | 'ADVANCED' | 'EXPERT';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  roles: string[];
  subscriptionPlan: SubscriptionPlan;
  emailVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  statusCode: number;
}

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

export interface Challenge {
  id: number;
  title: string;
  description: string;
  problemStatement: string;
  starterQuery?: string;
  expectedOutput?: string;
  solutionQuery?: string;
  hints?: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  points: number;
  xpReward: number;
  topic?: string;
  databaseName: string;
  premium: boolean;
  totalSubmissions: number;
  successfulSubmissions: number;
}

export interface ChallengeSubmission {
  id: number;
  challengeId: number;
  userId: number;
  submittedQuery: string;
  correct: boolean;
  executionTimeMs: number;
  errorMessage?: string;
  pointsEarned: number;
  xpEarned: number;
  submittedAt: string;
}

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

export interface Payment {
  id: number;
  userId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  subscriptionPlan?: SubscriptionPlan;
  planDuration?: 'MONTHLY' | 'YEARLY';
  subscriptionStart?: string;
  subscriptionEnd?: string;
  invoiceNumber?: string;
  createdAt: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string;
  readingTimeMinutes: number;
  views: number;
  likes: number;
  published: boolean;
  featured: boolean;
  author?: User;
  publishedAt?: string;
  createdAt: string;
}

export interface SqlExecutionResponse {
  executionId?: number;
  success: boolean;
  query: string;
  columns?: string[];
  rows?: Record<string, unknown>[];
  rowCount: number;
  affectedRows?: number;
  executionTimeMs: number;
  error?: string;
  databaseName?: string;
  executedAt: string;
}

export interface SqlExecution {
  id: number;
  query: string;
  databaseName?: string;
  success: boolean;
  rowCount: number;
  executionTimeMs: number;
  errorMessage?: string;
  saved: boolean;
  queryName?: string;
  favorite: boolean;
  executedAt: string;
}

export interface SubscriptionPlan_ {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  popular?: boolean;
  features: string[];
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

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  completedLessons: number;
  totalLessons: number;
  completionPercent: number;
  avgQuizScore: number;
  passedQuizzes: number;
  solvedChallenges: number;
  totalXp: number;
  learningStreak: number;
  subscriptionPlan: string;
}

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type DifficultyLevel = 'BEGINNER' | 'EASY' | 'INTERMEDIATE' | 'MEDIUM' | 'ADVANCED' | 'EXPERT';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  statusCode: number;
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

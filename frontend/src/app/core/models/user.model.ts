import { SubscriptionPlan } from './common.model';

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

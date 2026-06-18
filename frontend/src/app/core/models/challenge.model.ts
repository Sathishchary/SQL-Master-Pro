import { DifficultyLevel } from './common.model';
import { SqlExecutionResponse } from './sql.model';

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

export interface ChallengeSubmissionResult {
  correct: boolean;
  executionResult: SqlExecutionResponse;
  pointsEarned: number;
  xpEarned: number;
}

export interface ChallengeFilter {
  label: string;
  value: string;
  icon: string;
}

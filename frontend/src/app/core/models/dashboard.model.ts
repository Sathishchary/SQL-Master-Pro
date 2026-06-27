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

export interface QuickStat {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  progress?: number;
}

export interface Achievement {
  icon: string;
  name: string;
  earned: boolean;
}

export interface DashboardCourseCard {
  id: number;
  title: string;
  progress: number;
  icon: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalQuestions: number;
  totalChallenges: number;
  totalCertificates: number;
  totalPayments: number;
  totalRevenue: number;
  activeUsers: number;
}

export interface StatCard {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  sublabel?: string;
  progress?: number;
  route?: string;
}

export interface AnalyticsSummaryStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend: number;
}

export interface RevenueSplit {
  label: string;
  pct: number;
  color: string;
}

export interface GrowthDataPoint {
  month: string;
  users: number;
  revenue: number;
  completions: number;
}

export interface TopCourseStat {
  name: string;
  count: number;
  pct: number;
}

export interface ScoreBand {
  range: string;
  pct: number;
  color: string;
}

export interface AdminAnalytics {
  stats: AnalyticsSummaryStat[];
  revenueSplit: RevenueSplit[];
  growthData: GrowthDataPoint[];
  topCourses: TopCourseStat[];
  scoreBands: ScoreBand[];
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats, Course, QuizAttempt } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatTabsModule, MatChipsModule, MatBadgeModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="greeting">
            <h1>Welcome back, {{ user?.firstName }}! 👋</h1>
            <p>{{ motivationText }}</p>
          </div>
          <div class="streak-badge">
            <mat-icon>local_fire_department</mat-icon>
            <span class="streak-count">{{ stats?.learningStreak || 0 }}</span>
            <span class="streak-label">day streak</span>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          @for (stat of quickStats; track stat.label) {
            <div class="stat-card">
              <div class="stat-icon" [style.color]="stat.color">
                <mat-icon>{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
              @if (stat.progress !== undefined) {
                <mat-progress-bar
                  mode="determinate" [value]="stat.progress"
                  [color]="stat.progress > 50 ? 'primary' : 'accent'">
                </mat-progress-bar>
              }
            </div>
          }
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="left-col">
          <!-- Continue Learning -->
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>📚 Continue Learning</mat-card-title>
              <a routerLink="/learn" mat-button color="primary">View All</a>
            </mat-card-header>
            <mat-card-content>
              <div class="course-progress-list">
                @for (course of recentCourses; track course.id) {
                  <div class="course-item" [routerLink]="['/learn', course.id]">
                    <div class="course-icon">{{ course.icon }}</div>
                    <div class="course-info">
                      <div class="course-name">{{ course.title }}</div>
                      <div class="course-progress-text">{{ course.progress }}% complete</div>
                      <mat-progress-bar mode="determinate" [value]="course.progress" color="primary">
                      </mat-progress-bar>
                    </div>
                    <mat-icon class="chevron">chevron_right</mat-icon>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Recent Quiz Attempts -->
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>🏆 Quiz Performance</mat-card-title>
              <a routerLink="/quiz" mat-button color="primary">Take Quiz</a>
            </mat-card-header>
            <mat-card-content>
              @if (!recentAttempts.length) {
                <div class="no-data">
                  <mat-icon>quiz</mat-icon>
                  <p>No quiz attempts yet. <a routerLink="/quiz">Take your first quiz!</a></p>
                </div>
              }
              <div class="attempt-list">
                @for (attempt of recentAttempts.slice(0, 5); track attempt.quizId) {
                  <div class="attempt-item">
                    <div class="attempt-info">
                      <div class="attempt-quiz">Quiz #{{ attempt.quizId }}</div>
                      <div class="attempt-date">{{ attempt.attemptedAt | date:'short' }}</div>
                    </div>
                    <div class="attempt-score" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
                      {{ attempt.score }}%
                      <mat-icon>{{ attempt.passed ? 'check_circle' : 'cancel' }}</mat-icon>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right Column -->
        <div class="right-col">
          <!-- XP & Subscription -->
          <mat-card class="xp-card">
            <mat-card-content>
              <div class="xp-header">
                <div class="xp-icon">⚡</div>
                <div>
                  <div class="xp-total">{{ stats?.totalXp || 0 }} XP</div>
                  <div class="xp-label">Total Experience Points</div>
                </div>
              </div>
              <div class="plan-badge" [class]="stats?.subscriptionPlan?.toLowerCase()">
                {{ stats?.subscriptionPlan || 'FREE' }} Plan
              </div>
              @if (stats?.subscriptionPlan === 'FREE') {
                <a routerLink="/pricing" mat-raised-button color="primary" class="upgrade-btn">
                  <mat-icon>upgrade</mat-icon> Upgrade to Pro
                </a>
              }
            </mat-card-content>
          </mat-card>

          <!-- Quick Actions -->
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>⚡ Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="quick-actions">
                <a routerLink="/playground" mat-raised-button class="action-btn playground">
                  <mat-icon>code</mat-icon> SQL Playground
                </a>
                <a routerLink="/quiz" mat-raised-button class="action-btn quiz">
                  <mat-icon>quiz</mat-icon> Take a Quiz
                </a>
                <a routerLink="/challenges" mat-raised-button class="action-btn challenge">
                  <mat-icon>psychology</mat-icon> Challenges
                </a>
                <a routerLink="/interview-prep" mat-raised-button class="action-btn interview">
                  <mat-icon>work</mat-icon> Interview Prep
                </a>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Achievements -->
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>🎖️ Achievements</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="achievements-grid">
                @for (ach of achievements; track ach.name) {
                  <div class="achievement" [class.earned]="ach.earned">
                    <div class="ach-icon">{{ ach.icon }}</div>
                    <div class="ach-name">{{ ach.name }}</div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .dashboard-header { margin-bottom: 24px; }
    .header-content { display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px;
      h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
      p { color: var(--text-secondary); margin: 0; }
    }
    .streak-badge { display: flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #f6ad55, #ed8936);
      color: white; padding: 12px 20px; border-radius: 16px;
      mat-icon { font-size: 28px; width: 28px; height: 28px; }
      .streak-count { font-size: 28px; font-weight: 900; }
      .streak-label { font-size: 13px; opacity: 0.9; }
    }
    .quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
      @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
    }
    .stat-card { background: var(--surface); border-radius: 16px; padding: 20px;
      box-shadow: var(--shadow-sm); border: 1px solid var(--border);
      .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
      .stat-value { font-size: 28px; font-weight: 800; margin: 4px 0; }
      .stat-label { font-size: 13px; color: var(--text-secondary); }
    }
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px;
      @media (max-width: 968px) { grid-template-columns: 1fr; }
    }
    .section-card {
      border-radius: 16px !important; margin-bottom: 20px;
      mat-card-header { padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; }
      mat-card-title { font-size: 16px !important; font-weight: 700 !important; }
    }
    .course-progress-list .course-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 0;
      border-bottom: 1px solid var(--border); cursor: pointer; border-radius: 8px;
      transition: background 0.2s; padding: 12px 8px;
      &:hover { background: var(--bg-secondary); }
      .course-icon { font-size: 28px; }
      .course-info { flex: 1; .course-name { font-weight: 600; font-size: 14px; }
        .course-progress-text { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
      }
      .chevron { color: var(--text-muted); }
    }
    .no-data { text-align: center; padding: 24px; color: var(--text-secondary);
      mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
      a { color: #667eea; text-decoration: none; }
    }
    .attempt-list .attempt-item { display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid var(--border);
      .attempt-quiz { font-weight: 600; font-size: 14px; }
      .attempt-date { font-size: 12px; color: var(--text-secondary); }
      .attempt-score { display: flex; align-items: center; gap: 4px; font-weight: 700;
        &.passed { color: #48bb78; }
        &.failed { color: #f56565; }
      }
    }
    .xp-card { border-radius: 16px !important; margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2) !important; color: white !important;
    }
    .xp-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px;
      .xp-icon { font-size: 40px; }
      .xp-total { font-size: 32px; font-weight: 900; }
      .xp-label { font-size: 13px; opacity: 0.8; }
    }
    .plan-badge { display: inline-block; padding: 4px 16px; border-radius: 20px;
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
      background: rgba(255,255,255,0.2); margin-bottom: 16px;
      &.pro { background: rgba(251,191,36,0.3); }
    }
    .upgrade-btn { width: 100%; border-radius: 10px !important;
      background: white !important; color: #667eea !important;
    }
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-btn { border-radius: 12px !important; height: 56px !important; font-size: 14px !important;
      display: flex !important; align-items: center !important; gap: 8px !important;
      &.playground { background: linear-gradient(135deg, #667eea20, #667eea10) !important; color: #667eea !important; }
      &.quiz { background: linear-gradient(135deg, #48bb7820, #48bb7810) !important; color: #48bb78 !important; }
      &.challenge { background: linear-gradient(135deg, #f6ad5520, #f6ad5510) !important; color: #ed8936 !important; }
      &.interview { background: linear-gradient(135deg, #9f7aea20, #9f7aea10) !important; color: #9f7aea !important; }
    }
    .achievements-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .achievement { text-align: center; padding: 12px; border-radius: 12px;
      background: var(--bg-secondary); border: 2px solid var(--border); opacity: 0.4;
      &.earned { opacity: 1; border-color: #667eea; background: var(--bg-secondary); }
      .ach-icon { font-size: 28px; margin-bottom: 4px; }
      .ach-name { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user = this.authService.currentUser();
  stats: DashboardStats | null = null;
  recentAttempts: QuizAttempt[] = [];
  quickStats: any[] = [];
  motivationText = 'Keep up the great work! Consistency is the key to mastery.';

  recentCourses: { id: number; title: string; progress: number; icon: string }[] = [];

  achievements = [
    { icon: '🌱', name: 'First Lesson', earned: true },
    { icon: '🔥', name: '7-Day Streak', earned: true },
    { icon: '⚡', name: 'Speed Coder', earned: false },
    { icon: '🏆', name: 'Quiz Master', earned: false },
    { icon: '💡', name: '10 Solved', earned: true },
    { icon: '🎓', name: 'Certified', earned: false },
    { icon: '🚀', name: 'Advanced SQL', earned: false },
    { icon: '👑', name: 'Top Learner', earned: false }
  ];

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.apiService.getMyProgress().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
          this.buildQuickStats();
        }
      }
    });

    this.apiService.getMyQuizAttempts().subscribe({
      next: (res) => {
        if (res.success) this.recentAttempts = res.data;
      }
    });

    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.success) {
          this.recentCourses = res.data.slice(0, 3).map(c => ({
            id: c.id, title: c.title, progress: 0, icon: '📘'
          }));
        }
      }
    });
  }

  private buildQuickStats(): void {
    this.quickStats = [
      { icon: 'school', color: '#667eea', value: this.stats!.completedLessons,
        label: 'Lessons Done', progress: this.stats!.completionPercent },
      { icon: 'quiz', color: '#48bb78', value: `${Math.round(this.stats!.avgQuizScore)}%`,
        label: 'Quiz Average', progress: this.stats!.avgQuizScore },
      { icon: 'psychology', color: '#ed8936', value: this.stats!.solvedChallenges,
        label: 'Challenges Solved' },
      { icon: 'workspace_premium', color: '#9f7aea', value: this.stats!.passedQuizzes,
        label: 'Quizzes Passed' }
    ];
  }
}

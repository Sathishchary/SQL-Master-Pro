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
import { QuickStat, DashboardCourseCard, Achievement } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatTabsModule, MatChipsModule, MatBadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user = this.authService.currentUser();
  stats: DashboardStats | null = null;
  recentAttempts: QuizAttempt[] = [];
  quickStats: QuickStat[] = [];
  motivationText = 'Keep up the great work! Consistency is the key to mastery.';

  recentCourses: DashboardCourseCard[] = [];

  achievements: Achievement[] = [
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

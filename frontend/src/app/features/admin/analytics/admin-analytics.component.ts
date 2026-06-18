import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="admin-analytics">
      <div class="page-header">
        <h1>Analytics & Reports</h1>
        <p>Platform performance metrics and insights</p>
      </div>

      <div class="stats-grid">
        @for (stat of stats; track stat.label) {
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-icon" [class]="stat.color"><mat-icon>{{ stat.icon }}</mat-icon></div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-trend" [class.up]="stat.trend > 0">
                <mat-icon>{{ stat.trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% this month
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Revenue by Plan</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (analytics) {
              <div class="revenue-bars">
                @for (item of revenueSplit; track item.label) {
                  <div class="revenue-bar-item">
                    <div class="bar-label">{{ item.label }}</div>
                    <div class="bar-wrap">
                      <div class="bar" [style.width.%]="item.pct" [class]="item.color"></div>
                    </div>
                    <div class="bar-value">{{ item.pct }}%</div>
                  </div>
                }
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>User Growth (Last 6 Months)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="growth-table">
              <div class="growth-row header">
                <span>Month</span><span>New Users</span><span>Revenue</span><span>Completions</span>
              </div>
              @for (row of growthData; track row.month) {
                <div class="growth-row">
                  <span>{{ row.month }}</span>
                  <span class="highlight">{{ row.users }}</span>
                  <span>₹{{ row.revenue | number }}</span>
                  <span>{{ row.completions }}</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Top Courses by Enrollment</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="top-courses">
              @for (c of topCourses; track c.name; let i = $index) {
                <div class="top-course-item">
                  <span class="rank">{{ i + 1 }}</span>
                  <div class="course-info">
                    <div class="course-name">{{ c.name }}</div>
                    <div class="progress-bar-wrap">
                      <div class="progress-bar" [style.width.%]="c.pct"></div>
                    </div>
                  </div>
                  <span class="enrollment-count">{{ c.count }}</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Quiz Performance Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="score-distribution">
              @for (band of scoreBands; track band.range) {
                <div class="score-band">
                  <div class="band-label">{{ band.range }}</div>
                  <div class="band-bar-wrap">
                    <div class="band-bar" [style.width.%]="band.pct" [class]="band.color"></div>
                  </div>
                  <div class="band-count">{{ band.pct }}%</div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-analytics { padding: 24px; }
    .page-header { margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 800; margin: 0; color: var(--text-primary); }
      p { color: var(--text-secondary); margin: 4px 0 0; }
    }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { border-radius: 16px !important; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center;
      justify-content: center; margin-bottom: 16px;
      mat-icon { color: white; }
      &.blue { background: #667eea; }
      &.green { background: #48bb78; }
      &.purple { background: #9f7aea; }
      &.orange { background: #ed8936; }
      &.red { background: #f56565; }
    }
    .stat-value { font-size: 32px; font-weight: 900; }
    .stat-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
    .stat-trend { font-size: 12px; display: flex; align-items: center; gap: 4px; color: #dc2626;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &.up { color: #16a34a; }
    }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
      @media (max-width: 968px) { grid-template-columns: 1fr; }
    }
    .chart-card { border-radius: 16px !important; }
    .revenue-bars { padding: 8px 0; }
    .revenue-bar-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
      .bar-label { width: 80px; font-size: 13px; color: var(--text-primary); }
      .bar-wrap { flex: 1; background: var(--border); border-radius: 4px; height: 12px; }
      .bar { height: 12px; border-radius: 4px; transition: width 0.5s;
        &.pro { background: #667eea; }
        &.enterprise { background: #ed8936; }
        &.basic { background: #48bb78; }
      }
      .bar-value { width: 40px; font-size: 13px; font-weight: 700; color: var(--text-primary); }
    }
    .growth-table { .growth-row { display: grid; grid-template-columns: repeat(4, 1fr);
        padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border); color: var(--text-primary);
        &.header { font-weight: 700; font-size: 12px; color: var(--text-secondary); }
        .highlight { font-weight: 700; color: #667eea; }
      }
    }
    .top-courses { padding: 8px 0;
      .top-course-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .rank { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-secondary);
        display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; color: var(--text-primary);
      }
      .course-info { flex: 1;
        .course-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary); }
        .progress-bar-wrap { background: var(--border); border-radius: 4px; height: 6px;
          .progress-bar { height: 6px; border-radius: 4px; background: linear-gradient(90deg, #667eea, #764ba2); }
        }
      }
      .enrollment-count { font-weight: 700; font-size: 14px; color: var(--text-primary); }
    }
    .score-distribution { .score-band { display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
        .band-label { width: 60px; font-size: 12px; color: var(--text-primary); }
        .band-bar-wrap { flex: 1; background: var(--border); border-radius: 4px; height: 10px; }
        .band-bar { height: 10px; border-radius: 4px;
          &.excellent { background: #48bb78; }
          &.good { background: #667eea; }
          &.average { background: #ed8936; }
          &.poor { background: #f56565; }
        }
        .band-count { width: 40px; font-size: 12px; font-weight: 700; color: var(--text-primary); }
      }
    }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  analytics: any = null;
  stats = [
    { label: 'Total Revenue', value: '₹2.4L', icon: 'payments', color: 'blue', trend: 12 },
    { label: 'Active Users', value: '1,247', icon: 'people', color: 'green', trend: 8 },
    { label: 'Certifications', value: '382', icon: 'workspace_premium', color: 'purple', trend: 24 },
    { label: 'Avg Quiz Score', value: '76%', icon: 'quiz', color: 'orange', trend: 3 },
    { label: 'Challenges Solved', value: '8.4K', icon: 'code', color: 'red', trend: 18 }
  ];
  revenueSplit = [
    { label: 'Pro', pct: 55, color: 'pro' },
    { label: 'Enterprise', pct: 30, color: 'enterprise' },
    { label: 'Basic', pct: 15, color: 'basic' }
  ];
  growthData = [
    { month: 'Jan', users: 89, revenue: 45000, completions: 234 },
    { month: 'Feb', users: 112, revenue: 62000, completions: 312 },
    { month: 'Mar', users: 145, revenue: 78000, completions: 421 },
    { month: 'Apr', users: 178, revenue: 95000, completions: 534 },
    { month: 'May', users: 203, revenue: 112000, completions: 647 },
    { month: 'Jun', users: 247, revenue: 134000, completions: 789 }
  ];
  topCourses = [
    { name: 'SQL Fundamentals', count: 456, pct: 100 },
    { name: 'Advanced SQL & CTEs', count: 312, pct: 68 },
    { name: 'Database Design', count: 287, pct: 63 },
    { name: 'SQL Joins Mastery', count: 234, pct: 51 },
    { name: 'Window Functions', count: 198, pct: 43 }
  ];
  scoreBands = [
    { range: '90-100%', pct: 18, color: 'excellent' },
    { range: '70-89%', pct: 42, color: 'good' },
    { range: '50-69%', pct: 28, color: 'average' },
    { range: '<50%', pct: 12, color: 'poor' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAdminAnalytics().subscribe({
      next: (res) => { if (res.success) this.analytics = res.data; }
    });
  }
}

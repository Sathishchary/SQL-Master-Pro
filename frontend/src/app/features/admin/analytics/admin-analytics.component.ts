import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { AdminAnalytics, AnalyticsSummaryStat, RevenueSplit, GrowthDataPoint, TopCourseStat, ScoreBand } from '../../../core/models/models';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit {
  analytics: AdminAnalytics | null = null;
  stats: AnalyticsSummaryStat[] = [
    { label: 'Total Revenue', value: '₹2.4L', icon: 'payments', color: 'blue', trend: 12 },
    { label: 'Active Users', value: '1,247', icon: 'people', color: 'green', trend: 8 },
    { label: 'Certifications', value: '382', icon: 'workspace_premium', color: 'purple', trend: 24 },
    { label: 'Avg Quiz Score', value: '76%', icon: 'quiz', color: 'orange', trend: 3 },
    { label: 'Challenges Solved', value: '8.4K', icon: 'code', color: 'red', trend: 18 }
  ];
  revenueSplit: RevenueSplit[] = [
    { label: 'Pro', pct: 55, color: 'pro' },
    { label: 'Enterprise', pct: 30, color: 'enterprise' },
    { label: 'Basic', pct: 15, color: 'basic' }
  ];
  growthData: GrowthDataPoint[] = [
    { month: 'Jan', users: 89, revenue: 45000, completions: 234 },
    { month: 'Feb', users: 112, revenue: 62000, completions: 312 },
    { month: 'Mar', users: 145, revenue: 78000, completions: 421 },
    { month: 'Apr', users: 178, revenue: 95000, completions: 534 },
    { month: 'May', users: 203, revenue: 112000, completions: 647 },
    { month: 'Jun', users: 247, revenue: 134000, completions: 789 }
  ];
  topCourses: TopCourseStat[] = [
    { name: 'SQL Fundamentals', count: 456, pct: 100 },
    { name: 'Advanced SQL & CTEs', count: 312, pct: 68 },
    { name: 'Database Design', count: 287, pct: 63 },
    { name: 'SQL Joins Mastery', count: 234, pct: 51 },
    { name: 'Window Functions', count: 198, pct: 43 }
  ];
  scoreBands: ScoreBand[] = [
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ApiService } from '../../../core/services/api.service';
import { AdminDashboardStats, StatCard, User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatBadgeModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats | null = null;
  recentUsers: User[] = [];
  revenueStats: StatCard[] = [];
  statsCards: StatCard[] = [];

  trafficChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { data: [40, 55, 48, 62, 70, 88, 95], label: 'Active Users', fill: true,
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', tension: 0.4, pointRadius: 0 },
      { data: [22, 28, 25, 34, 38, 50, 58], label: 'Completions', fill: true,
        borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.12)', tension: 0.4, pointRadius: 0 }
    ]
  };
  trafficChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true } } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
  };

  engagementChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Courses', 'Quizzes', 'Challenges', 'Certificates', 'Payments', 'Active Users'],
    datasets: [
      { data: [0, 0, 0, 0, 0, 0], label: 'This Month', fill: true,
        borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.18)', pointBackgroundColor: '#ef4444' }
    ]
  };
  engagementChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { r: { beginAtZero: true, ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.08)' } } }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAdminStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
          this.buildStatsCards();
          this.buildRevenueStats();
          this.buildEngagementChart();
        }
      }
    });
    this.apiService.getAdminUsers().subscribe({
      next: (res) => {
        if (res.success) this.recentUsers = res.data.content.slice(0, 5);
      }
    });
  }

  private buildStatsCards(): void {
    const s = this.stats!;
    this.statsCards = [
      { icon: 'people', label: 'Total Users', value: s.totalUsers, color: 'blue',
        sublabel: 'Active rate', progress: s.totalUsers ? Math.round((s.activeUsers / s.totalUsers) * 100) : 0,
        route: '/admin/users' },
      { icon: 'library_books', label: 'Courses', value: s.totalCourses, color: 'purple',
        sublabel: 'Catalog size', progress: Math.min(100, Math.round((s.totalCourses / 30) * 100)),
        route: '/admin/courses' },
      { icon: 'quiz', label: 'Questions', value: s.totalQuestions, color: 'green',
        sublabel: 'Question bank', progress: Math.min(100, Math.round((s.totalQuestions / 800) * 100)),
        route: '/admin/courses' },
      { icon: 'workspace_premium', label: 'Certificates', value: s.totalCertificates, color: 'teal',
        sublabel: 'Issued so far', progress: Math.min(100, Math.round((s.totalCertificates / 400) * 100)),
        route: '/admin/analytics' }
    ];
  }

  private buildRevenueStats(): void {
    this.revenueStats = [
      { icon: '💳', value: this.stats!.totalPayments, label: 'Successful Payments' },
      { icon: '👥', value: this.stats!.activeUsers, label: 'Active Students' }
    ];
  }

  private buildEngagementChart(): void {
    const s = this.stats!;
    this.engagementChartData = {
      ...this.engagementChartData,
      datasets: [{
        ...this.engagementChartData.datasets[0],
        data: [
          Math.min(100, Math.round((s.totalCourses / 30) * 100)),
          Math.min(100, Math.round((s.totalQuestions / 800) * 100)),
          Math.min(100, Math.round((s.totalChallenges / 200) * 100)),
          Math.min(100, Math.round((s.totalCertificates / 400) * 100)),
          Math.min(100, Math.round((s.totalPayments / 300) * 100)),
          s.totalUsers ? Math.round((s.activeUsers / s.totalUsers) * 100) : 0
        ]
      }]
    };
  }
}

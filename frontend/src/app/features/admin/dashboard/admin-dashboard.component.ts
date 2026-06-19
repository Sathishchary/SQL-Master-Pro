import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiService } from '../../../core/services/api.service';
import { AdminDashboardStats, StatCard, User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatTabsModule, MatBadgeModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats | null = null;
  recentUsers: User[] = [];
  revenueStats: StatCard[] = [];
  statsCards: StatCard[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAdminStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
          this.buildStatsCards();
          this.buildRevenueStats();
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
    this.statsCards = [
      { icon: 'people', label: 'Total Users', value: this.stats!.totalUsers, color: '#667eea' },
      { icon: 'library_books', label: 'Courses', value: this.stats!.totalCourses, color: '#48bb78' },
      { icon: 'quiz', label: 'Questions', value: this.stats!.totalQuestions, color: '#ed8936' },
      { icon: 'psychology', label: 'Challenges', value: this.stats!.totalChallenges, color: '#9f7aea' },
      { icon: 'workspace_premium', label: 'Certificates', value: this.stats!.totalCertificates, color: '#f6ad55' }
    ];
  }

  private buildRevenueStats(): void {
    this.revenueStats = [
      { icon: '💳', value: this.stats!.totalPayments, label: 'Successful Payments' },
      { icon: '👥', value: this.stats!.activeUsers, label: 'Active Students' }
    ];
  }
}

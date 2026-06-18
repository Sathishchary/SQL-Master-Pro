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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatTabsModule, MatBadgeModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="sidebar-brand">⚡ SQL Master Pro</div>
        <div class="sidebar-label">ADMIN PANEL</div>
        <ul class="sidebar-nav">
          @for (nav of navItems; track nav.path) {
            <li>
              <a [routerLink]="nav.path" routerLinkActive="active" class="nav-item">
                <mat-icon>{{ nav.icon }}</mat-icon>
                {{ nav.label }}
                @if (nav.badge) {
                  <span class="nav-badge">{{ nav.badge }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Main Content -->
      <div class="admin-content">
        <div class="admin-header">
          <h1>Admin Dashboard</h1>
          <div class="header-actions">
            <a routerLink="/" mat-button>
              <mat-icon>open_in_new</mat-icon> View Site
            </a>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          @for (stat of statsCards; track stat.label) {
            <div class="stat-card" [style.border-left-color]="stat.color">
              <div class="stat-icon" [style.color]="stat.color">
                <mat-icon>{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          }
        </div>

        <!-- Recent Activity + Top Stats -->
        <div class="admin-grid">
          <!-- Recent Users -->
          <mat-card class="admin-card">
            <mat-card-header>
              <mat-card-title>Recent Users</mat-card-title>
              <a routerLink="/admin/users" mat-button color="primary">View All</a>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recentUsers" class="admin-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let u">{{ u.firstName }} {{ u.lastName }}</td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let u">{{ u.email }}</td>
                </ng-container>
                <ng-container matColumnDef="plan">
                  <th mat-header-cell *matHeaderCellDef>Plan</th>
                  <td mat-cell *matCellDef="let u">
                    <span class="plan-badge" [class]="u.subscriptionPlan?.toLowerCase()">
                      {{ u.subscriptionPlan }}
                    </span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="joined">
                  <th mat-header-cell *matHeaderCellDef>Joined</th>
                  <td mat-cell *matCellDef="let u">{{ u.createdAt | date:'short' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['name', 'email', 'plan', 'joined']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'email', 'plan', 'joined']"></tr>
              </table>
            </mat-card-content>
          </mat-card>

          <!-- Revenue -->
          <mat-card class="admin-card revenue-card">
            <mat-card-header>
              <mat-card-title>Revenue Overview</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="revenue-total">
                <div class="rev-label">Total Revenue</div>
                <div class="rev-amount">₹{{ stats?.totalRevenue | number:'1.0-0' }}</div>
              </div>
              <div class="revenue-stats">
                @for (r of revenueStats; track r.label) {
                  <div class="rev-stat">
                    <div class="rv-icon">{{ r.icon }}</div>
                    <div>
                      <div class="rv-val">{{ r.value }}</div>
                      <div class="rv-label">{{ r.label }}</div>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-grid">
          <button mat-raised-button color="primary" routerLink="/admin/courses">
            <mat-icon>library_books</mat-icon> Manage Courses
          </button>
          <button mat-raised-button color="accent" routerLink="/admin/users">
            <mat-icon>people</mat-icon> Manage Users
          </button>
          <button mat-raised-button routerLink="/admin/analytics">
            <mat-icon>analytics</mat-icon> Analytics
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: calc(100vh - 64px); }
    .admin-sidebar { width: 240px; background: #1a1a2e; color: white; padding: 24px 0;
      flex-shrink: 0;
    }
    .sidebar-brand { font-size: 18px; font-weight: 800; color: #667eea; padding: 0 20px 8px; }
    .sidebar-label { font-size: 10px; color: #4a5568; text-transform: uppercase;
      letter-spacing: 1px; padding: 0 20px 16px; border-bottom: 1px solid #2d3748;
    }
    .sidebar-nav { list-style: none; padding: 16px 0; margin: 0; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px;
      color: #a0aec0; text-decoration: none; transition: all 0.2s; font-size: 14px;
      &:hover, &.active { background: rgba(102,126,234,0.1); color: white; }
      &.active { border-right: 3px solid #667eea; }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    .nav-badge { margin-left: auto; background: #667eea; color: white;
      padding: 2px 8px; border-radius: 20px; font-size: 11px;
    }
    .admin-content { flex: 1; padding: 24px; background: var(--bg); overflow-y: auto; }
    .admin-header { display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 800; margin: 0; color: var(--text-primary); }
    }
    .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;
      @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
    }
    .stat-card { background: var(--surface); border-radius: 12px; padding: 20px;
      border-left: 4px solid #667eea; display: flex; align-items: center; gap: 16px;
      box-shadow: var(--shadow-sm);
      .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
      .stat-value { font-size: 24px; font-weight: 900; color: var(--text-primary); }
      .stat-label { font-size: 12px; color: var(--text-secondary); }
    }
    .admin-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;
      @media (max-width: 1024px) { grid-template-columns: 1fr; }
    }
    .admin-card { border-radius: 16px !important;
      mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    }
    .admin-table { width: 100%; font-size: 13px; }
    .plan-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.free { background: var(--bg-secondary); color: var(--text-secondary); } &.basic { background: rgba(29,78,216,0.12); color: #1d4ed8; }
      &.pro { background: rgba(124,58,237,0.12); color: #7c3aed; } &.enterprise { background: rgba(217,119,6,0.12); color: #d97706; }
    }
    .revenue-card { background: linear-gradient(135deg, #667eea, #764ba2) !important; color: white !important; }
    .rev-label { font-size: 13px; opacity: 0.8; margin-bottom: 4px; }
    .rev-amount { font-size: 40px; font-weight: 900; margin-bottom: 20px; }
    .revenue-stats { display: flex; flex-direction: column; gap: 12px; }
    .rev-stat { display: flex; align-items: center; gap: 12px;
      .rv-icon { font-size: 24px; }
      .rv-val { font-size: 18px; font-weight: 700; }
      .rv-label { font-size: 12px; opacity: 0.8; }
    }
    .quick-actions-grid { display: flex; gap: 12px; flex-wrap: wrap;
      button { border-radius: 10px !important; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  recentUsers: any[] = [];
  revenueStats: any[] = [];
  statsCards: any[] = [];

  navItems: { icon: string; label: string; path: string; badge?: string }[] = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'people', label: 'Users', path: '/admin/users' },
    { icon: 'library_books', label: 'Courses', path: '/admin/courses' },
    { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' },
    { icon: 'payments', label: 'Payments', path: '/admin/payments' }
  ];

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
      { icon: 'people', label: 'Total Users', value: this.stats.totalUsers, color: '#667eea' },
      { icon: 'library_books', label: 'Courses', value: this.stats.totalCourses, color: '#48bb78' },
      { icon: 'quiz', label: 'Questions', value: this.stats.totalQuestions, color: '#ed8936' },
      { icon: 'psychology', label: 'Challenges', value: this.stats.totalChallenges, color: '#9f7aea' },
      { icon: 'workspace_premium', label: 'Certificates', value: this.stats.totalCertificates, color: '#f6ad55' }
    ];
  }

  private buildRevenueStats(): void {
    this.revenueStats = [
      { icon: '💳', value: this.stats.totalPayments, label: 'Successful Payments' },
      { icon: '👥', value: this.stats.activeUsers, label: 'Active Students' }
    ];
  }
}

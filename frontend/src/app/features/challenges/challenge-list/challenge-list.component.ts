import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { Challenge } from '../../../core/models/models';

@Component({
  selector: 'app-challenge-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="challenges-page">
      <!-- Hero Header -->
      <div class="challenges-hero">
        <div class="hero-content">
          <div class="hero-badge">900+ Challenges</div>
          <h1>⚔️ SQL Coding Challenges</h1>
          <p>Sharpen your SQL skills by solving real-world problems. Practice JOINs, CTEs, window functions, and more.</p>
          <div class="hero-stats">
            <div class="h-stat easy"><div class="h-num">100+</div><div class="h-label">Easy</div></div>
            <div class="h-divider"></div>
            <div class="h-stat medium"><div class="h-num">300+</div><div class="h-label">Medium</div></div>
            <div class="h-divider"></div>
            <div class="h-stat hard"><div class="h-num">500+</div><div class="h-label">Advanced</div></div>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="code-block">
<pre><span class="kw">SELECT</span> u.name, <span class="fn">COUNT</span>(s.id) <span class="kw">AS</span> solved
<span class="kw">FROM</span> users u
<span class="kw">JOIN</span> submissions s <span class="kw">ON</span> u.id = s.user_id
<span class="kw">WHERE</span> s.correct = <span class="val">true</span>
<span class="kw">GROUP BY</span> u.name
<span class="kw">ORDER BY</span> solved <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="val">10</span>;</pre>
          </div>
        </div>
      </div>

      <div class="challenges-body">
        <!-- Topic Filter -->
        <div class="filter-section">
          <div class="filter-label">Filter by Topic</div>
          <div class="topic-filters">
            @for (f of filters; track f.value) {
              <button class="topic-btn"
                [class.active]="selectedFilter === f.value"
                (click)="selectedFilter = f.value; filterChallenges()">
                <span class="topic-icon">{{ f.icon }}</span>
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="results-bar">
          <span class="results-count">{{ displayedChallenges.length }} challenges</span>
          <div class="diff-legend">
            <span class="leg easy">Easy</span>
            <span class="leg medium">Medium</span>
            <span class="leg hard">Hard</span>
            <span class="leg expert">Expert</span>
          </div>
        </div>

        <!-- Challenge Grid -->
        <div class="challenges-grid">
          @for (ch of displayedChallenges; track ch.id; let i = $index) {
            <div class="challenge-card">
              <div class="card-accent" [class]="getDiffClass(ch.difficulty)"></div>
              <div class="card-body">
                <div class="card-top">
                  <div class="card-left">
                    <span class="diff-pill" [class]="getDiffClass(ch.difficulty)">
                      {{ getDiffLabel(ch.difficulty) }}
                    </span>
                    @if (ch.premium) {
                      <span class="pro-pill">PRO</span>
                    }
                  </div>
                  <div class="card-pts">
                    <mat-icon>bolt</mat-icon>{{ ch.xpReward }} XP
                  </div>
                </div>

                <h3 class="card-title">{{ ch.title }}</h3>
                <p class="card-desc">{{ ch.description }}</p>

                <div class="card-tags">
                  <span class="tag db-tag"><mat-icon>storage</mat-icon>{{ ch.databaseName }}</span>
                  <span class="tag pts-tag"><mat-icon>star</mat-icon>{{ ch.points }} pts</span>
                  @if (ch.topic) {
                    <span class="tag">{{ ch.topic }}</span>
                  }
                </div>

                <div class="card-footer">
                  @if (ch.totalSubmissions > 0) {
                    <div class="success-bar">
                      <div class="bar-fill" [style.width.%]="getSuccessRate(ch)"
                        [class]="getDiffClass(ch.difficulty)"></div>
                      <span class="bar-label">{{ getSuccessRate(ch) }}% success ({{ ch.totalSubmissions }} tries)</span>
                    </div>
                  }
                  <a [routerLink]="['/challenges', ch.id]" mat-raised-button class="solve-btn">
                    <mat-icon>code</mat-icon> Solve
                  </a>
                </div>
              </div>
            </div>
          }
        </div>

        @if (displayedChallenges.length === 0) {
          <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <h3>No challenges found</h3>
            <p>Try a different filter</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .challenges-page { min-height: 100vh; }

    /* ── Hero ── */
    .challenges-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 56px 40px; display: flex; align-items: center; justify-content: space-between;
      gap: 40px; overflow: hidden; position: relative;
      &::before { content: ''; position: absolute; top: -100px; right: 300px; width: 400px;
        height: 400px; border-radius: 50%; background: rgba(102,126,234,0.08); }
    }
    .hero-content { flex: 1; color: white !important; max-width: 520px; position: relative; z-index: 1; }
    .hero-badge { display: inline-block; background: rgba(102,126,234,0.25);
      border: 1px solid rgba(102,126,234,0.5); color: #a78bfa !important;
      padding: 5px 16px; border-radius: 30px; font-size: 13px; font-weight: 700;
      margin-bottom: 16px; letter-spacing: 0.5px;
    }
    .hero-content h1 { font-size: 38px; font-weight: 900; margin: 0 0 14px; line-height: 1.2; color: white !important; }
    .hero-content p { color: rgba(255,255,255,0.75) !important; font-size: 16px; line-height: 1.7; margin-bottom: 32px; }
    .hero-stats { display: flex; align-items: center; gap: 0; }
    .h-stat { text-align: center; padding: 0 24px;
      .h-num { font-size: 28px; font-weight: 900; }
      .h-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
      &.easy .h-num { color: #4ade80; }
      &.medium .h-num { color: #fbbf24; }
      &.hard .h-num { color: #f87171; }
    }
    .h-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.15); }
    .hero-decoration { flex-shrink: 0; @media (max-width: 1024px) { display: none; } }
    .code-block { background: rgba(0,0,0,0.4); border: 1px solid rgba(102,126,234,0.3);
      border-radius: 16px; padding: 24px 28px;
      pre { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px;
        line-height: 1.8; color: #e2e8f0;
        .kw { color: #60a5fa; font-weight: 700; }
        .fn { color: #fbbf24; }
        .val { color: #4ade80; }
      }
    }

    /* ── Body ── */
    .challenges-body { max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; }

    /* ── Filters ── */
    .filter-section { margin-bottom: 28px; }
    .filter-label { font-size: 12px; font-weight: 700; color: #9ca3af;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
    }
    .topic-filters { display: flex; flex-wrap: wrap; gap: 8px; }
    .topic-btn { display: flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 30px; border: 1.5px solid var(--border);
      background: var(--surface); font-size: 13px; font-weight: 600; color: var(--text-secondary);
      cursor: pointer; transition: all 0.2s;
      .topic-icon { font-size: 16px; }
      &:hover { border-color: #667eea; color: #667eea; }
      &.active { background: #667eea; border-color: #667eea; color: white; }
    }

    /* ── Results bar ── */
    .results-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .results-count { font-size: 14px; color: var(--text-secondary); font-weight: 600; }
    .diff-legend { display: flex; gap: 12px;
      .leg { padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
        &.easy { background: #dcfce7; color: #16a34a; }
        &.medium { background: #fef3c7; color: #d97706; }
        &.hard { background: #fee2e2; color: #dc2626; }
        &.expert { background: #ede9fe; color: #7c3aed; }
      }
    }

    /* ── Cards ── */
    .challenges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
    .challenge-card { display: flex; border-radius: 18px; overflow: hidden;
      background: var(--surface); border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: all 0.25s;
      &:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(102,126,234,0.14);
        border-color: transparent;
      }
    }
    .card-accent { width: 5px; flex-shrink: 0;
      &.easy { background: linear-gradient(180deg, #22c55e, #16a34a); }
      &.medium { background: linear-gradient(180deg, #f59e0b, #d97706); }
      &.hard { background: linear-gradient(180deg, #ef4444, #dc2626); }
      &.expert { background: linear-gradient(180deg, #8b5cf6, #7c3aed); }
    }
    .card-body { flex: 1; padding: 20px 20px 16px; display: flex; flex-direction: column; }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .card-left { display: flex; gap: 6px; align-items: center; }
    .diff-pill { padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.5px;
      &.easy { background: #dcfce7; color: #16a34a; }
      &.medium { background: #fef3c7; color: #d97706; }
      &.hard { background: #fee2e2; color: #dc2626; }
      &.expert { background: #ede9fe; color: #7c3aed; }
    }
    .pro-pill { background: linear-gradient(135deg, #f6ad55, #ed8936); color: white;
      padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
    }
    .card-pts { display: flex; align-items: center; gap: 3px; font-size: 13px;
      font-weight: 700; color: #9f7aea;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }
    .card-title { font-size: 16px; font-weight: 800; margin: 0 0 8px; line-height: 1.35; color: var(--text-primary); }
    .card-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; flex: 1;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
      .tag { display: flex; align-items: center; gap: 4px;
        background: var(--bg-secondary); color: var(--text-secondary); padding: 3px 10px; border-radius: 20px;
        font-size: 11px; font-weight: 600;
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
        &.db-tag { background: #eff6ff; color: #3b82f6; }
        &.pts-tag { background: #fffbeb; color: #d97706; }
      }
    }
    .card-footer { display: flex; flex-direction: column; gap: 10px; }
    .success-bar { display: flex; flex-direction: column; gap: 4px;
      background: var(--bg-secondary); border-radius: 4px; height: 4px; overflow: hidden; position: relative;
      .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s;
        &.easy { background: #22c55e; }
        &.medium { background: #f59e0b; }
        &.hard { background: #ef4444; }
        &.expert { background: #8b5cf6; }
      }
      .bar-label { position: absolute; top: 8px; font-size: 11px; color: #9ca3af; white-space: nowrap; }
    }
    .solve-btn { width: 100%; border-radius: 10px !important; margin-top: 16px;
      display: flex; align-items: center; gap: 6px; justify-content: center;
    }
    .empty-state { text-align: center; padding: 80px 24px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; margin-bottom: 16px; }
      h3 { font-size: 20px; margin-bottom: 8px; }
    }

    :host-context(.dark-theme) {
      .diff-pill, .leg {
        &.easy { background: rgba(34,197,94,0.15); color: #4ade80; }
        &.medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
        &.hard { background: rgba(239,68,68,0.15); color: #f87171; }
        &.expert { background: rgba(139,92,246,0.15); color: #a78bfa; }
      }
    }
  `]
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];
  displayedChallenges: Challenge[] = [];
  selectedFilter = 'all';

  filters = [
    { label: 'All', value: 'all', icon: '🎯' },
    { label: 'Easy', value: 'EASY', icon: '🟢' },
    { label: 'Medium', value: 'MEDIUM', icon: '🟡' },
    { label: 'Advanced', value: 'ADVANCED', icon: '🔴' },
    { label: 'Expert', value: 'EXPERT', icon: '🟣' },
    { label: 'SELECT', value: 'SELECT', icon: '📋' },
    { label: 'JOINs', value: 'JOIN', icon: '🔗' },
    { label: 'Aggregation', value: 'AGGREGATE', icon: '📊' },
    { label: 'Subqueries', value: 'SUBQUERY', icon: '🔄' },
  ];

  sampleChallenges: Challenge[] = [
    { id: 1, title: 'Find All Active Users', description: 'Write a query to retrieve all users who have logged in within the last 30 days.', problemStatement: '', difficulty: 'EASY', points: 10, xpReward: 50, databaseName: 'users_db', premium: false, topic: 'SELECT', totalSubmissions: 1240, successfulSubmissions: 1050 },
    { id: 2, title: 'Top 5 Products by Revenue', description: 'Find the top 5 products generating the highest total revenue using GROUP BY and ORDER BY.', problemStatement: '', difficulty: 'EASY', points: 15, xpReward: 75, databaseName: 'ecommerce', premium: false, topic: 'AGGREGATE', totalSubmissions: 980, successfulSubmissions: 780 },
    { id: 3, title: 'Employee Department JOIN', description: 'List all employees with their department name using an INNER JOIN on the departments table.', problemStatement: '', difficulty: 'EASY', points: 20, xpReward: 100, databaseName: 'hr_db', premium: false, topic: 'JOIN', totalSubmissions: 1500, successfulSubmissions: 1350 },
    { id: 4, title: 'Second Highest Salary', description: 'Find the second highest salary from the employees table without using LIMIT OFFSET.', problemStatement: '', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'hr_db', premium: false, topic: 'SUBQUERY', totalSubmissions: 2200, successfulSubmissions: 1430 },
    { id: 5, title: 'Customers Without Orders', description: 'Find all customers who have never placed an order using a LEFT JOIN or NOT EXISTS subquery.', problemStatement: '', difficulty: 'MEDIUM', points: 35, xpReward: 175, databaseName: 'ecommerce', premium: false, topic: 'JOIN', totalSubmissions: 1800, successfulSubmissions: 990 },
    { id: 6, title: 'Monthly Sales Report', description: 'Generate a monthly sales report showing total orders, revenue, and average order value per month.', problemStatement: '', difficulty: 'MEDIUM', points: 40, xpReward: 200, databaseName: 'ecommerce', premium: false, topic: 'AGGREGATE', totalSubmissions: 1100, successfulSubmissions: 550 },
    { id: 7, title: 'Cumulative Revenue with Window Functions', description: 'Calculate running total of revenue per month using SUM() OVER() window function with ORDER BY.', problemStatement: '', difficulty: 'ADVANCED', points: 60, xpReward: 300, databaseName: 'ecommerce', premium: true, topic: 'WINDOW', totalSubmissions: 650, successfulSubmissions: 210 },
    { id: 8, title: 'Hierarchical Employee Tree', description: 'Use a recursive CTE to build an employee management hierarchy from a self-referencing table.', problemStatement: '', difficulty: 'ADVANCED', points: 80, xpReward: 400, databaseName: 'hr_db', premium: true, topic: 'CTE', totalSubmissions: 420, successfulSubmissions: 98 },
    { id: 9, title: 'Detect Duplicate Records', description: 'Identify and list all duplicate email addresses in the users table, showing count per email.', problemStatement: '', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'users_db', premium: false, topic: 'AGGREGATE', totalSubmissions: 1600, successfulSubmissions: 1200 },
    { id: 10, title: 'Pivot Sales by Quarter', description: 'Pivot sales data to show Q1, Q2, Q3, Q4 revenue per product category in a single result set.', problemStatement: '', difficulty: 'EXPERT', points: 100, xpReward: 500, databaseName: 'ecommerce', premium: true, topic: 'AGGREGATE', totalSubmissions: 280, successfulSubmissions: 42 },
    { id: 11, title: 'Dense Rank on Scores', description: 'Rank students by score using DENSE_RANK() and identify students who tie for the same rank.', problemStatement: '', difficulty: 'ADVANCED', points: 65, xpReward: 325, databaseName: 'school_db', premium: true, topic: 'WINDOW', totalSubmissions: 510, successfulSubmissions: 185 },
    { id: 12, title: 'Rolling 7-Day Average', description: 'Calculate the 7-day rolling average of daily active users using window functions.', problemStatement: '', difficulty: 'EXPERT', points: 90, xpReward: 450, databaseName: 'analytics_db', premium: true, topic: 'WINDOW', totalSubmissions: 190, successfulSubmissions: 28 },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getChallenges().subscribe({
      next: (res) => {
        if (res.success && res.data.content.length > 0) {
          this.challenges = res.data.content;
        } else {
          this.challenges = this.sampleChallenges;
        }
        this.filterChallenges();
      },
      error: () => {
        this.challenges = this.sampleChallenges;
        this.filterChallenges();
      }
    });
  }

  filterChallenges(): void {
    const diffFilters = ['EASY', 'MEDIUM', 'ADVANCED', 'EXPERT'];
    if (this.selectedFilter === 'all') {
      this.displayedChallenges = this.challenges;
    } else if (diffFilters.includes(this.selectedFilter)) {
      this.displayedChallenges = this.challenges.filter(c => c.difficulty === this.selectedFilter);
    } else {
      this.displayedChallenges = this.challenges.filter(c => c.topic === this.selectedFilter);
    }
  }

  getSuccessRate(ch: Challenge): number {
    return ch.totalSubmissions > 0 ? Math.round((ch.successfulSubmissions / ch.totalSubmissions) * 100) : 0;
  }

  getDiffClass(difficulty: string): string {
    const map: Record<string, string> = {
      EASY: 'easy', BEGINNER: 'easy', MEDIUM: 'medium', INTERMEDIATE: 'medium',
      ADVANCED: 'hard', HARD: 'hard', EXPERT: 'expert'
    };
    return map[difficulty] ?? 'easy';
  }

  getDiffLabel(difficulty: string): string {
    const map: Record<string, string> = {
      EASY: 'Easy', BEGINNER: 'Easy', MEDIUM: 'Medium', INTERMEDIATE: 'Medium',
      ADVANCED: 'Hard', HARD: 'Hard', EXPERT: 'Expert'
    };
    return map[difficulty] ?? difficulty;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../core/services/api.service';
import { Quiz } from '../../../core/models/models';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <!-- ── HERO ── -->
    <div class="hero">
      <div class="hero-orb orb1"></div>
      <div class="hero-orb orb2"></div>
      <div class="hero-inner">
        <div class="hero-badge"><mat-icon>workspace_premium</mat-icon> SQL Quiz Bank</div>
        <h1>Test Your SQL Knowledge</h1>
        <p>1,200+ questions across three difficulty levels — from fundamentals to expert-level interview prep.</p>
        <div class="hero-stats">
          <div class="hstat"><span class="hv">300+</span><span class="hl">Beginner Qs</span></div>
          <div class="hdiv"></div>
          <div class="hstat"><span class="hv">500+</span><span class="hl">Intermediate Qs</span></div>
          <div class="hdiv"></div>
          <div class="hstat"><span class="hv">400+</span><span class="hl">Advanced Qs</span></div>
          <div class="hdiv"></div>
          <div class="hstat"><span class="hv">4.9★</span><span class="hl">Rating</span></div>
        </div>
      </div>
    </div>

    <div class="page-container">

      <!-- ── LEVEL CARDS ── -->
      <div class="section-label">Choose Your Level</div>
      <div class="level-cards">

        <div class="level-card beginner" (click)="selectFilter('BEGINNER')">
          <div class="lc-icon">🌱</div>
          <div class="lc-badge">Beginner</div>
          <h3>SQL Foundations</h3>
          <p>SELECT, WHERE, ORDER BY, GROUP BY, basic JOINs and functions</p>
          <ul class="lc-topics">
            <li><mat-icon>check_circle</mat-icon> SELECT & Filtering</li>
            <li><mat-icon>check_circle</mat-icon> Sorting & Limiting</li>
            <li><mat-icon>check_circle</mat-icon> String & Date Functions</li>
          </ul>
          <div class="lc-meta">
            <span><mat-icon>quiz</mat-icon> 3 quizzes</span>
            <span><mat-icon>timer</mat-icon> 12–20 min each</span>
          </div>
          <button class="lc-btn" [routerLink]="['/quiz', 1, 'attempt']">
            Start Basic Quiz <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="level-card intermediate" (click)="selectFilter('INTERMEDIATE')">
          <div class="lc-icon">⚡</div>
          <div class="lc-badge">Intermediate</div>
          <h3>SQL Mastery</h3>
          <p>Joins, aggregates, subqueries, set operations and CASE expressions</p>
          <ul class="lc-topics">
            <li><mat-icon>check_circle</mat-icon> All JOIN Types</li>
            <li><mat-icon>check_circle</mat-icon> Subqueries & EXISTS</li>
            <li><mat-icon>check_circle</mat-icon> UNION, INTERSECT</li>
          </ul>
          <div class="lc-meta">
            <span><mat-icon>quiz</mat-icon> 5 quizzes</span>
            <span><mat-icon>timer</mat-icon> 20–35 min each</span>
          </div>
          <button class="lc-btn" [routerLink]="['/quiz', 4, 'attempt']">
            Start Intermediate Quiz <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="level-card advanced" (click)="selectFilter('ADVANCED')">
          <div class="lc-icon">🚀</div>
          <div class="lc-badge">Advanced</div>
          <h3>SQL Expert</h3>
          <p>Window functions, CTEs, indexing, transactions and database design</p>
          <ul class="lc-topics">
            <li><mat-icon>check_circle</mat-icon> Window Functions</li>
            <li><mat-icon>check_circle</mat-icon> CTEs & Recursive</li>
            <li><mat-icon>check_circle</mat-icon> Performance Tuning</li>
          </ul>
          <div class="lc-meta">
            <span><mat-icon>quiz</mat-icon> 6 quizzes</span>
            <span><mat-icon>timer</mat-icon> 40–90 min each</span>
          </div>
          <button class="lc-btn" [routerLink]="['/quiz', 9, 'attempt']">
            Start Advanced Quiz <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

      </div>

      <!-- ── FILTERS ── -->
      <div class="section-label" style="margin-top:48px">All Quizzes</div>
      <div class="filter-bar">
        @for (f of filters; track f.value) {
          <button class="filter-btn"
            [class.active]="selectedFilter === f.value"
            (click)="selectFilter(f.value)">
            <mat-icon>{{ f.icon }}</mat-icon> {{ f.label }}
            <span class="fc">{{ getCategoryCount(f.value) }}</span>
          </button>
        }
      </div>

      <!-- ── QUIZ GRID ── -->
      <div class="quiz-grid">
        @for (quiz of displayedQuizzes; track quiz.id; let i = $index) {
          <div class="quiz-card" [routerLink]="['/quiz', quiz.id, 'attempt']">
            <div class="qc-top">
              <span class="diff-badge" [class]="quiz.difficulty.toLowerCase()">{{ quiz.difficulty }}</span>
              @if (quiz.premium) {
                <span class="premium-badge"><mat-icon>lock</mat-icon> PRO</span>
              }
            </div>
            <div class="qc-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="qc-title">{{ quiz.title }}</h3>
            <p class="qc-desc">{{ quiz.description }}</p>
            <div class="qc-meta">
              <span><mat-icon>timer</mat-icon> {{ quiz.timeLimitMinutes }} min</span>
              <span><mat-icon>verified</mat-icon> Pass: {{ quiz.passScore }}%</span>
              <span><mat-icon>bolt</mat-icon> XP Rewards</span>
            </div>
            <div class="qc-footer">
              <div class="diff-bar">
                <div class="diff-fill" [class]="quiz.difficulty.toLowerCase()"
                  [style.width.%]="getDiffWidth(quiz.difficulty)"></div>
              </div>
              <span class="qc-start">Take Quiz <mat-icon>arrow_forward</mat-icon></span>
            </div>
          </div>
        }
      </div>

      <!-- ── INTERVIEW SECTION ── -->
      <div class="interview-banner">
        <div class="ib-left">
          <div class="ib-icon">💼</div>
          <div>
            <h2>Interview Preparation</h2>
            <p>200+ company-specific SQL questions used in real FAANG interviews.</p>
            <div class="company-chips">
              @for (c of companies; track c) {
                <span class="chip">{{ c }}</span>
              }
            </div>
          </div>
        </div>
        <a routerLink="/interview-prep" class="ib-btn">
          Start Interview Prep <mat-icon>arrow_forward</mat-icon>
        </a>
      </div>

    </div>
  `,
  styles: [`
    /* ── HERO ── */
    .hero {
      background: linear-gradient(145deg, #0d0221 0%, #1a0533 50%, #0f2744 100%);
      padding: 72px 32px 64px; text-align: center; position: relative; overflow: hidden;
    }
    .hero-orb {
      position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.2; pointer-events: none;
    }
    .orb1 { width: 500px; height: 500px; background: #7c3aed; top: -150px; left: -100px; }
    .orb2 { width: 350px; height: 350px; background: #2563eb; bottom: -80px; right: -50px; }
    .hero-inner { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.4);
      color: #c4b5fd; padding: 6px 18px; border-radius: 50px; font-size: 13px; font-weight: 600;
      margin-bottom: 20px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .hero h1 { font-size: clamp(28px,5vw,48px); font-weight: 900; color: white !important; margin: 0 0 14px; }
    .hero p  { font-size: 16px; color: rgba(255,255,255,0.6) !important; margin: 0 0 32px; line-height: 1.7; }
    .hero-stats {
      display: inline-flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: center;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50px; padding: 14px 28px;
    }
    .hstat { text-align: center;
      .hv { display: block; font-size: 20px; font-weight: 900; color: white !important; }
      .hl { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 1px; }
    }
    .hdiv { width: 1px; height: 28px; background: rgba(255,255,255,0.15); }

    /* ── PAGE ── */
    .page-container { max-width: 1200px; margin: 0 auto; padding: 48px 24px 80px; }
    .section-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #667eea; margin-bottom: 20px; }

    /* ── LEVEL CARDS ── */
    .level-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .level-card {
      border-radius: 24px; padding: 32px; cursor: pointer; position: relative; overflow: hidden;
      border: 1.5px solid transparent; transition: all 0.3s;
      &:hover { transform: translateY(-6px); }
      &::before { content: ''; position: absolute; inset: 0; opacity: 0.06; border-radius: inherit; }
      .lc-icon { font-size: 40px; margin-bottom: 12px; }
      h3 { font-size: 20px; font-weight: 900; margin: 8px 0; }
      p  { font-size: 13px; line-height: 1.6; margin: 0 0 18px; opacity: 0.75; }
    }
    .level-card.beginner {
      background: linear-gradient(145deg, #f0fdf4, #dcfce7); border-color: #86efac;
      h3 { color: #15803d; }
      &:hover { box-shadow: 0 20px 50px rgba(34,197,94,0.2); border-color: #4ade80; }
    }
    .level-card.intermediate {
      background: linear-gradient(145deg, #fffbeb, #fef3c7); border-color: #fcd34d;
      h3 { color: #92400e; }
      &:hover { box-shadow: 0 20px 50px rgba(245,158,11,0.2); border-color: #fbbf24; }
    }
    .level-card.advanced {
      background: linear-gradient(145deg, #f5f3ff, #ede9fe); border-color: #c4b5fd;
      h3 { color: #5b21b6; }
      &:hover { box-shadow: 0 20px 50px rgba(124,58,237,0.2); border-color: #a78bfa; }
    }
    .lc-badge {
      display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
    }
    .beginner .lc-badge  { background: #dcfce7; color: #16a34a; }
    .intermediate .lc-badge { background: #fef3c7; color: #d97706; }
    .advanced .lc-badge  { background: #ede9fe; color: #7c3aed; }
    .lc-topics { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 8px;
      li { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600;
        mat-icon { font-size: 16px; width: 16px; height: 16px; }
      }
    }
    .beginner .lc-topics  mat-icon { color: #16a34a; }
    .intermediate .lc-topics mat-icon { color: #d97706; }
    .advanced .lc-topics  mat-icon { color: #7c3aed; }
    .lc-meta { display: flex; gap: 16px; font-size: 12px; margin-bottom: 20px; opacity: 0.7;
      span { display: flex; align-items: center; gap: 4px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }
    .lc-btn {
      width: 100%; height: 46px; border: none; border-radius: 12px; cursor: pointer;
      font-size: 14px; font-weight: 700; font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; transition: transform 0.2s; }
      &:hover mat-icon { transform: translateX(4px); }
    }
    .beginner .lc-btn  { background: #16a34a; color: white; &:hover { background: #15803d; } }
    .intermediate .lc-btn { background: #d97706; color: white; &:hover { background: #b45309; } }
    .advanced .lc-btn  { background: #7c3aed; color: white; &:hover { background: #6d28d9; } }

    /* ── FILTERS ── */
    .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .filter-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
      border: 1.5px solid var(--border); border-radius: 50px; background: var(--surface);
      font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      .fc { background: var(--bg-secondary); color: var(--text-primary); border-radius: 20px; padding: 1px 7px; font-size: 11px; }
      &:hover { border-color: #667eea; color: #667eea; }
      &.active { background: #667eea; border-color: #667eea; color: white;
        .fc { background: rgba(255,255,255,0.25); color: white; }
      }
    }

    /* ── QUIZ GRID ── */
    .quiz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 60px; }
    .quiz-card {
      background: var(--surface); border-radius: 18px; padding: 24px; cursor: pointer;
      border: 1.5px solid var(--border); transition: all 0.28s;
      box-shadow: var(--shadow-sm);
      &:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(102,126,234,0.13); border-color: #667eea; }
    }
    .qc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .diff-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.beginner,&.easy      { background: #dcfce7; color: #16a34a; }
      &.intermediate,&.medium { background: #fef3c7; color: #d97706; }
      &.advanced             { background: #fce7f3; color: #be185d; }
      &.expert               { background: #ede9fe; color: #7c3aed; }
    }
    .premium-badge { display: flex; align-items: center; gap: 3px; background: #fef3c7; color: #92400e;
      padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700;
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
    }
    .qc-num { font-size: 11px; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 4px; }
    .qc-title { font-size: 16px; font-weight: 800; margin: 0 0 8px; color: var(--text-primary); line-height: 1.35; }
    .qc-desc  { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 16px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .qc-meta { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
      span { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted);
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }
    .qc-footer { display: flex; align-items: center; justify-content: space-between; }
    .diff-bar { flex: 1; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; margin-right: 12px;
      .diff-fill { height: 100%; border-radius: 4px; transition: width 0.4s;
        &.beginner,&.easy      { background: #22c55e; }
        &.intermediate,&.medium { background: #f59e0b; }
        &.advanced             { background: #ec4899; }
        &.expert               { background: #8b5cf6; }
      }
    }
    .qc-start { font-size: 13px; font-weight: 700; color: #667eea; white-space: nowrap;
      display: flex; align-items: center; gap: 2px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    /* ── INTERVIEW BANNER ── */
    .interview-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      border-radius: 24px; padding: 48px 52px; display: flex; align-items: center;
      justify-content: space-between; gap: 32px; position: relative; overflow: hidden;
      box-shadow: 0 20px 60px rgba(102,126,234,0.4);
      @media (max-width: 768px) { flex-direction: column; padding: 36px 28px; }
      &::after { content: ''; position: absolute; bottom: -60px; right: -40px;
        width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.06); }
    }
    .ib-left { display: flex; align-items: flex-start; gap: 20px; position: relative; z-index: 1;
      .ib-icon { font-size: 48px; flex-shrink: 0; }
      h2 { font-size: 28px; font-weight: 900; color: white !important; margin: 0 0 8px; }
      p  { color: rgba(255,255,255,0.8) !important; margin: 0 0 16px; font-size: 15px; }
    }
    .company-chips { display: flex; flex-wrap: wrap; gap: 8px;
      .chip { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
        color: white; padding: 4px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; }
    }
    .ib-btn {
      position: relative; z-index: 1; background: white; color: #667eea;
      border: none; border-radius: 50px; padding: 14px 32px; font-size: 15px; font-weight: 800;
      font-family: inherit; cursor: pointer; white-space: nowrap;
      display: flex; align-items: center; gap: 8px; text-decoration: none;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }
    }

    :host-context(.dark-theme) {
      .level-card.beginner {
        background: linear-gradient(145deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04));
        border-color: rgba(34,197,94,0.3);
        h3 { color: #4ade80; }
      }
      .level-card.intermediate {
        background: linear-gradient(145deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04));
        border-color: rgba(245,158,11,0.3);
        h3 { color: #fbbf24; }
      }
      .level-card.advanced {
        background: linear-gradient(145deg, rgba(124,58,237,0.08), rgba(124,58,237,0.04));
        border-color: rgba(124,58,237,0.3);
        h3 { color: #a78bfa; }
      }
      .beginner .lc-badge  { background: rgba(34,197,94,0.15); color: #4ade80; }
      .intermediate .lc-badge { background: rgba(245,158,11,0.15); color: #fbbf24; }
      .advanced .lc-badge  { background: rgba(124,58,237,0.15); color: #a78bfa; }
      .diff-badge {
        &.beginner,&.easy      { background: rgba(34,197,94,0.15); color: #4ade80; }
        &.intermediate,&.medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
        &.advanced             { background: rgba(236,72,153,0.15); color: #f472b6; }
        &.expert               { background: rgba(124,58,237,0.15); color: #a78bfa; }
      }
    }
  `]
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  displayedQuizzes: Quiz[] = [];
  selectedFilter = 'all';
  readonly String = String;

  filters = [
    { label: 'All',          value: 'all',          icon: 'apps' },
    { label: 'Beginner',     value: 'BEGINNER',     icon: 'eco' },
    { label: 'Intermediate', value: 'INTERMEDIATE', icon: 'bolt' },
    { label: 'Advanced',     value: 'ADVANCED',     icon: 'rocket_launch' },
    { label: 'Expert',       value: 'EXPERT',       icon: 'military_tech' },
  ];

  companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Uber', 'Oracle'];

  sampleQuizzes: Quiz[] = [
    { id: 1,  title: 'SQL Basics: SELECT & WHERE',       description: 'Master SELECT statements, WHERE clauses, LIKE, IN, BETWEEN, and NULL handling', difficulty: 'BEGINNER',     timeLimitMinutes: 15, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 2,  title: 'Sorting & Limiting Results',        description: 'ORDER BY, LIMIT, OFFSET — control exactly what rows you return and in what order', difficulty: 'BEGINNER',     timeLimitMinutes: 12, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 3,  title: 'String & Date Functions',           description: 'CONCAT, SUBSTRING, LENGTH, TRIM, DATE_PART, NOW, EXTRACT and 20+ built-in functions', difficulty: 'BEGINNER',     timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 4,  title: 'SQL Joins Mastery',                 description: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN — all join types with real datasets', difficulty: 'INTERMEDIATE', timeLimitMinutes: 30, passScore: 75, published: true, premium: false, randomizeQuestions: true },
    { id: 5,  title: 'Aggregates & GROUP BY',             description: 'COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING clause deep dive', difficulty: 'INTERMEDIATE', timeLimitMinutes: 25, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 6,  title: 'Subqueries & Correlated Queries',  description: 'Scalar subqueries, IN/EXISTS/ANY/ALL, correlated subqueries in WHERE and SELECT', difficulty: 'INTERMEDIATE', timeLimitMinutes: 35, passScore: 75, published: true, premium: false, randomizeQuestions: true },
    { id: 7,  title: 'UNION, INTERSECT & EXCEPT',        description: 'Set operations — combine, intersect, or subtract result sets with proper column matching', difficulty: 'INTERMEDIATE', timeLimitMinutes: 20, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 8,  title: 'CASE WHEN & Conditional Logic',    description: 'Inline IF/ELSE using CASE expressions, COALESCE, NULLIF and conditional aggregates', difficulty: 'INTERMEDIATE', timeLimitMinutes: 22, passScore: 70, published: true, premium: false, randomizeQuestions: true },
    { id: 9,  title: 'Window Functions Fundamentals',     description: 'OVER(), PARTITION BY, ORDER BY inside windows — ROW_NUMBER, RANK, DENSE_RANK', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 10, title: 'LAG, LEAD & Running Totals',       description: 'Access previous/next rows with LAG/LEAD; compute running sums and moving averages', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 11, title: 'CTEs & Recursive Queries',         description: 'WITH clause, multiple CTEs, recursive CTEs for hierarchies and graph traversal', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 12, title: 'Indexing & Performance Tuning',    description: 'B-tree vs hash indexes, covering indexes, EXPLAIN ANALYZE output interpretation', difficulty: 'ADVANCED',     timeLimitMinutes: 45, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 13, title: 'Transactions & ACID Properties',   description: 'BEGIN/COMMIT/ROLLBACK, isolation levels, deadlocks, and savepoints', difficulty: 'ADVANCED',     timeLimitMinutes: 40, passScore: 78, published: true, premium: true,  randomizeQuestions: true },
    { id: 14, title: 'Database Design & Normalization',  description: '1NF/2NF/3NF/BCNF normal forms, primary keys, foreign keys, ERD reading', difficulty: 'ADVANCED',     timeLimitMinutes: 50, passScore: 80, published: true, premium: true,  randomizeQuestions: true },
    { id: 15, title: 'Expert SQL: Full Interview Drill', description: '60-question timed drill covering all SQL topics — used in FAANG SQL interviews', difficulty: 'EXPERT',       timeLimitMinutes: 90, passScore: 85, published: true, premium: true,  randomizeQuestions: true },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getQuizzes().subscribe({
      next: (res) => {
        this.quizzes = (res.success && res.data?.content?.length > 0) ? res.data.content : this.sampleQuizzes;
        this.filterQuizzes();
      },
      error: () => { this.quizzes = this.sampleQuizzes; this.filterQuizzes(); }
    });
  }

  selectFilter(val: string): void {
    this.selectedFilter = val;
    this.filterQuizzes();
  }

  filterQuizzes(): void {
    this.displayedQuizzes = this.selectedFilter === 'all'
      ? this.quizzes
      : this.quizzes.filter(q => q.difficulty === this.selectedFilter);
  }

  getCategoryCount(val: string): number {
    return val === 'all' ? this.quizzes.length : this.quizzes.filter(q => q.difficulty === val).length;
  }

  getDiffWidth(diff: string): number {
    return { BEGINNER: 25, INTERMEDIATE: 55, ADVANCED: 80, EXPERT: 100 }[diff] ?? 50;
  }
}

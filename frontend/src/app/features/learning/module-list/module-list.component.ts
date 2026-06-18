import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { ApiService } from '../../../core/services/api.service';
import { Course } from '../../../core/models/models';

@Component({
  selector: 'app-module-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatChipsModule, MatTooltipModule, MatRippleModule],
  template: `
    <!-- HERO -->
    <div class="hero">
      <div class="hero-orbs">
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>
        <div class="orb orb3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-eyebrow">
          <mat-icon>auto_stories</mat-icon>
          <span>SQL Learning Hub</span>
        </div>
        <h1 class="hero-title">
          Master SQL.<br>
          <span class="gradient-text">Build Real Skills.</span>
        </h1>
        <p class="hero-sub">
          From beginner SELECT statements to advanced window functions —
          learn by doing with real databases.
        </p>

        <div class="hero-stats">
          <div class="hstat">
            <span class="hstat-val">{{ courses.length || '10' }}+</span>
            <span class="hstat-label">Courses</span>
          </div>
          <div class="hstat-div"></div>
          <div class="hstat">
            <span class="hstat-val">120+</span>
            <span class="hstat-label">Lessons</span>
          </div>
          <div class="hstat-div"></div>
          <div class="hstat">
            <span class="hstat-val">12K+</span>
            <span class="hstat-label">Students</span>
          </div>
          <div class="hstat-div"></div>
          <div class="hstat">
            <span class="hstat-val">4.9★</span>
            <span class="hstat-label">Rating</span>
          </div>
        </div>
      </div>

      <!-- floating code snippet -->
      <div class="hero-code-card">
        <div class="code-header">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          <span class="code-title">query.sql</span>
        </div>
        <pre class="code-body"><span class="kw">SELECT</span> u.name,
       <span class="fn">COUNT</span>(o.id) <span class="kw">AS</span> orders,
       <span class="fn">SUM</span>(o.total) <span class="kw">AS</span> revenue
<span class="kw">FROM</span>   users u
<span class="kw">JOIN</span>   orders o
       <span class="kw">ON</span> u.id = o.user_id
<span class="kw">WHERE</span>  o.created_at >= <span class="str">'2024-01-01'</span>
<span class="kw">GROUP BY</span> u.name
<span class="kw">ORDER BY</span> revenue <span class="kw">DESC</span>
<span class="kw">LIMIT</span>  <span class="num">10</span>;</pre>
        <div class="code-result">
          <mat-icon>check_circle</mat-icon> 10 rows returned in 12ms
        </div>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="filters-bar">
      <div class="filters-inner">
        @for (f of filters; track f.value) {
          <button class="filter-btn"
            [class.active]="activeFilter === f.value"
            (click)="setFilter(f.value)">
            <mat-icon>{{ f.icon }}</mat-icon>
            {{ f.label }}
            @if (getCount(f.value) > 0) {
              <span class="filter-count">{{ getCount(f.value) }}</span>
            }
          </button>
        }
      </div>
    </div>

    <!-- COURSE GRID -->
    <div class="courses-wrap">
      <div class="courses-grid">
        @for (course of filteredCourses; track course.id; let i = $index) {
          <div class="course-card"
            [routerLink]="course.premium ? ['/pricing'] : ['/learn', course.id]"
            matRipple>

            <!-- Card Header Gradient -->
            <div class="card-header" [class]="'diff-' + course.difficulty.toLowerCase()">
              <div class="card-num">{{ padNum(displayIndex(course) + 1) }}</div>
              <div class="card-icon">{{ getModuleIcon(displayIndex(course)) }}</div>
              <div class="card-badges">
                <span class="diff-pill" [class]="course.difficulty.toLowerCase()">
                  {{ course.difficulty }}
                </span>
                @if (course.premium) {
                  <span class="pro-pill">
                    <mat-icon>workspace_premium</mat-icon> PRO
                  </span>
                }
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <h3 class="card-title">{{ course.title }}</h3>
              <p class="card-desc">{{ course.shortDescription || course.description }}</p>

              <div class="card-meta">
                <span class="meta-tag">
                  <mat-icon>menu_book</mat-icon>{{ course.totalLessons }} lessons
                </span>
                <span class="meta-tag">
                  <mat-icon>schedule</mat-icon>~{{ course.estimatedHours }}h
                </span>
                <span class="meta-tag">
                  <mat-icon>bolt</mat-icon>XP Rewards
                </span>
              </div>

              <div class="card-skills">
                @for (skill of getCourseSkills(i); track skill) {
                  <span class="skill-chip">{{ skill }}</span>
                }
              </div>

              @if (getCourseProgress(course.id) > 0) {
                <div class="card-progress">
                  <div class="prog-header">
                    <span>Progress</span>
                    <span class="prog-pct">{{ getCourseProgress(course.id) }}%</span>
                  </div>
                  <mat-progress-bar mode="determinate" [value]="getCourseProgress(course.id)"></mat-progress-bar>
                </div>
              }

              <button class="card-cta" [class.resume]="getCourseProgress(course.id) > 0" [class.pro-cta]="course.premium">
                <mat-icon>{{ course.premium ? 'workspace_premium' : (getCourseProgress(course.id) > 0 ? 'play_arrow' : 'rocket_launch') }}</mat-icon>
                {{ course.premium ? 'Unlock with PRO' : (getCourseProgress(course.id) > 0 ? 'Continue Learning' : 'Start Free') }}
                <mat-icon class="arrow">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        }

        <!-- Empty state -->
        @if (filteredCourses.length === 0) {
          <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <p>No courses found for this level yet</p>
            <button mat-stroked-button (click)="setFilter('all')">Show All Courses</button>
          </div>
        }
      </div>
    </div>

    <!-- LEARNING PATH TIMELINE -->
    <div class="path-section">
      <div class="path-inner">
        <div class="section-eyebrow">Your Journey</div>
        <h2 class="section-title">From Zero to SQL Hero</h2>
        <div class="path-timeline">
          @for (step of journeySteps; track $index; let i = $index, last = $last) {
            <div class="path-node">
              <div class="node-circle" [class]="step.color">
                <mat-icon>{{ step.icon }}</mat-icon>
              </div>
              @if (!last) {
                <div class="node-connector"></div>
              }
              <div class="node-info">
                <div class="node-label">{{ step.level }}</div>
                <div class="node-title">{{ step.title }}</div>
                <div class="node-skills">
                  @for (s of step.skills; track s) {
                    <span>{{ s }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- FEATURES STRIP -->
    <div class="features-strip">
      <div class="features-inner">
        @for (f of features; track f.title) {
          <div class="feature-item">
            <div class="feature-icon" [style.background]="f.bg">
              <mat-icon [style.color]="f.color">{{ f.icon }}</mat-icon>
            </div>
            <div class="feature-text">
              <div class="feature-title">{{ f.title }}</div>
              <div class="feature-desc">{{ f.desc }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ─── HERO ─────────────────────────────────────── */
    .hero {
      position: relative;
      background: linear-gradient(145deg, #0d0221 0%, #1a0533 40%, #0f1e3a 100%);
      min-height: 520px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 80px 60px 60px;
      overflow: hidden;
      gap: 48px;
      @media (max-width: 1024px) { flex-direction: column; padding: 60px 32px; min-height: auto; }
      @media (max-width: 640px) { padding: 48px 20px 40px; gap: 32px; }
    }
    .hero-orbs {
      position: absolute; inset: 0; pointer-events: none;
      .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
      .orb1 { width: 400px; height: 400px; background: #7c3aed; top: -100px; left: -100px; animation: drift 8s ease-in-out infinite; }
      .orb2 { width: 300px; height: 300px; background: #2563eb; bottom: -80px; right: 300px; animation: drift 10s ease-in-out infinite reverse; }
      .orb3 { width: 200px; height: 200px; background: #06b6d4; top: 100px; right: 100px; animation: drift 6s ease-in-out infinite 2s; }
    }
    @keyframes drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px, -20px); } }
    .hero-content { position: relative; z-index: 2; flex: 1; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(124,58,237,0.25); border: 1px solid rgba(124,58,237,0.4);
      color: #c4b5fd; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 600;
      margin-bottom: 24px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .hero-title {
      font-size: clamp(36px, 5vw, 58px); font-weight: 900; line-height: 1.1;
      color: white !important; margin: 0 0 16px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      font-size: 17px; color: rgba(255,255,255,0.65) !important; line-height: 1.7;
      max-width: 520px; margin: 0 0 36px;
    }
    .hero-stats {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      .hstat { text-align: center;
        .hstat-val { display: block; font-size: 22px; font-weight: 900; color: white !important; }
        .hstat-label { display: block; font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
      }
      .hstat-div { width: 1px; height: 36px; background: rgba(255,255,255,0.15); }
    }

    /* ─── CODE CARD ─────────────────────────────────── */
    .hero-code-card {
      position: relative; z-index: 2;
      background: rgba(13,2,33,0.85); border: 1px solid rgba(124,58,237,0.3);
      border-radius: 16px; width: 380px; flex-shrink: 0;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
      backdrop-filter: blur(12px);
      @media (max-width: 1024px) { width: 100%; max-width: 480px; }
      @media (max-width: 640px) { max-width: 100%; min-width: 0; }
    }
    .code-header {
      display: flex; align-items: center; gap: 6px; padding: 12px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      .dot { width: 12px; height: 12px; border-radius: 50%; }
      .red { background: #ff5f57; } .yellow { background: #ffbd2e; } .green { background: #28c840; }
      .code-title { margin-left: 8px; font-size: 12px; color: rgba(255,255,255,0.4); font-family: monospace; }
    }
    .code-body {
      margin: 0; padding: 20px; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.8;
      overflow-x: auto;
      .kw { color: #c792ea; font-weight: 700; }
      .fn { color: #82aaff; }
      .str { color: #c3e88d; }
      .num { color: #f78c6c; }
    }
    .code-result {
      display: flex; align-items: center; gap: 8px; padding: 10px 16px;
      border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #4ade80;
      font-family: monospace;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    /* ─── FILTERS ────────────────────────────────────── */
    .filters-bar {
      position: sticky; top: 64px; z-index: 1000;
      background: var(--surface); border-bottom: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .filters-inner {
      max-width: 1200px; margin: 0 auto; padding: 0 20px;
      display: flex; gap: 4px; overflow-x: auto;
      scrollbar-width: none; &::-webkit-scrollbar { display: none; }
      @media (max-width: 640px) { padding: 0 12px; }
    }
    .filter-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 14px 20px; border: none; background: none; cursor: pointer;
      font-size: 14px; font-weight: 600; color: var(--text-secondary); white-space: nowrap;
      border-bottom: 3px solid transparent; transition: all 0.2s;
      mat-icon { font-size: 17px; width: 17px; height: 17px; }
      .filter-count {
        background: var(--bg-secondary); color: var(--text-primary); border-radius: 10px;
        padding: 1px 7px; font-size: 11px; font-weight: 700;
      }
      &:hover { color: #667eea; }
      &.active {
        color: #667eea; border-bottom-color: #667eea;
        .filter-count { background: rgba(124,58,237,0.15); color: #7c3aed; }
      }
    }

    /* ─── COURSE GRID ────────────────────────────────── */
    .courses-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; isolation: isolate; overflow-x: hidden; }
    .courses-grid {
      display: grid; gap: 24px;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }

    .course-card {
      background: var(--surface); border-radius: 18px; overflow: hidden;
      box-shadow: var(--shadow-sm);
      cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease;
      border: 1px solid var(--border); display: flex; flex-direction: column;
      text-decoration: none; color: inherit;
      position: relative; z-index: 0;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 44px rgba(102,126,234,0.16), 0 4px 12px rgba(0,0,0,0.06);
        border-color: rgba(102,126,234,0.4);
      }
      @media (max-width: 640px) {
        border-radius: 16px;
        &:hover { transform: none; }
      }
    }

    /* ─── Card header gradients by difficulty ─── */
    .card-header {
      position: relative; height: 160px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      overflow: hidden;
      &.diff-beginner    { background: linear-gradient(145deg, #0f9b8e 0%, #38ef7d 100%); }
      &.diff-intermediate { background: linear-gradient(145deg, #1565c0 0%, #42a5f5 100%); }
      &.diff-advanced    { background: linear-gradient(145deg, #5e35b1 0%, #ab47bc 100%); }
      &.diff-expert      { background: linear-gradient(145deg, #c62828 0%, #f06292 100%); }
      &::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at 75% 20%, rgba(255,255,255,0.15) 0%, transparent 60%);
      }
      @media (max-width: 640px) { height: 140px; }
    }
    .card-num {
      position: absolute; top: 14px; left: 18px;
      font-size: 12px; font-weight: 900; color: rgba(255,255,255,0.45);
      letter-spacing: 1px; font-family: monospace;
    }
    .card-icon {
      font-size: 56px; line-height: 1; text-align: center; position: relative; z-index: 1;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.25));
    }
    .card-badges {
      position: absolute; top: 14px; right: 16px;
      display: flex; flex-direction: column; gap: 6px; align-items: flex-end; z-index: 1;
    }
    .diff-pill {
      padding: 3px 10px; border-radius: 20px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
      backdrop-filter: blur(4px);
      &.beginner { background: rgba(255,255,255,0.95); color: #059669; }
      &.intermediate { background: rgba(255,255,255,0.95); color: #0284c7; }
      &.advanced { background: rgba(255,255,255,0.95); color: #7c3aed; }
      &.expert { background: rgba(255,255,255,0.95); color: #be185d; }
    }
    .pro-pill {
      display: flex; align-items: center; gap: 3px;
      padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
      background: linear-gradient(135deg, #f59e0b, #d97706); color: white;
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
    }

    /* ─── Card Body ─── */
    .card-body { padding: 20px 22px 22px; flex: 1; display: flex; flex-direction: column;
      @media (max-width: 640px) { padding: 16px 16px 18px; }
    }
    .card-title { font-size: 17px; font-weight: 800; margin: 0 0 8px; line-height: 1.3; color: var(--text-primary);
      @media (max-width: 640px) { font-size: 16px; }
    }
    .card-desc {
      font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; flex: 1;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      @media (max-width: 640px) { font-size: 12px; margin-bottom: 12px; }
    }
    .card-meta {
      display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;
      .meta-tag {
        display: flex; align-items: center; gap: 4px;
        font-size: 12px; color: var(--text-secondary); background: var(--bg-secondary);
        border: 1px solid var(--border); padding: 4px 10px; border-radius: 20px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; color: var(--text-muted); }
      }
    }
    .card-skills {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
      .skill-chip {
        padding: 3px 10px; background: rgba(109,40,217,0.12); color: #7c3aed;
        font-size: 11px; font-weight: 600; border-radius: 8px;
      }
    }
    .card-progress {
      margin-bottom: 16px;
      .prog-header { display: flex; justify-content: space-between; font-size: 11px;
        color: var(--text-muted); margin-bottom: 6px;
        .prog-pct { color: #667eea; font-weight: 700; }
      }
      mat-progress-bar { border-radius: 4px; }
    }
    .card-cta {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 20px; border: none; border-radius: 12px; cursor: pointer;
      font-size: 14px; font-weight: 700; transition: all 0.2s;
      background: linear-gradient(135deg, #667eea, #764ba2); color: white;
      .arrow { transition: transform 0.2s; }
      &:hover .arrow { transform: translateX(4px); }
      &.resume  { background: linear-gradient(135deg, #10b981, #059669); }
      &.pro-cta { background: linear-gradient(135deg, #f59e0b, #d97706); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      @media (max-width: 640px) { padding: 10px 16px; font-size: 13px; gap: 6px;
        mat-icon { font-size: 16px; width: 16px; height: 16px; }
      }
    }

    /* ─── Empty state ────────────────────────────────── */
    .empty-state {
      grid-column: 1 / -1; text-align: center; padding: 60px 20px;
      color: var(--text-muted);
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.4; }
      p { font-size: 16px; margin-bottom: 20px; }
    }

    /* ─── LEARNING PATH ──────────────────────────────── */
    .path-section {
      background: var(--bg-secondary);
      padding: 80px 24px;
      @media (max-width: 640px) { padding: 48px 16px; }
    }
    .path-inner { max-width: 1200px; margin: 0 auto; }
    .section-eyebrow {
      font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
      color: #7c3aed; margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(24px, 4vw, 40px); font-weight: 900; color: var(--text-primary);
      margin: 0 0 48px;
    }
    .path-timeline {
      display: flex; gap: 0; flex-wrap: wrap;
      @media (max-width: 768px) { flex-direction: column; gap: 24px; }
    }
    .path-node {
      display: flex; flex-direction: column; align-items: center; flex: 1;
      position: relative; min-width: 160px;
    }
    .node-circle {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px; position: relative; z-index: 2;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      mat-icon { font-size: 28px; width: 28px; height: 28px; color: white; }
      &.green { background: linear-gradient(135deg, #11998e, #38ef7d); }
      &.blue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
      &.purple { background: linear-gradient(135deg, #667eea, #764ba2); }
      &.red { background: linear-gradient(135deg, #f093fb, #f5576c); }
    }
    .node-connector {
      position: absolute; top: 32px; left: calc(50% + 32px);
      right: calc(-50% + 32px); height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      opacity: 0.25;
      @media (max-width: 768px) { display: none; }
    }
    .node-info { text-align: center; padding: 0 12px;
      .node-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
      .node-title { font-size: 15px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
      .node-skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px;
        span { font-size: 11px; background: var(--surface); border: 1px solid var(--border);
          color: var(--text-secondary); padding: 2px 8px; border-radius: 6px; font-weight: 500; }
      }
    }

    /* ─── FEATURES STRIP ─────────────────────────────── */
    .features-strip {
      background: #0d0221; padding: 56px 24px;
      @media (max-width: 640px) { padding: 40px 16px; }
    }
    .features-inner {
      max-width: 1200px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;
      @media (max-width: 640px) { grid-template-columns: 1fr; gap: 16px; }
    }
    .feature-item {
      display: flex; align-items: flex-start; gap: 16px;
    }
    .feature-icon {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    .feature-text {
      .feature-title { font-size: 15px; font-weight: 700; color: white; margin-bottom: 4px; }
      .feature-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; }
    }
  `]
})
export class ModuleListComponent implements OnInit {
  courses: Course[] = [];
  courseProgress: Record<number, number> = {};
  activeFilter = 'all';

  filters = [
    { label: 'All Courses', value: 'all', icon: 'grid_view' },
    { label: 'Beginner', value: 'BEGINNER', icon: 'emoji_nature' },
    { label: 'Intermediate', value: 'INTERMEDIATE', icon: 'trending_up' },
    { label: 'Advanced', value: 'ADVANCED', icon: 'local_fire_department' },
    { label: 'Expert', value: 'EXPERT', icon: 'military_tech' },
  ];

  moduleIcons = ['🗄️', '🔍', '🔗', '⚙️', '📦', '🚀', '⚡', '📐', '🔐', '🏗️'];

  courseSkills: string[][] = [
    ['SELECT', 'WHERE', 'ORDER BY'],
    ['JOINs', 'UNION', 'Subqueries'],
    ['GROUP BY', 'HAVING', 'Aggregates'],
    ['CTEs', 'Window Fns', 'RANK'],
    ['Indexes', 'EXPLAIN', 'Tuning'],
    ['Triggers', 'Procedures', 'Functions'],
    ['Transactions', 'ACID', 'Locks'],
    ['Views', 'Materialized', 'ETL'],
    ['Partitions', 'Sharding', 'Scale'],
    ['NoSQL', 'JSON', 'JSONB'],
  ];

  journeySteps = [
    { level: 'Level 1', title: 'SQL Foundations', color: 'green', icon: 'emoji_nature',
      skills: ['SELECT', 'WHERE', 'ORDER BY', 'LIMIT'] },
    { level: 'Level 2', title: 'Data Relationships', color: 'blue', icon: 'hub',
      skills: ['JOINs', 'Foreign Keys', 'UNION'] },
    { level: 'Level 3', title: 'Analytics & Aggregation', color: 'purple', icon: 'insights',
      skills: ['GROUP BY', 'Window Functions', 'CTEs'] },
    { level: 'Level 4', title: 'Expert & Performance', color: 'red', icon: 'military_tech',
      skills: ['Indexing', 'Query Plans', 'Optimization'] },
  ];

  features = [
    { icon: 'terminal', title: 'Real SQL Execution', desc: 'Run queries against live PostgreSQL in the browser', bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    { icon: 'emoji_events', title: 'Gamified XP System', desc: 'Earn points, badges, and climb leaderboards', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    { icon: 'smart_toy', title: 'AI-Powered Hints', desc: 'Get intelligent feedback and query optimizations', bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    { icon: 'workspace_premium', title: 'Certificates', desc: 'Earn verified certificates to share on LinkedIn', bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
  ];

  sampleCourses: Course[] = [
    { id: 1, title: 'SQL Foundations', shortDescription: 'Start from zero — SELECT, WHERE, ORDER BY, LIMIT and your first real queries.',
      description: 'The perfect starting point for anyone new to SQL. You will write your first queries against a real PostgreSQL database within minutes.',
      difficulty: 'BEGINNER', totalLessons: 12, estimatedHours: 4, premium: false, published: true, orderIndex: 1, createdAt: '' },
    { id: 2, title: 'Filtering & Sorting Mastery', shortDescription: 'WHERE clauses, LIKE, IN, BETWEEN, NULL handling, and multi-column ORDER BY.',
      description: 'Deep dive into filtering data with precision. Learn compound conditions, pattern matching, and how to handle NULLs correctly.',
      difficulty: 'BEGINNER', totalLessons: 10, estimatedHours: 3, premium: false, published: true, orderIndex: 2, createdAt: '' },
    { id: 3, title: 'SQL JOINs Explained', shortDescription: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOINs with real datasets.',
      description: 'Master every type of JOIN with visual diagrams and hands-on exercises against a real e-commerce database.',
      difficulty: 'BEGINNER', totalLessons: 14, estimatedHours: 5, premium: false, published: true, orderIndex: 3, createdAt: '' },
    { id: 4, title: 'Aggregates & GROUP BY', shortDescription: 'COUNT, SUM, AVG, MIN, MAX — plus GROUP BY and HAVING for data analysis.',
      description: 'Transform raw rows into meaningful summaries. Build reports, dashboards, and analytics queries from scratch.',
      difficulty: 'INTERMEDIATE', totalLessons: 11, estimatedHours: 4, premium: false, published: true, orderIndex: 4, createdAt: '' },
    { id: 5, title: 'Subqueries & CTEs', shortDescription: 'Correlated subqueries, EXISTS, WITH clauses, and multi-step query logic.',
      description: 'Write complex, layered queries using subqueries and Common Table Expressions. Break big problems into simple steps.',
      difficulty: 'INTERMEDIATE', totalLessons: 13, estimatedHours: 5, premium: false, published: true, orderIndex: 5, createdAt: '' },
    { id: 6, title: 'String, Date & Math Functions', shortDescription: 'CONCAT, SUBSTRING, DATE_TRUNC, EXTRACT, ROUND, CAST and 30+ built-in functions.',
      description: 'Manipulate and transform data directly in SQL. Clean messy strings, compute date ranges, and format numbers.',
      difficulty: 'INTERMEDIATE', totalLessons: 10, estimatedHours: 4, premium: false, published: true, orderIndex: 6, createdAt: '' },
    { id: 7, title: 'Window Functions', shortDescription: 'RANK, ROW_NUMBER, LAG, LEAD, NTILE, running totals and moving averages.',
      description: 'The most powerful feature in modern SQL. Do analytics that used to require Python or Excel — all inside a single query.',
      difficulty: 'ADVANCED', totalLessons: 16, estimatedHours: 7, premium: true, published: true, orderIndex: 7, createdAt: '' },
    { id: 8, title: 'Database Design & Normalization', shortDescription: 'ERD, 1NF–3NF, primary keys, foreign keys, and schema design best practices.',
      description: 'Design databases that scale. Learn normalization theory, avoid common pitfalls, and read real-world schema diagrams.',
      difficulty: 'INTERMEDIATE', totalLessons: 12, estimatedHours: 5, premium: false, published: true, orderIndex: 8, createdAt: '' },
    { id: 9, title: 'Query Performance & Indexing', shortDescription: 'EXPLAIN ANALYZE, B-tree & GIN indexes, covering indexes, and query tuning.',
      description: 'Make slow queries fast. Understand how PostgreSQL plans queries, when to add indexes, and how to read execution plans.',
      difficulty: 'ADVANCED', totalLessons: 14, estimatedHours: 6, premium: true, published: true, orderIndex: 9, createdAt: '' },
    { id: 10, title: 'Transactions & Concurrency', shortDescription: 'ACID, isolation levels, deadlocks, row-level locking, and savepoints.',
      description: 'Write safe concurrent SQL. Understand transactions deeply enough to avoid race conditions and data corruption in production.',
      difficulty: 'ADVANCED', totalLessons: 10, estimatedHours: 5, premium: true, published: true, orderIndex: 10, createdAt: '' },
    { id: 11, title: 'PostgreSQL JSON & JSONB', shortDescription: 'Store, query, and index semi-structured data with JSONB operators and GIN indexes.',
      description: 'Bridge the gap between relational and document databases. Query JSON fields with the same power as regular columns.',
      difficulty: 'ADVANCED', totalLessons: 11, estimatedHours: 5, premium: true, published: true, orderIndex: 11, createdAt: '' },
    { id: 12, title: 'Expert SQL: Recursive Queries', shortDescription: 'Recursive CTEs for hierarchies, graphs, and sequences — the hardest SQL patterns.',
      description: 'Write recursive queries to traverse trees, org charts, and graph data structures. Topics that separate SQL experts from everyone else.',
      difficulty: 'EXPERT', totalLessons: 9, estimatedHours: 6, premium: true, published: true, orderIndex: 12, createdAt: '' },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.success && res.data?.length > 0) {
          this.courses = res.data;
        } else {
          this.courses = this.sampleCourses;
        }
      },
      error: () => { this.courses = this.sampleCourses; }
    });
  }

  get filteredCourses(): Course[] {
    if (this.activeFilter === 'all') return this.courses;
    return this.courses.filter(c => c.difficulty === this.activeFilter);
  }

  setFilter(value: string): void { this.activeFilter = value; }

  getCount(filter: string): number {
    if (filter === 'all') return this.courses.length;
    return this.courses.filter(c => c.difficulty === filter).length;
  }

  displayIndex(course: Course): number {
    return this.courses.indexOf(course);
  }

  getModuleIcon(index: number): string { return this.moduleIcons[index % this.moduleIcons.length]; }
  getCourseSkills(index: number): string[] { return this.courseSkills[index % this.courseSkills.length]; }
  getCourseProgress(courseId: number): number { return this.courseProgress[courseId] || 0; }
  padNum(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
}

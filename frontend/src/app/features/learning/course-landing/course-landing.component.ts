import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../core/services/api.service';
import { Course, Lesson } from '../../../core/models/models';

@Component({
  selector: 'app-course-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatCardModule, MatProgressBarModule, MatTooltipModule],
  template: `
    @if (course) {
      <div class="course-landing">
        <!-- Hero -->
        <div class="course-hero" [style.background]="heroGradient">
          <div class="hero-inner">
            <div class="hero-left">
              <span class="diff-badge" [class]="course.difficulty.toLowerCase()">{{ course.difficulty }}</span>
              <h1>{{ course.title }}</h1>
              <p>{{ course.description }}</p>
              <div class="hero-stats">
                <span><mat-icon>menu_book</mat-icon> {{ course.totalLessons }} lessons</span>
                <span><mat-icon>schedule</mat-icon> ~{{ course.estimatedHours }}h estimated</span>
                @if (course.premium) {
                  <span class="pro-tag"><mat-icon>workspace_premium</mat-icon> PRO</span>
                }
              </div>
            </div>
            @if (lessons.length) {
              <div class="hero-right">
                <a mat-raised-button class="start-btn"
                  [routerLink]="['/learn', courseId, 'lesson', lessons[0].id]">
                  <mat-icon>play_arrow</mat-icon> Start Learning
                </a>
              </div>
            }
          </div>
        </div>

        <!-- Main content: lessons + sidebar -->
        <div class="content-wrap">
          <div class="content-main">
            <div class="section-header">
              <h2>Course Content</h2>
              <span class="lesson-count">{{ lessons.length }} lessons</span>
            </div>

            <div class="lessons-list">
              @for (lesson of lessons; track lesson.id; let i = $index) {
                <mat-card class="lesson-card">
                  <div class="lesson-num">{{ i + 1 }}</div>
                  <div class="lesson-type-icon" [class]="lesson.lessonType.toLowerCase()">
                    <mat-icon>{{ lessonTypeIcon(lesson.lessonType) }}</mat-icon>
                  </div>
                  <div class="lesson-info">
                    <div class="lesson-title">{{ lesson.title }}</div>
                    <div class="lesson-meta">
                      <span class="type-label">{{ lesson.lessonType }}</span>
                      <span><mat-icon>schedule</mat-icon>{{ lesson.durationMinutes }}m</span>
                      <span class="xp"><mat-icon>bolt</mat-icon>+{{ lesson.xpReward }} XP</span>
                    </div>
                  </div>
                  <div class="lesson-actions">
                    <button mat-icon-button matTooltip="Preview lesson" (click)="previewLesson(lesson, $event)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <a mat-flat-button class="enter-btn" [routerLink]="['/learn', courseId, 'lesson', lesson.id]">
                      Enter <mat-icon>arrow_forward</mat-icon>
                    </a>
                  </div>
                </mat-card>
              }
            </div>

            <div class="back-link">
              <a routerLink="/learn" mat-stroked-button>
                <mat-icon>arrow_back</mat-icon> Back to Courses
              </a>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="content-sidebar">
            <mat-card class="sidebar-card">
              <h3>This course includes</h3>
              <ul class="info-list">
                <li><mat-icon>menu_book</mat-icon> {{ course.totalLessons }} lessons</li>
                <li><mat-icon>schedule</mat-icon> ~{{ course.estimatedHours }} hours total</li>
                <li><mat-icon>bolt</mat-icon> XP rewards on every lesson</li>
                <li><mat-icon>workspace_premium</mat-icon> {{ course.premium ? 'PRO course' : 'Free access' }}</li>
              </ul>
            </mat-card>
          </div>
        </div>

        <!-- More Courses -->
        @if (moreCourses.length) {
          <div class="more-courses-section">
            <div class="more-courses-inner">
              <div class="section-header">
                <h2>More Courses You Might Like</h2>
              </div>
              <div class="more-courses-grid">
                @for (c of moreCourses; track c.id) {
                  <mat-card class="more-course-card">
                    <div class="mc-header" [class]="'diff-' + c.difficulty.toLowerCase()">
                      <span class="diff-pill" [class]="c.difficulty.toLowerCase()">{{ c.difficulty }}</span>
                    </div>
                    <div class="mc-body">
                      <h4>{{ c.title }}</h4>
                      <p>{{ c.shortDescription || c.description }}</p>
                      <div class="mc-meta">
                        <span><mat-icon>menu_book</mat-icon>{{ c.totalLessons }} lessons</span>
                        <span><mat-icon>schedule</mat-icon>~{{ c.estimatedHours }}h</span>
                      </div>
                      <div class="mc-actions">
                        <button mat-icon-button matTooltip="View course" (click)="viewCourse(c)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <a mat-flat-button class="enter-course-btn" [routerLink]="['/learn', c.id]">
                          Enter Course <mat-icon>arrow_forward</mat-icon>
                        </a>
                      </div>
                    </div>
                  </mat-card>
                }
              </div>
            </div>
          </div>
        }
      </div>
    } @else if (notFound) {
      <div class="loading-state">
        <mat-icon>error_outline</mat-icon>
        <p>Course not found.</p>
        <a routerLink="/learn" mat-stroked-button>
          <mat-icon>arrow_back</mat-icon> Back to Courses
        </a>
      </div>
    } @else {
      <div class="loading-state">
        <mat-icon class="spin-icon">refresh</mat-icon>
        <p>Loading course...</p>
      </div>
    }
  `,
  styles: [`
    .course-hero { color: white; padding: 56px 0 48px; }
    .hero-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px;
      display: flex; justify-content: space-between; align-items: center; gap: 40px;
      @media (max-width: 768px) { flex-direction: column; padding: 0 24px; }
    }
    .hero-left { flex: 1; }
    .diff-badge { padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800;
      background: rgba(255,255,255,0.2); color: white; letter-spacing: 1px; text-transform: uppercase;
      display: inline-block; margin-bottom: 16px; backdrop-filter: blur(4px);
    }
    .hero-left h1 { font-size: 36px; font-weight: 900; margin: 0 0 14px; line-height: 1.2; }
    .hero-left p { font-size: 16px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 24px; max-width: 560px; }
    .hero-stats { display: flex; gap: 20px; flex-wrap: wrap;
      span { display: flex; align-items: center; gap: 6px; font-size: 14px; color: rgba(255,255,255,0.85);
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
      .pro-tag { background: rgba(246,173,85,0.25); border: 1px solid rgba(246,173,85,0.5);
        padding: 4px 12px; border-radius: 20px; color: #fcd34d;
        mat-icon { color: #fcd34d; }
      }
    }
    .start-btn { background: white !important; color: #667eea !important;
      font-size: 16px !important; font-weight: 800 !important; padding: 12px 32px !important;
      border-radius: 50px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
      white-space: nowrap;
    }

    /* ─── Content layout: lessons + sidebar, uses full width ─── */
    .content-wrap { max-width: 1280px; margin: 40px auto; padding: 0 40px 60px;
      display: grid; grid-template-columns: 1fr 320px; gap: 32px;
      @media (max-width: 900px) { grid-template-columns: 1fr; padding: 0 20px 48px; }
    }
    .content-main { min-width: 0; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      h2 { font-size: 22px; font-weight: 800; margin: 0; }
      .lesson-count { font-size: 14px; color: var(--text-secondary); }
    }
    .lessons-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
    .lesson-card {
      display: flex !important; flex-direction: row !important; align-items: center !important;
      gap: 16px; padding: 14px 18px !important; border-radius: 14px !important;
      transition: all 0.2s; overflow: visible;
      &:hover { box-shadow: 0 4px 16px rgba(102,126,234,0.16) !important; transform: translateX(4px); }
      @media (max-width: 560px) { flex-wrap: wrap; }
    }
    .lesson-num { width: 28px; height: 28px; border-radius: 50%; background: var(--bg-secondary);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; color: var(--text-secondary); flex-shrink: 0;
    }
    .lesson-type-icon { width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &.text { background: rgba(124,58,237,0.12); mat-icon { color: #7c3aed; } }
      &.video { background: rgba(220,38,38,0.12); mat-icon { color: #dc2626; } }
      &.interactive { background: rgba(22,163,74,0.12); mat-icon { color: #16a34a; } }
    }
    .lesson-info { flex: 1; min-width: 0; }
    .lesson-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; color: var(--text-primary); }
    .lesson-meta { display: flex; gap: 12px; align-items: center;
      span { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--text-muted);
        mat-icon { font-size: 13px; width: 13px; height: 13px; }
        &.type-label { background: var(--bg-secondary); padding: 2px 8px; border-radius: 10px; color: var(--text-secondary); }
        &.xp { color: #9f7aea; }
      }
    }
    .lesson-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .enter-btn { background: linear-gradient(135deg, #667eea, #764ba2) !important; color: white !important;
      font-weight: 700 !important; border-radius: 10px !important;
      mat-icon { font-size: 16px; width: 16px; height: 16px; margin-left: 2px; }
    }
    .back-link { margin-top: 8px; }

    /* ─── Sidebar ─── */
    .content-sidebar { @media (max-width: 900px) { order: -1; } }
    .sidebar-card { padding: 22px !important; border-radius: 16px !important;
      h3 { font-size: 16px; font-weight: 800; margin: 0 0 16px; color: var(--text-primary); }
    }
    .info-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px;
      li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary);
        mat-icon { font-size: 18px; width: 18px; height: 18px; color: #667eea; }
      }
    }

    /* ─── More Courses section ─── */
    .more-courses-section { background: var(--bg-secondary); padding: 56px 0; }
    .more-courses-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px;
      @media (max-width: 900px) { padding: 0 20px; }
    }
    .more-courses-grid { display: grid; gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .more-course-card { border-radius: 16px !important; overflow: hidden; padding: 0 !important;
      display: flex; flex-direction: column; transition: all 0.2s;
      &:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(102,126,234,0.16) !important; }
    }
    .mc-header { height: 70px; position: relative; display: flex; align-items: flex-end; padding: 0 16px 12px;
      &.diff-beginner { background: linear-gradient(135deg, #0f9b8e, #38ef7d); }
      &.diff-intermediate { background: linear-gradient(135deg, #1565c0, #42a5f5); }
      &.diff-advanced { background: linear-gradient(135deg, #5e35b1, #ab47bc); }
      &.diff-expert { background: linear-gradient(135deg, #c62828, #f06292); }
    }
    .diff-pill { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
      letter-spacing: 0.6px; text-transform: uppercase; background: rgba(255,255,255,0.95);
      &.beginner { color: #059669; } &.intermediate { color: #0284c7; }
      &.advanced { color: #7c3aed; } &.expert { color: #be185d; }
    }
    .mc-body { padding: 16px; flex: 1; display: flex; flex-direction: column;
      h4 { font-size: 15px; font-weight: 800; margin: 0 0 6px; color: var(--text-primary); }
      p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 12px; flex: 1;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
    }
    .mc-meta { display: flex; gap: 10px; margin-bottom: 14px;
      span { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted);
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }
    .mc-actions { display: flex; align-items: center; gap: 6px; }
    .enter-course-btn { flex: 1; background: linear-gradient(135deg, #667eea, #764ba2) !important;
      color: white !important; font-weight: 700 !important; border-radius: 10px !important;
      mat-icon { font-size: 16px; width: 16px; height: 16px; margin-left: 2px; }
    }

    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 50vh; gap: 16px; color: var(--text-muted);
      .spin-icon { font-size: 40px; width: 40px; height: 40px; animation: spin 1s linear infinite; }
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class CourseLandingComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  moreCourses: Course[] = [];
  courseId!: number;
  notFound = false;

  heroGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  ];

  get heroGradient(): string {
    return this.heroGradients[(this.courseId - 1) % this.heroGradients.length];
  }

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.apiService.getCourse(this.courseId).subscribe({
      next: (res) => { if (res.success) this.course = res.data; },
      error: () => { this.notFound = true; }
    });
    this.apiService.getCourseLessons(this.courseId).subscribe({
      next: (res) => { if (res.success) this.lessons = res.data; }
    });
    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.success) {
          this.moreCourses = res.data.filter(c => c.id !== this.courseId).slice(0, 4);
        }
      }
    });
  }

  lessonTypeIcon(type: string): string {
    const map: Record<string, string> = { TEXT: 'article', VIDEO: 'play_circle', INTERACTIVE: 'code' };
    return map[type] ?? 'menu_book';
  }

  previewLesson(lesson: Lesson, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/learn', this.courseId, 'lesson', lesson.id]);
  }

  viewCourse(course: Course): void {
    this.router.navigate(['/learn', course.id]);
  }
}

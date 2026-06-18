import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse, Lesson, Course } from '../../../core/models/models';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressBarModule, MatSnackBarModule, MatDividerModule],
  template: `
    <div class="lesson-layout">
      <!-- Sidebar -->
      <div class="lesson-sidebar">
        <div class="sidebar-header">
          <a [routerLink]="['/learn']" mat-icon-button><mat-icon>arrow_back</mat-icon></a>
          @if (course) {
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <mat-progress-bar mode="determinate" [value]="courseProgress" color="primary"></mat-progress-bar>
              <span class="progress-text">{{ courseProgress }}% complete</span>
            </div>
          }
        </div>
        <div class="lesson-list">
          @for (l of lessons; track l.id; let i = $index) {
            <div class="lesson-item"
              [class.active]="l.id === lesson?.id"
              [routerLink]="['/learn', courseId, 'lesson', l.id]">
              <div class="lesson-num">{{ i + 1 }}</div>
              <div class="lesson-info">
                <div class="lesson-name">{{ l.title }}</div>
                <div class="lesson-duration"><mat-icon>schedule</mat-icon> {{ l.durationMinutes }}m</div>
              </div>
              @if (l.completed) {
                <mat-icon class="completed-icon">check_circle</mat-icon>
              }
            </div>
          }
        </div>
      </div>

      <!-- Main Content -->
      @if (lesson) {
        <div class="lesson-content">
          <div class="lesson-header">
            <span class="lesson-type-badge">{{ lesson.lessonType }}</span>
            <h1>{{ lesson.title }}</h1>
            <div class="lesson-meta">
              <span><mat-icon>schedule</mat-icon> {{ lesson.durationMinutes }} min</span>
              <span><mat-icon>bolt</mat-icon> +{{ lesson.xpReward }} XP</span>
            </div>
          </div>

          <div class="lesson-body" [innerHTML]="lesson.content"></div>

          @if (lesson.sqlExamples) {
            <div class="sql-examples">
              <h2>SQL Examples</h2>
              @for (ex of getSqlExamples(lesson.sqlExamples); track ex) {
                <div class="example-block">
                  <pre><code>{{ ex }}</code></pre>
                </div>
              }
            </div>
          }

          @if (lesson.keyPoints) {
            <div class="key-points">
              <h2>Key Points</h2>
              <ul>
                @for (point of getKeyPoints(lesson.keyPoints); track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </div>
          }

          <mat-divider class="lesson-divider"></mat-divider>

          <div class="lesson-nav">
            <button mat-stroked-button [disabled]="!prevLessonId" [routerLink]="['/learn', courseId, 'lesson', prevLessonId]">
              <mat-icon>navigate_before</mat-icon> Previous
            </button>
            <button mat-raised-button color="primary" (click)="completeLesson()" [disabled]="completed">
              <mat-icon>{{ completed ? 'check_circle' : 'done' }}</mat-icon>
              {{ completed ? 'Completed!' : 'Mark as Complete' }}
            </button>
            <button mat-stroked-button [disabled]="!nextLessonId" [routerLink]="['/learn', courseId, 'lesson', nextLessonId]">
              Next <mat-icon>navigate_next</mat-icon>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .lesson-layout { display: grid; grid-template-columns: 300px 1fr; height: calc(100vh - 64px); overflow: hidden; }
    .lesson-sidebar { border-right: 1px solid var(--border); overflow-y: auto; background: var(--bg-secondary); }
    .sidebar-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start;
      h3 { font-size: 14px; font-weight: 700; margin: 0 0 8px; color: var(--text-primary); }
      .progress-text { font-size: 12px; color: var(--text-secondary); }
      .course-info { flex: 1; }
    }
    .lesson-list { padding: 8px 0; }
    .lesson-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer;
      transition: background 0.2s; border-left: 3px solid transparent;
      &.active { background: rgba(102,126,234,0.1); border-left-color: #667eea; }
      &:hover:not(.active) { background: var(--surface); }
    }
    .lesson-num { width: 24px; height: 24px; border-radius: 50%; background: var(--border);
      display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; color: var(--text-primary);
    }
    .lesson-info { flex: 1; min-width: 0; .lesson-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
      .lesson-duration { display: flex; align-items: center; gap: 2px; font-size: 11px; color: var(--text-secondary);
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
      }
    }
    .completed-icon { color: #48bb78; font-size: 18px; width: 18px; height: 18px; }
    .lesson-content { overflow-y: auto; padding: 40px 48px; background: var(--bg); }
    .lesson-header { margin-bottom: 32px;
      h1 { font-size: 32px; font-weight: 900; margin: 12px 0; color: var(--text-primary); }
    }
    .lesson-type-badge { background: rgba(124,58,237,0.12); color: #7c3aed; padding: 4px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 700;
    }
    .lesson-meta { display: flex; gap: 20px; color: var(--text-secondary); font-size: 14px;
      span { display: flex; align-items: center; gap: 6px; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    }
    .lesson-body { font-size: 16px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 32px;
      h2, h3 { font-weight: 700; margin-top: 32px; color: var(--text-primary); }
      code { background: var(--bg-secondary); color: var(--text-primary); padding: 2px 8px; border-radius: 4px; font-family: monospace; }
      pre { background: #1e1e2e; color: #e0e0e0; padding: 20px; border-radius: 12px;
        font-family: 'JetBrains Mono', monospace; overflow-x: auto; font-size: 14px;
      }
    }
    .sql-examples { margin-bottom: 32px;
      h2 { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); }
      .example-block { margin-bottom: 12px;
        pre { background: #1e1e2e; color: #e0e0e0; padding: 16px; border-radius: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-x: auto;
        }
      }
    }
    .key-points { background: rgba(102,126,234,0.08); border: 1px solid rgba(102,126,234,0.2); border-radius: 16px; padding: 24px; margin-bottom: 32px;
      h2 { font-size: 18px; font-weight: 700; margin: 0 0 16px; color: var(--text-primary); }
      ul { margin: 0; padding-left: 20px;
        li { margin-bottom: 8px; font-size: 14px; line-height: 1.7; color: var(--text-secondary); }
      }
    }
    .lesson-divider { margin: 24px 0; }
    .lesson-nav { display: flex; justify-content: space-between; align-items: center; padding-bottom: 40px; }
  `]
})
export class LessonDetailComponent implements OnInit {
  lesson: Lesson | null = null;
  course: Course | null = null;
  lessons: (Lesson & { completed?: boolean })[] = [];
  courseId!: number;
  courseProgress = 0;
  completed = false;
  prevLessonId: number | null = null;
  nextLessonId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router,
    private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));

    this.apiService.getCourse(this.courseId).subscribe({
      next: (res) => { if (res.success) this.course = res.data; }
    });
    this.apiService.getCourseLessons(this.courseId).subscribe({
      next: (res: ApiResponse<Lesson[]>) => {
        if (res.success) {
          this.lessons = res.data;
          const idx = this.lessons.findIndex(l => l.id === lessonId);
          if (idx > 0) this.prevLessonId = this.lessons[idx - 1].id;
          if (idx < this.lessons.length - 1) this.nextLessonId = this.lessons[idx + 1].id;
          const completedCount = this.lessons.filter(l => l.completed).length;
          this.courseProgress = Math.round((completedCount / this.lessons.length) * 100);
          if (idx >= 0) this.completed = !!this.lessons[idx].completed;
        }
      }
    });
    this.apiService.getLesson(lessonId).subscribe({
      next: (res: ApiResponse<Lesson>) => { if (res.success) this.lesson = res.data; }
    });
  }

  completeLesson(): void {
    this.apiService.completeLesson(this.lesson!.id, 0).subscribe({
      next: (res) => {
        if (res.success) {
          this.completed = true;
          this.snackBar.open(`Lesson completed! +${this.lesson!.xpReward} XP earned`, 'Close', { duration: 3000 });
          if (this.nextLessonId) {
            setTimeout(() => this.router.navigate(['/learn', this.courseId, 'lesson', this.nextLessonId]), 1200);
          }
        }
      }
    });
  }

  getSqlExamples(raw: string): string[] { return raw.split('---').map(s => s.trim()).filter(Boolean); }
  getKeyPoints(raw: string): string[] { return raw.split('\n').map(s => s.trim()).filter(Boolean); }
}

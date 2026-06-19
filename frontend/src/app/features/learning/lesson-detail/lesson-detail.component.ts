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
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
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
    this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('courseId'));
      const lessonId = Number(params.get('lessonId'));
      this.loadLesson(lessonId);
    });
  }

  private loadLesson(lessonId: number): void {
    this.completed = false;
    this.lesson = null;

    this.apiService.getCourse(this.courseId).subscribe({
      next: (res) => { if (res.success) this.course = res.data; }
    });
    this.apiService.getCourseLessons(this.courseId).subscribe({
      next: (res: ApiResponse<Lesson[]>) => {
        if (res.success) {
          this.lessons = res.data;
          const idx = this.lessons.findIndex(l => l.id === lessonId);
          this.prevLessonId = idx > 0 ? this.lessons[idx - 1].id : null;
          this.nextLessonId = idx < this.lessons.length - 1 ? this.lessons[idx + 1].id : null;
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

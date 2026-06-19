import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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
  templateUrl: './course-landing.component.html',
  styleUrls: ['./course-landing.component.css']
})
export class CourseLandingComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  lessons: Lesson[] = [];
  moreCourses: Course[] = [];
  courseId!: number;
  notFound = false;

  private paramsSub?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('courseId'));
      this.loadCourse();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }

  private loadCourse(): void {
    this.course = null;
    this.lessons = [];
    this.moreCourses = [];
    this.notFound = false;

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

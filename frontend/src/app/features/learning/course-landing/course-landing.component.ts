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
  templateUrl: './course-landing.component.html',
  styleUrls: ['./course-landing.component.css']
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

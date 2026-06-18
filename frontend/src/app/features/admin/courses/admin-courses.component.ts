import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse, Course } from '../../../core/models/models';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatInputModule, MatFormFieldModule, MatSelectModule,
    MatSlideToggleModule, MatSnackBarModule, MatChipsModule],
  template: `
    <div class="admin-courses">
      <div class="page-header">
        <div>
          <h1>Course Management</h1>
          <p>Manage SQL learning courses</p>
        </div>
        <button mat-raised-button color="primary" (click)="showForm = true; editingCourse = null; resetForm()">
          <mat-icon>add</mat-icon> Add Course
        </button>
      </div>

      @if (showForm) {
        <div class="course-form">
          <h3>{{ editingCourse ? 'Edit Course' : 'New Course' }}</h3>
          <form [formGroup]="courseForm" (ngSubmit)="saveCourse()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Title</mat-label>
                <input matInput formControlName="title">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Difficulty</mat-label>
                <mat-select formControlName="difficulty">
                  <mat-option value="BEGINNER">Beginner</mat-option>
                  <mat-option value="INTERMEDIATE">Intermediate</mat-option>
                  <mat-option value="ADVANCED">Advanced</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Order Index</mat-label>
                <input matInput type="number" formControlName="orderIndex">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Estimated Hours</mat-label>
                <input matInput type="number" formControlName="estimatedHours">
              </mat-form-field>
            </div>
            <div class="toggles">
              <mat-slide-toggle formControlName="published" color="primary">Published</mat-slide-toggle>
              <mat-slide-toggle formControlName="premium" color="accent">Premium</mat-slide-toggle>
            </div>
            <div class="form-actions">
              <button mat-button type="button" (click)="showForm = false">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="courseForm.invalid">Save</button>
            </div>
          </form>
        </div>
      }

      <div class="courses-table-card">
        <table mat-table [dataSource]="courses" class="courses-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let c">
              <div class="course-cell">
                <div class="course-icon" [style.background]="c.colorCode || '#667eea'">
                  <mat-icon>{{ c.iconClass || 'school' }}</mat-icon>
                </div>
                <div>
                  <div class="course-title">{{ c.title }}</div>
                  <div class="course-desc">{{ c.shortDescription }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="difficulty">
            <th mat-header-cell *matHeaderCellDef>Difficulty</th>
            <td mat-cell *matCellDef="let c">
              <span class="diff-badge" [class]="c.difficulty?.toLowerCase()">{{ c.difficulty }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="lessons">
            <th mat-header-cell *matHeaderCellDef>Lessons</th>
            <td mat-cell *matCellDef="let c">{{ c.totalLessons }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span class="status-chip" [class.published]="c.published">
                {{ c.published ? 'Published' : 'Draft' }}
              </span>
              @if (c.premium) {
                <span class="status-chip premium">Premium</span>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button (click)="editCourse(c)"><mat-icon>edit</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-courses { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 800; margin: 0; color: var(--text-primary); }
      p { color: var(--text-secondary); margin: 4px 0 0; }
    }
    .course-form { background: var(--surface); border-radius: 16px; padding: 24px; margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid var(--border);
      h3 { font-size: 18px; font-weight: 700; margin: 0 0 20px; color: var(--text-primary); }
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .toggles { display: flex; gap: 24px; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .courses-table-card { background: var(--surface); border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .courses-table { width: 100%; }
    .course-cell { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
    .course-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
      mat-icon { color: white; font-size: 20px; }
    }
    .course-title { font-weight: 600; font-size: 14px; color: var(--text-primary); }
    .course-desc { font-size: 12px; color: var(--text-secondary); }
    .diff-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.beginner { background: rgba(34,197,94,0.12); color: #16a34a; }
      &.intermediate { background: rgba(217,119,6,0.12); color: #d97706; }
      &.advanced { background: rgba(190,24,93,0.12); color: #be185d; }
    }
    .status-chip { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      background: var(--bg-secondary); color: var(--text-secondary); margin-right: 4px;
      &.published { background: rgba(34,197,94,0.12); color: #16a34a; }
      &.premium { background: rgba(217,119,6,0.12); color: #d97706; }
    }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  displayedColumns = ['title', 'difficulty', 'lessons', 'status', 'actions'];
  showForm = false;
  editingCourse: Course | null = null;
  courseForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['BEGINNER', Validators.required],
      orderIndex: [1],
      estimatedHours: [1],
      published: [false],
      premium: [false]
    });
  }

  ngOnInit(): void { this.loadCourses(); }

  loadCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (res) => { if (res.success) this.courses = res.data; }
    });
  }

  editCourse(course: Course): void {
    this.editingCourse = course;
    this.showForm = true;
    this.courseForm.patchValue(course);
  }

  resetForm(): void { this.courseForm.reset({ difficulty: 'BEGINNER', orderIndex: 1, published: false, premium: false }); }

  saveCourse(): void {
    const data = this.courseForm.value;
    const req = this.editingCourse
      ? this.apiService.updateCourse(this.editingCourse.id, data)
      : this.apiService.createCourse(data);
    req.subscribe({
      next: (res: ApiResponse<Course>) => {
        if (res.success) {
          this.snackBar.open('Course saved!', 'Close', { duration: 3000 });
          this.showForm = false;
          this.loadCourses();
        }
      }
    });
  }
}

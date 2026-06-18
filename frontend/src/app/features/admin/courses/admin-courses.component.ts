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
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
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

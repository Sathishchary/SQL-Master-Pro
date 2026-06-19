import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse, Course } from '../../../core/models/models';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatInputModule, MatFormFieldModule, MatSelectModule,
    MatSlideToggleModule, MatSnackBarModule, MatChipsModule, MatTooltipModule, QuillModule],
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Course>([]);
  displayedColumns = ['title', 'difficulty', 'lessons', 'status', 'actions'];
  showForm = false;
  viewOnly = false;
  editingCourse: Course | null = null;
  courseForm: FormGroup;

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block', 'link'],
      ['clean']
    ]
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  loadCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (res) => { if (res.success) this.dataSource.data = res.data; }
    });
  }

  newCourse(): void {
    this.editingCourse = null;
    this.viewOnly = false;
    this.showForm = true;
    this.resetForm();
  }

  viewCourse(course: Course): void {
    this.editingCourse = course;
    this.viewOnly = true;
    this.showForm = true;
    this.courseForm.patchValue(course);
    this.courseForm.disable();
  }

  editCourse(course: Course): void {
    this.editingCourse = course;
    this.viewOnly = false;
    this.showForm = true;
    this.courseForm.enable();
    this.courseForm.patchValue(course);
  }

  closeForm(): void {
    this.showForm = false;
    this.courseForm.enable();
  }

  resetForm(): void {
    this.courseForm.enable();
    this.courseForm.reset({ difficulty: 'BEGINNER', orderIndex: 1, estimatedHours: 1, published: false, premium: false });
  }

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

  deleteCourse(course: Course): void {
    if (!confirm(`Delete "${course.title}"? This also removes its lessons and quizzes. This cannot be undone.`)) return;
    this.apiService.deleteCourse(course.id).subscribe({
      next: (res: ApiResponse<void>) => {
        if (res.success) {
          this.snackBar.open('Course deleted', 'Close', { duration: 3000 });
          this.loadCourses();
        }
      }
    });
  }
}

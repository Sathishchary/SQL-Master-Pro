import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { ApiService } from '../../../../core/services/api.service';
import { ApiResponse, Course } from '../../../../core/models/models';

@Component({
  selector: 'app-admin-course-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule,
    MatTooltipModule, QuillModule],
  templateUrl: './admin-course-edit.component.html',
  styleUrls: ['./admin-course-edit.component.css']
})
export class AdminCourseEditComponent implements OnInit {
  courseId: number | null = null;
  viewOnly = false;
  saving = false;
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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
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

  ngOnInit(): void {
    this.viewOnly = this.route.snapshot.data['viewOnly'] === true;
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = Number(idParam);
      this.apiService.getCourse(this.courseId).subscribe({
        next: (res) => {
          if (res.success) {
            this.courseForm.patchValue(res.data);
            if (this.viewOnly) this.courseForm.disable();
          }
        },
        error: () => {
          this.snackBar.open('Failed to load course', 'Close', { duration: 4000 });
          this.router.navigateByUrl('/admin/courses');
        }
      });
    }
  }

  get pageTitle(): string {
    return this.viewOnly ? 'View Course' : (this.courseId ? 'Edit Course' : 'New Course');
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    const data = this.courseForm.value;
    this.saving = true;
    const req = this.courseId
      ? this.apiService.updateCourse(this.courseId, data)
      : this.apiService.createCourse(data);
    req.subscribe({
      next: (res: ApiResponse<Course>) => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Course saved!', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/admin/courses');
        }
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Failed to save course', 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/courses');
  }
}

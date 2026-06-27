import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ApiResponse, Course } from '../../../core/models/models';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatChipsModule, MatTooltipModule, MatMenuModule],
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Course>([]);
  displayedColumns = ['title', 'difficulty', 'lessons', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void { this.loadCourses(); }
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; }

  loadCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (res) => { if (res.success) this.dataSource.data = res.data; }
    });
  }

  newCourse(): void { this.router.navigateByUrl('/admin/courses/new'); }
  viewCourse(course: Course): void { this.router.navigateByUrl(`/admin/courses/view/${course.id}`); }
  editCourse(course: Course): void { this.router.navigateByUrl(`/admin/courses/edit/${course.id}`); }

  async deleteCourse(course: Course): Promise<void> {
    const ok = await this.confirmService.confirmDelete(course.title, 'This also removes its lessons and quizzes. This cannot be undone.');
    if (!ok) return;
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

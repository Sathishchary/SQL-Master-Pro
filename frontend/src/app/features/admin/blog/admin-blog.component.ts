import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse, Blog } from '../../../core/models/models';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatSlideToggleModule, MatSnackBarModule,
    MatTooltipModule, QuillModule],
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.css']
})
export class AdminBlogComponent implements OnInit {
  blogs: Blog[] = [];
  displayedColumns = ['title', 'category', 'status', 'reading', 'actions'];
  totalElements = 0;
  showForm = false;
  viewOnly = false;
  editingBlog: Blog | null = null;
  blogForm: FormGroup;

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block', 'link', 'image'],
      ['clean']
    ]
  };

  constructor(private apiService: ApiService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      tags: [''],
      readingTimeMinutes: [5],
      published: [false],
      featured: [false]
    });
  }

  ngOnInit(): void { this.loadBlogs(); }

  loadBlogs(page = 0): void {
    this.apiService.getAdminBlogs(page).subscribe({
      next: (res) => {
        if (res.success) { this.blogs = res.data.content; this.totalElements = res.data.totalElements; }
      }
    });
  }

  onPageChange(e: PageEvent): void { this.loadBlogs(e.pageIndex); }

  newBlog(): void {
    this.editingBlog = null;
    this.viewOnly = false;
    this.showForm = true;
    this.blogForm.enable();
    this.resetForm();
  }

  viewBlog(blog: Blog): void {
    this.editingBlog = blog;
    this.viewOnly = true;
    this.showForm = true;
    this.blogForm.patchValue(blog);
    this.blogForm.disable();
  }

  editBlog(blog: Blog): void {
    this.editingBlog = blog;
    this.viewOnly = false;
    this.showForm = true;
    this.blogForm.enable();
    this.blogForm.patchValue(blog);
  }

  closeForm(): void {
    this.showForm = false;
    this.blogForm.enable();
  }

  resetForm(): void {
    this.blogForm.reset({ readingTimeMinutes: 5, published: false, featured: false });
  }

  saveBlog(): void {
    const data = this.blogForm.value;
    const req = this.editingBlog
      ? this.apiService.updateBlog(this.editingBlog.id, data)
      : this.apiService.createBlog(data);
    req.subscribe({
      next: (res: ApiResponse<Blog>) => {
        if (res.success) {
          this.snackBar.open('Blog saved!', 'Close', { duration: 3000 });
          this.showForm = false;
          this.loadBlogs();
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to save blog', 'Close', { duration: 4000 });
      }
    });
  }
}

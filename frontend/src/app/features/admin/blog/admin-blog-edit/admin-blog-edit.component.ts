import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { ApiService } from '../../../../core/services/api.service';
import { TextToSpeechService } from '../../../../core/services/text-to-speech.service';
import { ApiResponse, Blog } from '../../../../core/models/models';

@Component({
  selector: 'app-admin-blog-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule, QuillModule],
  templateUrl: './admin-blog-edit.component.html',
  styleUrls: ['./admin-blog-edit.component.css']
})
export class AdminBlogEditComponent implements OnInit, OnDestroy {
  blogId: number | null = null;
  viewOnly = false;
  htmlSourceMode = false;
  saving = false;
  blog: Blog | null = null;
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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public tts: TextToSpeechService
  ) {
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

  ngOnInit(): void {
    this.viewOnly = this.route.snapshot.data['viewOnly'] === true;
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.blogId = Number(idParam);
      this.apiService.getAdminBlogById(this.blogId).subscribe({
        next: (res) => {
          if (res.success) {
            this.blog = res.data;
            if (!this.viewOnly) this.blogForm.patchValue(res.data);
          }
        },
        error: () => {
          this.snackBar.open('Failed to load blog post', 'Close', { duration: 4000 });
          this.router.navigateByUrl('/admin/blog');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.tts.stop();
  }

  get pageTitle(): string {
    return this.viewOnly ? 'View Blog Post' : (this.blogId ? 'Edit Blog Post' : 'New Blog Post');
  }

  toggleListen(): void {
    if (!this.blog) return;
    if (this.tts.isSpeaking() && !this.tts.isPaused()) {
      this.tts.pause();
    } else if (this.tts.isPaused()) {
      this.tts.resume();
    } else {
      const text = `${this.blog.title}. ${this.blog.excerpt ?? ''}. ${this.blog.content}`;
      this.tts.speak(text);
    }
  }

  getTags(tags?: string): string[] {
    return tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }

  toggleHtmlSource(): void {
    if (this.htmlSourceMode) {
      const current = this.blogForm.get('content')?.value || '';
      if (/<html[\s>]|<!DOCTYPE/i.test(current)) {
        this.blogForm.get('content')?.setValue(this.extractBodyHtml(current));
      }
    }
    this.htmlSourceMode = !this.htmlSourceMode;
  }

  private extractBodyHtml(raw: string): string {
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    return (doc.body?.innerHTML ?? raw).trim();
  }

  saveBlog(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }
    const data = this.blogForm.value;
    this.saving = true;
    const req = this.blogId
      ? this.apiService.updateBlog(this.blogId, data)
      : this.apiService.createBlog(data);
    req.subscribe({
      next: (res: ApiResponse<Blog>) => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Blog saved!', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/admin/blog');
        }
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Failed to save blog', 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/blog');
  }
}

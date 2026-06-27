import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { marked } from 'marked';
import { ApiService } from '../../../../core/services/api.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ApiResponse, Blog } from '../../../../core/models/models';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatTooltipModule, MatMenuModule],
  templateUrl: './admin-blog-list.component.html',
  styleUrls: ['./admin-blog-list.component.css']
})
export class AdminBlogListComponent implements OnInit {
  blogs: Blog[] = [];
  displayedColumns = ['title', 'category', 'status', 'reading', 'actions'];
  totalElements = 0;
  uploading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void { this.loadBlogs(); }

  loadBlogs(page = 0): void {
    this.apiService.getAdminBlogs(page).subscribe({
      next: (res) => {
        if (res.success) { this.blogs = res.data.content; this.totalElements = res.data.totalElements; }
      }
    });
  }

  onPageChange(e: PageEvent): void { this.loadBlogs(e.pageIndex); }

  newBlog(): void { this.router.navigateByUrl('/admin/blog/new'); }
  viewBlog(blog: Blog): void { this.router.navigateByUrl(`/admin/blog/view/${blog.id}`); }
  editBlog(blog: Blog): void { this.router.navigateByUrl(`/admin/blog/edit/${blog.id}`); }

  togglePublish(blog: Blog): void {
    const req = blog.published ? this.apiService.unpublishBlog(blog.id) : this.apiService.publishBlog(blog.id);
    req.subscribe({
      next: (res: ApiResponse<Blog>) => {
        if (res.success) {
          this.snackBar.open(blog.published ? 'Blog unpublished' : 'Blog published — now visible on the public blog page', 'Close', { duration: 4000 });
          this.loadBlogs();
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to update blog status', 'Close', { duration: 4000 });
      }
    });
  }

  async deleteBlog(blog: Blog): Promise<void> {
    const ok = await this.confirmService.confirmDelete(blog.title);
    if (!ok) return;
    this.apiService.deleteBlog(blog.id).subscribe({
      next: (res: ApiResponse<void>) => {
        if (res.success) {
          this.snackBar.open('Blog deleted', 'Close', { duration: 3000 });
          this.loadBlogs();
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete blog', 'Close', { duration: 4000 });
      }
    });
  }

  onUploadFile(files: FileList | null): void {
    const file = files?.[0];
    if (!file) return;

    const isMarkdown = /\.md$/i.test(file.name);
    const isHtml = /\.html?$/i.test(file.name);
    if (!isMarkdown && !isHtml) {
      this.snackBar.open('Only .md, .html or .htm files are supported', 'Close', { duration: 4000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || '');
      const html = isMarkdown ? (marked.parse(raw, { async: false }) as string) : this.extractBodyHtml(raw);
      const title = this.extractTitle(raw, file.name);
      const excerpt = this.extractExcerpt(html);
      const wordCount = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

      this.uploading = true;
      this.apiService.createBlog({
        title,
        excerpt,
        content: html,
        category: 'Uncategorized',
        readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
        published: false,
        featured: false
      }).subscribe({
        next: (res: ApiResponse<Blog>) => {
          this.uploading = false;
          if (res.success) {
            this.snackBar.open('Blog uploaded as draft — open it to review and publish.', 'Close', { duration: 4000 });
            this.loadBlogs();
          }
        },
        error: (err) => {
          this.uploading = false;
          this.snackBar.open(err.error?.message || 'Failed to upload blog', 'Close', { duration: 4000 });
        }
      });
    };
    reader.readAsText(file);
  }

  private extractBodyHtml(raw: string): string {
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    return (doc.body?.innerHTML ?? raw).trim();
  }

  private extractTitle(raw: string, fileName: string): string {
    const mdHeading = raw.match(/^#\s+(.+)$/m);
    if (mdHeading) return mdHeading[1].trim();
    const htmlHeading = raw.match(/<title[^>]*>(.*?)<\/title>/i) || raw.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (htmlHeading) return htmlHeading[1].replace(/<[^>]*>/g, '').trim();
    return fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  }

  private extractExcerpt(html: string): string {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  }
}

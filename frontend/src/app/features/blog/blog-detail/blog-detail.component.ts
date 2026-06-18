import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { Blog } from '../../../core/models/models';
import { STATIC_BLOGS } from '../static-blogs.data';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    @if (blog) {
      <div class="blog-detail-container">
        <div class="blog-hero">
          <div class="blog-meta">
            <span class="category">{{ blog.category }}</span>
            <span class="reading-time">{{ blog.readingTimeMinutes }} min read</span>
          </div>
          <h1 class="blog-title">{{ blog.title }}</h1>
          <p class="blog-excerpt">{{ blog.excerpt }}</p>
          @if (blog.author) {
            <div class="author-info">
              <div class="avatar">{{ blog.author.firstName[0] }}{{ blog.author.lastName[0] }}</div>
              <div>
                <div class="author-name">{{ blog.author.firstName }} {{ blog.author.lastName }}</div>
                <div class="pub-date">{{ blog.publishedAt | date:'longDate' }}</div>
              </div>
              <div class="blog-stats">
                <span><mat-icon>visibility</mat-icon> {{ blog.views }}</span>
                <span><mat-icon>favorite</mat-icon> {{ blog.likes }}</span>
              </div>
            </div>
          }
        </div>
        <div class="blog-body" [innerHTML]="blog.content"></div>
        @if (blog.tags) {
          <div class="blog-tags">
            <mat-chip-set>
              @for (tag of getTags(blog.tags); track tag) {
                <mat-chip>{{ tag }}</mat-chip>
              }
            </mat-chip-set>
          </div>
        }
        <div class="blog-nav">
          <a routerLink="/blog" mat-stroked-button><mat-icon>arrow_back</mat-icon> Back to Blog</a>
        </div>
      </div>
    }
  `,
  styles: [`
    .blog-detail-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
    .blog-hero { margin-bottom: 32px; }
    .blog-meta { display: flex; gap: 12px; margin-bottom: 16px;
      .category { background: rgba(102,126,234,0.12); color: #667eea; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
      .reading-time { color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; }
    }
    .blog-title { font-size: 36px; font-weight: 900; margin: 0 0 16px; line-height: 1.3; }
    .blog-excerpt { font-size: 18px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px; }
    .author-info { display: flex; align-items: center; gap: 12px; padding: 16px;
      background: var(--bg-secondary); border-radius: 12px;
    }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;
    }
    .author-name { font-weight: 700; font-size: 14px; color: var(--text-primary); }
    .pub-date { font-size: 12px; color: var(--text-secondary); }
    .blog-stats { margin-left: auto; display: flex; gap: 12px; color: var(--text-secondary); font-size: 13px;
      span { display: flex; align-items: center; gap: 4px; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    }
    .blog-body { line-height: 1.8; font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;
      h2 { font-size: 22px; font-weight: 800; margin-top: 36px; margin-bottom: 12px; color: var(--text-primary); }
      h3 { font-size: 18px; font-weight: 700; margin-top: 28px; color: var(--text-primary); }
      p { margin-bottom: 16px; }
      ul, ol { padding-left: 24px; margin-bottom: 16px; li { margin-bottom: 6px; } }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px;
        th, td { border: 1px solid var(--border); padding: 10px 14px; text-align: left; font-size: 14px; }
        th { background: var(--bg-secondary); font-weight: 700; color: var(--text-primary); }
        tr:nth-child(even) td { background: var(--bg-secondary); }
      }
      strong { color: var(--text-primary); }
      code { background: rgba(102,126,234,0.12); color: #667eea; padding: 2px 8px; border-radius: 6px;
        font-family: 'JetBrains Mono', monospace; font-size: 13px;
      }
      pre { background: #0d1117; color: #e6edf3; padding: 20px 24px; border-radius: 14px;
        overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 13px;
        line-height: 1.7; margin-bottom: 20px; border: 1px solid #21262d;
        code { background: none; color: inherit; padding: 0; font-size: 13px; }
      }
    }
    .blog-tags { margin-bottom: 24px; }
    .blog-nav { display: flex; justify-content: flex-start; }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.apiService.getBlog(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.blog = res.data;
        } else {
          this.blog = (STATIC_BLOGS.find(b => b.slug === slug) as any) ?? null;
        }
      },
      error: () => {
        this.blog = (STATIC_BLOGS.find(b => b.slug === slug) as any) ?? null;
      }
    });
  }

  getTags(tags: string): string[] { return tags.split(',').map(t => t.trim()); }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { Blog } from '../../../core/models/models';
import { STATIC_BLOGS } from '../static-blogs.data';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatChipsModule],
  template: `
    <!-- Hero -->
    <div class="blog-hero">
      <div class="blog-hero-inner">
        <div class="hero-eyebrow"><mat-icon>article</mat-icon> SQL Knowledge Hub</div>
        <h1>SQL Blog &amp; Tutorials</h1>
        <p>Expert articles on SQL, database design, performance tuning, and interview prep</p>
        <div class="search-wrap">
          <mat-icon class="search-icon">search</mat-icon>
          <input class="search-input" [(ngModel)]="searchQuery"
            (input)="filterBlogs()" placeholder="Search articles, topics, queries…">
        </div>
      </div>
    </div>

    <div class="blog-container">
      <!-- Category Filters -->
      <div class="category-bar">
        @for (cat of categories; track cat.value) {
          <button class="cat-btn"
            [class.active]="selectedCategory === cat.value"
            (click)="selectCategory(cat.value)">
            <mat-icon>{{ cat.icon }}</mat-icon>
            {{ cat.label }}
            <span class="cat-count">{{ getCategoryCount(cat.value) }}</span>
          </button>
        }
      </div>

      <!-- Results info -->
      <div class="results-bar">
        <span>{{ filteredBlogs.length }} article{{ filteredBlogs.length !== 1 ? 's' : '' }}</span>
        @if (searchQuery) {
          <span class="search-tag">
            Results for "{{ searchQuery }}"
            <button (click)="searchQuery=''; filterBlogs()"><mat-icon>close</mat-icon></button>
          </span>
        }
      </div>

      <!-- Featured Article -->
      @if (filteredBlogs.length > 0 && !searchQuery && !selectedCategory) {
        <div class="featured-article" [routerLink]="['/blog', filteredBlogs[0].slug]">
          <div class="featured-img" [style.background]="getBlogGradient(0)">
            <span class="featured-badge">Featured</span>
            <div class="featured-category">{{ filteredBlogs[0].category }}</div>
          </div>
          <div class="featured-body">
            <div class="featured-meta">
              <span><mat-icon>schedule</mat-icon>{{ filteredBlogs[0].readingTimeMinutes }} min read</span>
              <span><mat-icon>visibility</mat-icon>{{ filteredBlogs[0].views | number }}</span>
            </div>
            <h2 class="featured-title">{{ filteredBlogs[0].title }}</h2>
            <p class="featured-excerpt">{{ filteredBlogs[0].excerpt }}</p>
            <div class="featured-tags">
              @for (tag of getTags(filteredBlogs[0].tags).slice(0,4); track tag) {
                <span class="ftag">{{ tag }}</span>
              }
            </div>
            <button mat-raised-button class="read-btn">Read Article <mat-icon>arrow_forward</mat-icon></button>
          </div>
        </div>
      }

      <!-- Blog Grid -->
      <div class="blog-grid">
        @for (blog of getPagedBlogs(); track blog.slug; let i = $index) {
          <div class="blog-card" [routerLink]="['/blog', blog.slug]">
            <div class="blog-thumb" [style.background]="getBlogGradient(i + 1)">
              <span class="blog-cat-badge">{{ blog.category }}</span>
              <div class="read-time-badge"><mat-icon>schedule</mat-icon>{{ blog.readingTimeMinutes }}m</div>
            </div>
            <div class="blog-card-body">
              <h3 class="blog-card-title">{{ blog.title }}</h3>
              <p class="blog-card-excerpt">{{ blog.excerpt }}</p>
              <div class="blog-tags">
                @for (tag of getTags(blog.tags).slice(0,3); track tag) {
                  <span class="btag">{{ tag }}</span>
                }
              </div>
              <div class="blog-card-footer">
                @if (blog.author) {
                  <div class="author-row">
                    <div class="author-ava">{{ blog.author.firstName[0] }}{{ blog.author.lastName[0] }}</div>
                    <span>{{ blog.author.firstName }} {{ blog.author.lastName }}</span>
                  </div>
                }
                <div class="blog-views"><mat-icon>visibility</mat-icon>{{ blog.views }}</div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (totalPages > 1) {
        <div class="pagination">
          <button class="page-btn nav-btn" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">
            <mat-icon>chevron_left</mat-icon>
          </button>

          @for (p of getPageNumbers(); track p) {
            @if (p === -1) {
              <span class="page-dots">…</span>
            } @else {
              <button class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">
                {{ p }}
              </button>
            }
          }

          <button class="page-btn nav-btn" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      }

      @if (filteredBlogs.length === 0) {
        <div class="empty-state">
          <mat-icon>search_off</mat-icon>
          <h3>No articles found</h3>
          <p>Try a different search term or category</p>
          <button mat-stroked-button (click)="searchQuery=''; selectCategory('')">Clear Filters</button>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ── Hero ── */
    .blog-hero {
      background: linear-gradient(145deg, #0d0221 0%, #1e0b3e 50%, #0f2744 100%);
      padding: 72px 32px 60px; text-align: center; position: relative; overflow: hidden;
      &::before { content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
        width: 600px; height: 300px; border-radius: 50%; background: rgba(124,58,237,0.15); filter: blur(60px); }
    }
    .blog-hero-inner { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.4);
      color: #c4b5fd; padding: 6px 16px; border-radius: 50px; font-size: 13px;
      font-weight: 600; margin-bottom: 20px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .blog-hero h1 { font-size: clamp(28px, 5vw, 48px); font-weight: 900; color: white !important; margin: 0 0 14px; }
    .blog-hero p { color: rgba(255,255,255,0.65) !important; font-size: 16px; line-height: 1.7; margin-bottom: 28px; }
    .search-wrap {
      display: flex; align-items: center; gap: 12px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 50px; padding: 12px 24px; max-width: 520px; margin: 0 auto;
      backdrop-filter: blur(8px);
      .search-icon { color: rgba(255,255,255,0.4); }
      .search-input { flex: 1; background: none; border: none; outline: none;
        color: white; font-size: 15px; font-family: inherit;
        &::placeholder { color: rgba(255,255,255,0.4); }
      }
    }

    /* ── Container ── */
    .blog-container { max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; }

    /* ── Category Filters ── */
    .category-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    .cat-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 50px; border: 1.5px solid var(--border);
      background: var(--surface); font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer;
      transition: all 0.2s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      .cat-count { background: var(--bg-secondary); color: var(--text-primary); border-radius: 20px;
        padding: 1px 7px; font-size: 11px; font-weight: 700; }
      &:hover { border-color: #667eea; color: #667eea; }
      &.active { background: #667eea; border-color: #667eea; color: white;
        .cat-count { background: rgba(255,255,255,0.25); color: white; }
      }
    }

    /* ── Results bar ── */
    .results-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
      font-size: 14px; color: var(--text-secondary);
      .search-tag { display: flex; align-items: center; gap: 4px; background: #ede9fe;
        color: #7c3aed; border-radius: 20px; padding: 2px 10px; font-size: 13px; font-weight: 600;
        button { border: none; background: none; cursor: pointer; display: flex; align-items: center;
          color: #7c3aed; padding: 0; mat-icon { font-size: 14px; width: 14px; height: 14px; }
        }
      }
    }

    /* ── Featured ── */
    .featured-article {
      display: grid; grid-template-columns: 1fr 1fr; border-radius: 24px; overflow: hidden;
      margin-bottom: 40px; cursor: pointer; box-shadow: var(--shadow-md);
      border: 1px solid var(--border); transition: all 0.3s;
      &:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(102,126,234,0.18); }
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .featured-img {
      min-height: 300px; position: relative; display: flex; flex-direction: column;
      justify-content: space-between; padding: 20px;
      .featured-badge { background: white; color: #667eea; padding: 4px 14px; border-radius: 20px;
        font-size: 12px; font-weight: 800; width: fit-content;
      }
      .featured-category { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 700;
        background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px; width: fit-content;
      }
    }
    .featured-body { padding: 32px; background: var(--surface); display: flex; flex-direction: column; gap: 12px; }
    .featured-meta { display: flex; gap: 16px; font-size: 13px; color: var(--text-muted);
      span { display: flex; align-items: center; gap: 4px;
        mat-icon { font-size: 15px; width: 15px; height: 15px; }
      }
    }
    .featured-title { font-size: 24px; font-weight: 900; line-height: 1.3; margin: 0; color: var(--text-primary); }
    .featured-excerpt { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin: 0; flex: 1; }
    .featured-tags { display: flex; flex-wrap: wrap; gap: 6px;
      .ftag { background: #ede9fe; color: #6d28d9; padding: 3px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; }
    }
    .read-btn { background: linear-gradient(135deg, #667eea, #764ba2) !important; color: white !important;
      border-radius: 12px !important; display: flex; align-items: center; gap: 6px;
      mat-icon { font-size: 18px; transition: transform 0.2s; }
      &:hover mat-icon { transform: translateX(4px); }
    }

    /* ── Blog Grid ── */
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .blog-card {
      background: var(--surface); border-radius: 18px; overflow: hidden; cursor: pointer;
      border: 1px solid var(--border); transition: all 0.28s;
      box-shadow: var(--shadow-sm);
      &:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(102,126,234,0.14); border-color: transparent; }
    }
    .blog-thumb {
      height: 160px; position: relative; display: flex; justify-content: space-between;
      align-items: flex-start; padding: 14px;
      .blog-cat-badge { background: rgba(0,0,0,0.5); color: white; backdrop-filter: blur(4px);
        padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
      }
      .read-time-badge { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.3); color: white; padding: 3px 10px;
        border-radius: 20px; font-size: 11px; font-weight: 600;
        display: flex; align-items: center; gap: 3px;
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
      }
    }
    .blog-card-body { padding: 18px; }
    .blog-card-title { font-size: 16px; font-weight: 800; margin: 0 0 8px; line-height: 1.4; color: var(--text-primary);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .blog-card-excerpt { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .blog-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px;
      .btag { background: var(--bg-secondary); color: var(--text-secondary); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    }
    .blog-card-footer { display: flex; justify-content: space-between; align-items: center; }
    .author-row { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-secondary);
      .author-ava { width: 24px; height: 24px; border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2); color: white;
        display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;
      }
    }
    .blog-views { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--text-muted);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    /* ── Empty ── */
    .empty-state { text-align: center; padding: 80px 20px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; margin-bottom: 16px; opacity: 0.4; }
      h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary); }
      p { margin-bottom: 20px; }
    }

    /* ── Pagination ── */
    .pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 48px; flex-wrap: wrap;
    }
    .page-btn {
      min-width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid var(--border);
      background: var(--surface); font-size: 14px; font-weight: 600; color: var(--text-primary);
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover:not([disabled]):not(.active) { border-color: #667eea; color: #667eea; background: #f5f3ff; }
      &.active { background: linear-gradient(135deg, #667eea, #764ba2); border-color: transparent; color: white; box-shadow: 0 4px 14px rgba(102,126,234,0.35); }
      &[disabled] { opacity: 0.35; cursor: not-allowed; }
    }
    .nav-btn { padding: 0 10px; }
    .page-dots { font-size: 14px; color: var(--text-muted); padding: 0 4px; line-height: 40px; }
  `]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  selectedCategory = '';
  searchQuery = '';
  currentPage = 1;
  readonly pageSize = 6;

  categories = [
    { label: 'All',              value: '',                   icon: 'apps' },
    { label: 'SQL Basics',       value: 'SQL Basics',         icon: 'code' },
    { label: 'PostgreSQL',       value: 'PostgreSQL',         icon: 'storage' },
    { label: 'Performance',      value: 'Performance Tuning', icon: 'speed' },
    { label: 'Interview',        value: 'Interview Prep',     icon: 'work' },
    { label: 'Database Design',  value: 'Database Design',    icon: 'schema' },
    { label: 'Window Functions', value: 'Window Functions',   icon: 'view_column' },
  ];

  gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #fd7979 0%, #f0e842 100%)',
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void { this.loadBlogs(); }

  loadBlogs(): void {
    this.apiService.getBlogs(0, 20, this.selectedCategory, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success && res.data.content?.length > 0) {
          this.blogs = res.data.content;
        } else {
          this.blogs = STATIC_BLOGS as any[];
        }
        this.filterBlogs();
      },
      error: () => {
        this.blogs = STATIC_BLOGS as any[];
        this.filterBlogs();
      }
    });
  }

  filterBlogs(): void {
    let result = this.blogs;
    if (this.selectedCategory) {
      result = result.filter(b => b.category === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags?.toLowerCase().includes(q)
      );
    }
    this.filteredBlogs = result;
    this.currentPage = 1;
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterBlogs();
  }

  getCategoryCount(cat: string): number {
    if (!cat) return this.blogs.length;
    return this.blogs.filter(b => b.category === cat).length;
  }

  getGridBlogs(): Blog[] {
    if (!this.selectedCategory && !this.searchQuery && this.filteredBlogs.length > 1) {
      return this.filteredBlogs.slice(1);
    }
    return this.filteredBlogs;
  }

  get totalPages(): number {
    return Math.ceil(this.getGridBlogs().length / this.pageSize);
  }

  getPagedBlogs(): Blog[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.getGridBlogs().slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const cur = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (cur > 3) pages.push(-1);
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  getBlogGradient(index: number): string {
    return this.gradients[index % this.gradients.length];
  }

  getTags(tags: string | undefined): string[] {
    if (!tags) return [];
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  }
}

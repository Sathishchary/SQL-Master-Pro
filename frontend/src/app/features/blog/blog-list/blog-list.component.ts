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
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
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

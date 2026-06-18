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
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
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

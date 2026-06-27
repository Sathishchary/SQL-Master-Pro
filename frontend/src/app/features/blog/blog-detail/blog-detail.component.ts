import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../core/services/api.service';
import { TextToSpeechService } from '../../../core/services/text-to-speech.service';
import { Blog } from '../../../core/models/models';
import { STATIC_BLOGS } from '../static-blogs.data';
import { CommentSectionComponent } from '../../../shared/components/comment-section/comment-section.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatTooltipModule, CommentSectionComponent],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  blog: Blog | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public tts: TextToSpeechService) {}

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

  ngOnDestroy(): void {
    this.tts.stop();
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

  getTags(tags: string): string[] { return tags.split(',').map(t => t.trim()); }
}

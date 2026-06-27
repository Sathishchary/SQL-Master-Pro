import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Comment, CommentTargetType } from '../../../core/models/models';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  @Input({ required: true }) targetType!: CommentTargetType;
  @Input({ required: true }) targetId!: number;

  comments: Comment[] = [];
  loading = true;
  newComment = '';
  posting = false;
  replyDrafts: Record<number, string> = {};
  replyingTo: number | null = null;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void { this.loadComments(); }

  get isLoggedIn(): boolean { return this.authService.isAuthenticated(); }
  get isStaff(): boolean { return this.authService.isAdmin(); }
  get currentUserId(): number | undefined { return this.authService.currentUser()?.userId; }

  loadComments(): void {
    this.loading = true;
    this.apiService.getComments(this.targetType, this.targetId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.comments = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  postComment(): void {
    if (!this.newComment.trim()) return;
    this.posting = true;
    this.apiService.addComment(this.targetType, this.targetId, this.newComment.trim()).subscribe({
      next: (res) => {
        this.posting = false;
        if (res.success) {
          this.newComment = '';
          this.loadComments();
        }
      },
      error: (err) => {
        this.posting = false;
        this.snackBar.open(err.error?.message || 'Failed to post comment', 'Close', { duration: 4000 });
      }
    });
  }

  toggleReply(commentId: number): void {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
  }

  postReply(commentId: number): void {
    const content = (this.replyDrafts[commentId] || '').trim();
    if (!content) return;
    this.apiService.replyToComment(commentId, content).subscribe({
      next: (res) => {
        if (res.success) {
          this.replyDrafts[commentId] = '';
          this.replyingTo = null;
          this.loadComments();
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to post reply', 'Close', { duration: 4000 });
      }
    });
  }

  async deleteComment(comment: Comment): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Delete this comment?',
      text: 'This cannot be undone.',
      confirmText: 'Delete',
      danger: true
    });
    if (!ok) return;
    this.apiService.deleteComment(comment.id).subscribe({
      next: (res) => {
        if (res.success) this.loadComments();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete comment', 'Close', { duration: 4000 });
      }
    });
  }

  canDelete(comment: Comment): boolean {
    return this.isStaff || comment.userId === this.currentUserId;
  }

  initials(name: string): string {
    return name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}

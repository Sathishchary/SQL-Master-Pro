import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="verify-page">
      <mat-card class="verify-card">
        <mat-card-content>
          @if (verifying) {
            <div class="verifying-state">
              <mat-spinner diameter="60"></mat-spinner>
              <p>Verifying your email...</p>
            </div>
          }
          @if (verified) {
            <div class="success-state">
              <div class="icon">✅</div>
              <h1>Email Verified!</h1>
              <p>Your email has been verified successfully. You can now access all features.</p>
              <a routerLink="/dashboard" mat-raised-button color="primary">Go to Dashboard</a>
            </div>
          }
          @if (error) {
            <div class="error-state">
              <div class="icon">❌</div>
              <h1>Verification Failed</h1>
              <p>{{ error }}</p>
              <a routerLink="/auth/login" mat-raised-button color="primary">Back to Login</a>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-page { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 64px); }
    .verify-card { max-width: 420px; width: 100%; border-radius: 20px !important; }
    .verifying-state, .success-state, .error-state { text-align: center; padding: 32px;
      .icon { font-size: 64px; margin-bottom: 16px; }
      h1 { font-size: 24px; font-weight: 800; }
      p { color: var(--text-secondary); margin-bottom: 24px; }
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;
  verified = false;
  error = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) { this.verifying = false; this.error = 'Invalid verification link'; return; }
    this.authService.verifyEmail(token).subscribe({
      next: () => { this.verifying = false; this.verified = true; },
      error: (e) => { this.verifying = false; this.error = e.error?.message || 'Verification failed'; }
    });
  }
}

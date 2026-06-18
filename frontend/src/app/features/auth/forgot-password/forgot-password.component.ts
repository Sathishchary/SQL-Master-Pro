import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <mat-card-content>
          <div class="auth-icon">🔐</div>
          <h1>Forgot Password?</h1>
          @if (sent) {
            <div class="success-msg">
              <mat-icon>mark_email_read</mat-icon>
              <p>Reset link sent! Check your email inbox.</p>
            </div>
          } @else {
            <p>Enter your email and we'll send you a reset link.</p>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit"
                [disabled]="form.invalid || loading" class="submit-btn">
                Send Reset Link
              </button>
            </form>
          }
          <p class="back-link"><a routerLink="/auth/login">Back to Login</a></p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 64px); }
    .auth-card { width: 100%; max-width: 420px; border-radius: 20px !important; padding: 8px; }
    .auth-icon { font-size: 48px; text-align: center; margin-bottom: 16px; }
    h1 { text-align: center; font-size: 28px; font-weight: 800; }
    p { text-align: center; color: var(--text-secondary); }
    .full-width { width: 100%; margin-top: 16px; }
    .submit-btn { width: 100%; margin-top: 8px; border-radius: 10px !important; }
    .success-msg { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px;
      background: rgba(72,187,120,0.1); border-radius: 12px; margin: 16px 0;
      mat-icon { color: #48bb78; font-size: 40px; width: 40px; height: 40px; }
    }
    .back-link { text-align: center; margin-top: 16px; a { color: #667eea; } }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  sent = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => { this.sent = true; },
      error: (e) => { this.snackBar.open(e.error?.message || 'Failed to send email', 'Close'); },
      complete: () => this.loading = false
    });
  }
}

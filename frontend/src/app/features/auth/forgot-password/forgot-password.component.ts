import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  sent = false;
  submittedEmail = '';
  focused = false;
  stars: { x: number; y: number; size: number; delay: number }[] = [];

  steps = [
    { icon: 'mail_outline', text: 'Enter the email linked to your account' },
    { icon: 'forward_to_inbox', text: 'We send a secure reset link to your inbox' },
    { icon: 'lock_open', text: 'Click the link and choose a new password' },
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  ngOnInit(): void {
    this.stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
  }

  get email() {
    return this.form.get('email');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.submittedEmail = this.form.value.email;
    this.authService.forgotPassword(this.submittedEmail).subscribe({
      next: () => { this.sent = true; },
      error: (e) => { this.snackBar.open(e.error?.message || 'Failed to send email', 'Close', { duration: 5000 }); },
      complete: () => this.loading = false
    });
  }

  resend(): void {
    this.sent = false;
  }
}

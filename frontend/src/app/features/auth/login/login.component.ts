import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  rememberMe = false;
  focused = '';
  stars: { x: number; y: number; size: number; delay: number }[] = [];

  stats = [
    { val: '50K+', label: 'Students' },
    { val: '1.2K+', label: 'Questions' },
    { val: '900+', label: 'Challenges' },
    { val: '4.9★', label: 'Rating' },
  ];

  features = [
    'Execute real SQL against live PostgreSQL databases',
    'AI-powered query hints and error explanations',
    'Earn XP, badges & verified certificates',
    'Track progress with detailed analytics',
  ];

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
    }));
  }

  ngOnDestroy(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const { emailOrUsername, password } = this.loginForm.value;
    this.authService.login(emailOrUsername, password, this.rememberMe).subscribe({
      next: (res) => {
        if (res.success) {
          const defaultUrl = this.authService.isAdmin() ? '/admin' : '/dashboard';
          const returnUrl = sessionStorage.getItem('returnUrl') || defaultUrl;
          sessionStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
          this.snackBar.open('Welcome back! 🎉', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.message || 'Login failed. Please try again.';
        const isUnverified = message.toLowerCase().includes('verify your email');
        const ref = this.snackBar.open(message, isUnverified && emailOrUsername.includes('@') ? 'Resend Email' : 'Close', {
          duration: isUnverified ? 8000 : 5000, panelClass: 'error-snack'
        });
        if (isUnverified && emailOrUsername.includes('@')) {
          ref.onAction().subscribe(() => this.resendVerification(emailOrUsername));
        }
      },
      complete: () => { this.isLoading = false; }
    });
  }

  private resendVerification(email: string): void {
    this.authService.resendVerificationEmail(email).subscribe({
      next: () => this.snackBar.open('Verification email sent! Check your inbox.', 'Close', { duration: 4000 }),
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to resend email', 'Close', { duration: 4000 })
    });
  }
}

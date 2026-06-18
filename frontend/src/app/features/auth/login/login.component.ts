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
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
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

  fillCredential(username: string, password: string): void {
    this.loginForm.patchValue({ emailOrUsername: username, password });
    this.loginForm.markAllAsTouched();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const { emailOrUsername, password } = this.loginForm.value;
    this.authService.login(emailOrUsername, password).subscribe({
      next: (res) => {
        if (res.success) {
          const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard';
          sessionStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
          this.snackBar.open('Welcome back! 🎉', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Login failed. Please try again.', 'Close', {
          duration: 5000, panelClass: 'error-snack'
        });
      },
      complete: () => { this.isLoading = false; }
    });
  }
}

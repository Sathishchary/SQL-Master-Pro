import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPwd = false;
  isLoading = false;
  submitted = false;
  focused = '';
  stars: { x: number; y: number; size: number; delay: number }[] = [];

  perks = [
    '10 comprehensive SQL modules',
    'Real-time SQL execution engine',
    '1,200+ quiz questions',
    'Industry-recognized certificates',
    'AI-powered SQL assistant',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      username:  ['', [Validators.required, Validators.minLength(3)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(8)]],
      terms:     [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
  }

  get f() { return this.registerForm.controls; }

  get passwordStrength(): number {
    const p = this.f['password'].value || '';
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  get strengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.passwordStrength];
  }

  get strengthColor(): string {
    return ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'][this.passwordStrength];
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    const { firstName, lastName, username, email, password } = this.registerForm.value;

    this.authService.register({ firstName, lastName, username, email, password }).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Account created! Welcome aboard 🎉', 'Close', { duration: 5000 });
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Registration failed. Please try again.', 'Close', {
          duration: 5000, panelClass: 'error-snack'
        });
      },
      complete: () => this.isLoading = false,
    });
  }
}

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
  template: `
    <div class="page">

      <!-- ── LEFT PANEL ── -->
      <div class="panel left-panel">
        <!-- Animated Background -->
        <div class="bg-layer">
          <div class="orb orb1"></div>
          <div class="orb orb2"></div>
          <div class="orb orb3"></div>
          <div class="grid-lines"></div>
        </div>

        <!-- Stars -->
        <div class="stars">
          @for (s of stars; track $index) {
            <span class="star"
              [style.left.%]="s.x" [style.top.%]="s.y"
              [style.width.px]="s.size" [style.height.px]="s.size"
              [style.animation-delay.s]="s.delay">
            </span>
          }
        </div>

        <div class="left-content">
          <!-- Brand -->
          <div class="brand">
            <div class="brand-icon">⚡</div>
            <span>SQL Master Pro</span>
          </div>

          <!-- Headline -->
          <div class="headline-wrap">
            <h1 class="headline">
              Your SQL Journey<br>
              <span class="gradient-text">Starts Here.</span>
            </h1>
            <p class="tagline">
              Master SQL from beginner to expert with real databases,
              AI-powered hints, and 1,200+ practice questions.
            </p>
          </div>

          <!-- SQL Code Animation -->
          <div class="sql-card">
            <div class="sql-header">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span class="sql-file">live_query.sql</span>
              <span class="sql-badge">● RUNNING</span>
            </div>
            <pre class="sql-code"><span class="kw">WITH</span> top_students <span class="kw">AS</span> (
  <span class="kw">SELECT</span> user_id, <span class="fn">COUNT</span>(*) <span class="kw">AS</span> solved,
         <span class="fn">SUM</span>(xp) <span class="kw">AS</span> total_xp
  <span class="kw">FROM</span>   submissions
  <span class="kw">WHERE</span>  correct = <span class="val">true</span>
  <span class="kw">GROUP BY</span> user_id
)
<span class="kw">SELECT</span> u.username, s.solved,
       <span class="fn">RANK</span>() <span class="kw">OVER</span> (<span class="kw">ORDER BY</span> s.total_xp <span class="kw">DESC</span>)
<span class="kw">FROM</span>   users u <span class="kw">JOIN</span> top_students s
       <span class="kw">ON</span> u.id = s.user_id
<span class="kw">LIMIT</span> <span class="num">10</span>;</pre>
            <div class="sql-result">
              <mat-icon>check_circle</mat-icon> 10 rows · 8ms
            </div>
          </div>

          <!-- Stats -->
          <div class="stats-row">
            @for (s of stats; track s.label) {
              <div class="stat">
                <div class="stat-val">{{ s.val }}</div>
                <div class="stat-label">{{ s.label }}</div>
              </div>
            }
          </div>

          <!-- Features -->
          <div class="feat-list">
            @for (f of features; track f) {
              <div class="feat-row">
                <div class="feat-check"><mat-icon>check</mat-icon></div>
                <span>{{ f }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- ── RIGHT PANEL ── -->
      <div class="panel right-panel">
        <div class="form-wrap">

          <!-- Header -->
          <div class="form-header">
            <div class="form-icon">🔐</div>
            <h2 class="form-title">Sign In</h2>
            <p class="form-sub">Access your learning dashboard</p>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">

            <div class="field-group">
              <label class="field-label">Email or Username</label>
              <div class="field-wrap" [class.focused]="focused === 'user'" [class.filled]="loginForm.get('emailOrUsername')?.value">
                <mat-icon class="field-icon">alternate_email</mat-icon>
                <input class="field-input" formControlName="emailOrUsername"
                  placeholder="you@example.com or username"
                  (focus)="focused='user'" (blur)="focused=''">
              </div>
              @if (loginForm.get('emailOrUsername')?.touched && loginForm.get('emailOrUsername')?.hasError('required')) {
                <span class="field-error">Required</span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Password</label>
              <div class="field-wrap" [class.focused]="focused === 'pass'" [class.filled]="loginForm.get('password')?.value">
                <mat-icon class="field-icon">lock_outline</mat-icon>
                <input class="field-input" [type]="showPassword ? 'text' : 'password'"
                  formControlName="password" placeholder="Enter your password"
                  (focus)="focused='pass'" (blur)="focused=''">
                <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')) {
                <span class="field-error">Required</span>
              }
            </div>

            <div class="form-meta">
              <label class="remember-wrap">
                <input type="checkbox" [(ngModel)]="rememberMe" [ngModelOptions]="{standalone: true}">
                <span>Remember me</span>
              </label>
              <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="signin-btn" [disabled]="loginForm.invalid || isLoading">
              @if (isLoading) {
                <mat-spinner diameter="20" style="--mdc-circular-progress-active-indicator-color:white"></mat-spinner>
              } @else {
                <mat-icon>login</mat-icon> Sign In to Dashboard
              }
            </button>

          </form>

          <!-- Test Credentials -->
          <div class="creds-box">
            <div class="creds-title">
              <mat-icon>vpn_key</mat-icon>
              Quick Access — Test Accounts
            </div>
            <div class="creds-grid">
              <div class="cred-card admin" (click)="fillCredential('admin', 'admin123')">
                <div class="cred-role">
                  <mat-icon>admin_panel_settings</mat-icon> Admin
                </div>
                <div class="cred-vals">
                  <code>admin</code>
                  <span class="cred-sep">/</span>
                  <code>admin123</code>
                </div>
                <div class="cred-use">Click to use →</div>
              </div>
              <div class="cred-card user" (click)="fillCredential('dataglance', 'test123')">
                <div class="cred-role">
                  <mat-icon>person</mat-icon> User
                </div>
                <div class="cred-vals">
                  <code>dataglance</code>
                  <span class="cred-sep">/</span>
                  <code>test123</code>
                </div>
                <div class="cred-use">Click to use →</div>
              </div>
            </div>
          </div>

          <p class="register-link">
            New to SQL Master Pro?
            <a routerLink="/auth/register">Create a free account →</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ─── Page Layout ─────────────────────────────────────────────────── */
    .page {
      display: grid;
      grid-template-columns: 55% 45%;
      min-height: 100vh;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    /* ─── LEFT PANEL ──────────────────────────────────────────────────── */
    .left-panel {
      position: relative;
      background: linear-gradient(145deg, #05011a 0%, #0f0530 35%, #0a1628 70%, #050e20 100%);
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      padding: 48px 52px;
      @media (max-width: 900px) { display: none; }
    }

    /* Animated orbs */
    .bg-layer { position: absolute; inset: 0; pointer-events: none; }
    .orb {
      position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.25;
      animation: orbFloat 10s ease-in-out infinite;
    }
    .orb1 { width: 500px; height: 500px; background: #5b21b6; top: -150px; left: -150px; animation-duration: 12s; }
    .orb2 { width: 350px; height: 350px; background: #1d4ed8; bottom: -100px; right: -80px; animation-duration: 9s; animation-delay: 2s; }
    .orb3 { width: 250px; height: 250px; background: #0891b2; top: 50%; left: 60%; animation-duration: 7s; animation-delay: 4s; }
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(30px, -30px) scale(1.05); }
      66%       { transform: translate(-20px, 20px) scale(0.95); }
    }

    /* Grid lines */
    .grid-lines {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(102,126,234,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(102,126,234,0.06) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Stars */
    .stars { position: absolute; inset: 0; pointer-events: none; }
    .star {
      position: absolute; border-radius: 50%; background: white;
      animation: twinkle 4s ease-in-out infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50%       { opacity: 0.2; transform: scale(0.5); }
    }

    /* Left content */
    .left-content { position: relative; z-index: 2; width: 100%; }

    .brand {
      display: flex; align-items: center; gap: 10px; margin-bottom: 36px;
      .brand-icon { font-size: 26px; }
      span { font-size: 18px; font-weight: 800; color: white; letter-spacing: -0.3px; }
    }

    .headline-wrap { margin-bottom: 28px; }
    .headline {
      font-size: clamp(28px, 3vw, 42px); font-weight: 900; line-height: 1.15;
      color: white !important; margin: 0 0 14px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .tagline {
      font-size: 14px; color: rgba(255,255,255,0.55) !important;
      line-height: 1.75; max-width: 420px; margin: 0;
    }

    /* SQL Card */
    .sql-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(102,126,234,0.25);
      border-radius: 16px; overflow: hidden; margin-bottom: 28px;
      backdrop-filter: blur(8px);
      animation: cardFloat 6s ease-in-out infinite;
    }
    @keyframes cardFloat {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    .sql-header {
      display: flex; align-items: center; gap: 6px; padding: 10px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(0,0,0,0.2);
      .dot { width: 10px; height: 10px; border-radius: 50%; }
      .r { background: #ff5f57; } .y { background: #ffbd2e; } .g { background: #28c840; }
      .sql-file { margin-left: 8px; font-size: 11px; color: rgba(255,255,255,0.35); font-family: monospace; flex: 1; }
      .sql-badge { font-size: 10px; font-weight: 700; color: #4ade80; letter-spacing: 0.5px;
        display: flex; align-items: center; gap: 3px;
        &::before { content: ''; display: inline-block; width: 6px; height: 6px;
          background: #4ade80; border-radius: 50%; animation: blink 1.2s ease-in-out infinite; }
      }
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
    .sql-code {
      margin: 0; padding: 14px 16px; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; line-height: 1.75; overflow-x: auto;
      .kw  { color: #c792ea; font-weight: 700; }
      .fn  { color: #82aaff; }
      .val { color: #4ade80; }
      .num { color: #f78c6c; }
    }
    .sql-result {
      display: flex; align-items: center; gap: 6px; padding: 8px 14px;
      border-top: 1px solid rgba(255,255,255,0.07); font-size: 11px;
      color: #4ade80; font-family: monospace;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    /* Stats */
    .stats-row {
      display: flex; gap: 20px; margin-bottom: 24px;
      .stat { text-align: center;
        .stat-val { font-size: 20px; font-weight: 900; color: white !important; }
        .stat-label { font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase;
          letter-spacing: 1px; margin-top: 2px; }
      }
    }

    /* Features */
    .feat-list { display: flex; flex-direction: column; gap: 10px; }
    .feat-row {
      display: flex; align-items: center; gap: 10px; font-size: 13px;
      color: rgba(255,255,255,0.7) !important;
      .feat-check { width: 20px; height: 20px; border-radius: 50%;
        background: rgba(74,222,128,0.2); border: 1px solid rgba(74,222,128,0.4);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        mat-icon { font-size: 12px; width: 12px; height: 12px; color: #4ade80; }
      }
    }

    /* ─── RIGHT PANEL ─────────────────────────────────────────────────── */
    .right-panel {
      display: flex; align-items: flex-start; justify-content: center;
      padding: 48px 32px; background: var(--bg-secondary);
      overflow-y: auto;
    }
    .form-wrap {
      width: 100%; max-width: 440px;
      animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .form-header { text-align: center; margin-bottom: 32px; }
    .form-icon { font-size: 44px; margin-bottom: 12px; }
    .form-title {
      font-size: 28px; font-weight: 900; margin: 0 0 6px; color: var(--text-primary);
    }
    .form-sub { font-size: 14px; color: var(--text-secondary); margin: 0; }

    /* Custom Fields */
    .login-form { display: flex; flex-direction: column; gap: 16px; }
    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .field-wrap {
      display: flex; align-items: center; gap: 10px;
      background: var(--surface); border: 2px solid var(--border); border-radius: 14px;
      padding: 0 14px; height: 52px; transition: all 0.2s;
      .field-icon { color: var(--text-muted); font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; transition: color 0.2s; }
      &.focused { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
        .field-icon { color: #667eea; }
      }
      &.filled { border-color: var(--border); }
    }
    .field-input {
      flex: 1; border: none; outline: none; background: none;
      font-size: 15px; color: var(--text-primary); font-family: inherit;
      &::placeholder { color: var(--text-muted); }
    }
    .eye-btn {
      border: none; background: none; cursor: pointer; padding: 0;
      display: flex; align-items: center; color: #9ca3af;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover { color: #667eea; }
    }
    .field-error { font-size: 12px; color: #ef4444; padding-left: 4px; }

    /* Meta row */
    .form-meta {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px;
      .remember-wrap { display: flex; align-items: center; gap: 6px; color: #6b7280; cursor: pointer;
        input[type=checkbox] { width: 15px; height: 15px; accent-color: #667eea; cursor: pointer; }
      }
      .forgot-link { color: #667eea; font-weight: 600; text-decoration: none; font-size: 13px;
        &:hover { text-decoration: underline; }
      }
    }

    /* Sign In Button */
    .signin-btn {
      width: 100%; height: 54px; border: none; border-radius: 14px; cursor: pointer;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; font-size: 16px; font-weight: 700; font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.25s; margin-top: 4px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover:not([disabled]) {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(102,126,234,0.45);
      }
      &:active:not([disabled]) { transform: translateY(0); }
      &[disabled] { opacity: 0.6; cursor: not-allowed; }
    }

    /* Or divider */
    .or-row {
      display: flex; align-items: center; gap: 12px; margin: 20px 0;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--border); }
      span { font-size: 12px; color: var(--text-muted); font-weight: 600; white-space: nowrap; }
    }

    /* OAuth */
    .oauth-row { display: flex; gap: 12px; margin-bottom: 20px; }
    .oauth-btn {
      flex: 1; height: 46px; border-radius: 12px; border: 2px solid var(--border);
      background: var(--surface); cursor: pointer; font-size: 14px; font-weight: 700;
      font-family: inherit; display: flex; align-items: center; justify-content: center;
      gap: 8px; transition: all 0.2s; color: var(--text-primary);
      &:hover { border-color: #667eea; background: var(--bg-secondary); transform: translateY(-1px); }
    }
    .github-btn:hover { border-color: #667eea; }

    /* Credentials Box */
    .creds-box {
      background: linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%);
      border: 1px solid #e9d5ff; border-radius: 16px; padding: 16px; margin-bottom: 20px;
    }
    .creds-title {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 800; color: #7c3aed;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .creds-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .cred-card {
      border-radius: 12px; padding: 12px 14px; cursor: pointer; transition: all 0.2s;
      border: 1.5px solid transparent;
      .cred-role { font-size: 11px; font-weight: 700; display: flex; align-items: center;
        gap: 4px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
      .cred-vals { display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
        code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; padding: 1px 6px;
          border-radius: 4px; }
        .cred-sep { color: #9ca3af; font-size: 12px; }
      }
      .cred-use { font-size: 10px; font-weight: 700; margin-top: 8px; letter-spacing: 0.3px; }
      &.admin {
        background: rgba(124,58,237,0.07); border-color: rgba(124,58,237,0.2);
        .cred-role { color: #7c3aed; }
        code { background: rgba(124,58,237,0.1); color: #6d28d9; }
        .cred-use { color: #7c3aed; }
        &:hover { background: rgba(124,58,237,0.14); border-color: #7c3aed;
          transform: translateY(-2px); box-shadow: 0 6px 16px rgba(124,58,237,0.15); }
      }
      &.user {
        background: rgba(37,99,235,0.06); border-color: rgba(37,99,235,0.2);
        .cred-role { color: #2563eb; }
        code { background: rgba(37,99,235,0.1); color: #1d4ed8; }
        .cred-use { color: #2563eb; }
        &:hover { background: rgba(37,99,235,0.12); border-color: #2563eb;
          transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37,99,235,0.15); }
      }
    }

    /* Register link */
    .register-link {
      text-align: center; font-size: 14px; color: var(--text-secondary); margin: 0;
      a { color: #667eea; font-weight: 700; text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
  `]
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

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
  template: `
    <div class="register-wrap">

      <!-- ── LEFT PANEL ── -->
      <div class="left-panel">
        <div class="orbs">
          <div class="orb orb1"></div>
          <div class="orb orb2"></div>
          <div class="orb orb3"></div>
        </div>

        <!-- stars -->
        @for (s of stars; track s.x) {
          <div class="star"
            [style.left.%]="s.x" [style.top.%]="s.y"
            [style.width.px]="s.size" [style.height.px]="s.size"
            [style.animation-delay.s]="s.delay"></div>
        }

        <div class="left-content">
          <div class="brand-pill">
            <mat-icon>bolt</mat-icon>
            <span>SQL Master Pro</span>
          </div>

          <h1 class="left-heading">
            Start Your<br>
            <span class="grad-text">SQL Journey.</span>
          </h1>
          <p class="left-sub">
            Join 50,000+ developers mastering SQL with interactive lessons,
            real database execution, and expert guidance.
          </p>

          <ul class="perks">
            @for (p of perks; track p) {
              <li>
                <span class="perk-icon"><mat-icon>check</mat-icon></span>
                <span>{{ p }}</span>
              </li>
            }
          </ul>

          <div class="left-stats">
            <div class="lstat"><span class="lv">50K+</span><span class="ll">Learners</span></div>
            <div class="ldiv"></div>
            <div class="lstat"><span class="lv">120+</span><span class="ll">Lessons</span></div>
            <div class="ldiv"></div>
            <div class="lstat"><span class="lv">4.9★</span><span class="ll">Rating</span></div>
          </div>
        </div>
      </div>

      <!-- ── RIGHT PANEL ── -->
      <div class="right-panel">
        <div class="form-card">

          <div class="form-header">
            <div class="form-icon"><mat-icon>person_add</mat-icon></div>
            <h2>Create Account</h2>
            <p>Free forever · No credit card required</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>

            <!-- Name row -->
            <div class="row-2">
              <div class="field-wrap" [class.focused]="focused === 'firstName'"
                   [class.has-error]="submitted && f['firstName'].errors">
                <label>First Name <span class="req">*</span></label>
                <div class="input-inner">
                  <mat-icon>badge</mat-icon>
                  <input type="text" formControlName="firstName" placeholder="John"
                    (focus)="focused = 'firstName'" (blur)="focused = ''">
                </div>
                @if (submitted && f['firstName'].hasError('required')) {
                <div class="err-msg">Required</div>
              }
              </div>

              <div class="field-wrap" [class.focused]="focused === 'lastName'"
                   [class.has-error]="submitted && f['lastName'].errors">
                <label>Last Name <span class="req">*</span></label>
                <div class="input-inner">
                  <mat-icon>badge</mat-icon>
                  <input type="text" formControlName="lastName" placeholder="Doe"
                    (focus)="focused = 'lastName'" (blur)="focused = ''">
                </div>
                @if (submitted && f['lastName'].hasError('required')) {
                  <div class="err-msg">Required</div>
                }
              </div>
            </div>

            <!-- Username -->
            <div class="field-wrap" [class.focused]="focused === 'username'"
                 [class.has-error]="submitted && f['username'].errors">
              <label>Username <span class="req">*</span></label>
              <div class="input-inner">
                <mat-icon>alternate_email</mat-icon>
                <input type="text" formControlName="username" placeholder="johndoe123"
                  (focus)="focused = 'username'" (blur)="focused = ''">
              </div>
              @if (submitted && f['username'].hasError('required')) { <div class="err-msg">Username required</div> }
              @if (submitted && f['username'].hasError('minlength')) { <div class="err-msg">Min 3 characters</div> }
            </div>

            <!-- Email -->
            <div class="field-wrap" [class.focused]="focused === 'email'"
                 [class.has-error]="submitted && f['email'].errors">
              <label>Email Address <span class="req">*</span></label>
              <div class="input-inner">
                <mat-icon>email</mat-icon>
                <input type="email" formControlName="email" placeholder="john@example.com"
                  (focus)="focused = 'email'" (blur)="focused = ''">
              </div>
              @if (submitted && f['email'].hasError('required')) { <div class="err-msg">Email required</div> }
              @if (submitted && f['email'].hasError('email')) { <div class="err-msg">Invalid email</div> }
            </div>

            <!-- Password -->
            <div class="field-wrap" [class.focused]="focused === 'password'"
                 [class.has-error]="submitted && f['password'].errors">
              <label>Password <span class="req">*</span></label>
              <div class="input-inner">
                <mat-icon>lock</mat-icon>
                <input [type]="showPwd ? 'text' : 'password'" formControlName="password"
                  placeholder="Min 8 characters"
                  (focus)="focused = 'password'" (blur)="focused = ''">
                <button type="button" class="eye-btn" (click)="showPwd = !showPwd">
                  <mat-icon>{{ showPwd ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              <!-- Strength bar -->
              @if (f['password'].value) {
                <div class="strength-row">
                  <div class="strength-bar">
                    <div class="strength-fill"
                      [style.width.%]="passwordStrength * 25"
                      [style.background]="strengthColor"></div>
                  </div>
                  <span class="strength-label" [style.color]="strengthColor">{{ strengthLabel }}</span>
                </div>
              }
              @if (submitted && f['password'].hasError('required')) { <div class="err-msg">Password required</div> }
              @if (submitted && f['password'].hasError('minlength')) { <div class="err-msg">Min 8 characters</div> }
            </div>

            <!-- Terms -->
            <label class="terms-check" [class.has-error]="submitted && f['terms'].hasError('required')">
              <input type="checkbox" formControlName="terms">
              <span class="checkmark"></span>
              <span class="terms-text">
                I agree to the
                <a href="#" class="tlink">Terms of Service</a> and
                <a href="#" class="tlink">Privacy Policy</a>
              </span>
            </label>
            @if (submitted && f['terms'].hasError('required')) {
              <div class="err-msg terms-err">You must accept the terms</div>
            }

            <!-- Submit -->
            <button type="submit" class="submit-btn" [class.loading]="isLoading" [disabled]="isLoading">
              @if (isLoading) { <mat-spinner diameter="20"></mat-spinner> }
              @if (!isLoading) {
                <span><mat-icon>rocket_launch</mat-icon> Create Free Account</span>
              }
            </button>

          </form>

          <p class="signin-row">
            Already have an account?
            <a routerLink="/auth/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── LAYOUT ── */
    .register-wrap {
      display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
      > * { min-width: 0; }
    }

    /* ── LEFT PANEL ── */
    .left-panel {
      position: relative; overflow: hidden;
      background: linear-gradient(145deg, #0d0221 0%, #1a0533 45%, #0f1e3a 100%);
      display: flex; align-items: center; justify-content: center; padding: 60px 56px;
      @media (max-width: 900px) { display: none; }
    }
    .orbs { position: absolute; inset: 0; pointer-events: none;
      .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; animation: orbFloat 10s ease-in-out infinite; }
      .orb1 { width: 420px; height: 420px; background: #7c3aed; top: -120px; left: -80px; }
      .orb2 { width: 300px; height: 300px; background: #2563eb; bottom: -60px; right: 60px; animation-delay: 3s; }
      .orb3 { width: 200px; height: 200px; background: #06b6d4; top: 50%; right: -40px; animation-delay: 6s; }
    }
    @keyframes orbFloat {
      0%,100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(18px,-18px) scale(1.04); }
      66% { transform: translate(-12px,12px) scale(0.96); }
    }
    .star {
      position: absolute; border-radius: 50%; background: white;
      animation: twinkle 4s ease-in-out infinite;
    }
    @keyframes twinkle {
      0%,100% { opacity: 0.1; } 50% { opacity: 0.8; }
    }

    .left-content { position: relative; z-index: 2; }

    .brand-pill {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(124,58,237,0.25); border: 1px solid rgba(124,58,237,0.4);
      color: #c4b5fd; padding: 6px 18px; border-radius: 50px;
      font-size: 13px; font-weight: 700; margin-bottom: 28px;
      mat-icon { font-size: 17px; width: 17px; height: 17px; }
    }

    .left-heading {
      font-size: clamp(34px,4vw,52px); font-weight: 900; line-height: 1.1;
      color: white !important; margin: 0 0 18px;
    }
    .grad-text {
      background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .left-sub {
      font-size: 16px; color: rgba(255,255,255,0.6) !important;
      line-height: 1.75; max-width: 440px; margin: 0 0 32px;
    }

    .perks { list-style: none; padding: 0; margin: 0 0 36px;
      li { display: flex; align-items: center; gap: 12px; padding: 7px 0;
        color: rgba(255,255,255,0.85); font-size: 15px;
      }
      .perk-icon {
        width: 26px; height: 26px; border-radius: 50%;
        background: rgba(52,211,153,0.2); border: 1px solid rgba(52,211,153,0.4);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        mat-icon { font-size: 15px; width: 15px; height: 15px; color: #34d399; }
      }
    }

    .left-stats {
      display: flex; align-items: center; gap: 20px;
      .lstat { text-align: center;
        .lv { display: block; font-size: 20px; font-weight: 900; color: white !important; }
        .ll { display: block; font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 1px; }
      }
      .ldiv { width: 1px; height: 32px; background: rgba(255,255,255,0.15); }
    }

    /* ── RIGHT PANEL ── */
    .right-panel {
      background: var(--bg-secondary); display: flex; align-items: center;
      justify-content: center; padding: 40px 24px; overflow-y: auto; overflow-x: hidden;
      min-width: 0;
    }

    .form-card {
      width: 100%; max-width: 480px;
      background: var(--surface); border-radius: 24px;
      box-shadow: 0 8px 40px rgba(102,126,234,0.12), 0 2px 8px rgba(0,0,0,0.04);
      padding: 40px 32px 32px;
      animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
      box-sizing: border-box;
      @media (max-width: 520px) { padding: 28px 20px 24px; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .form-header { text-align: center; margin-bottom: 28px;
      .form-icon {
        width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 14px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 24px rgba(102,126,234,0.35);
        animation: iconPop 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        mat-icon { font-size: 28px; width: 28px; height: 28px; color: white; }
      }
      h2 { font-size: 26px; font-weight: 900; margin: 0 0 6px; color: var(--text-primary); }
      p  { font-size: 13px; color: var(--text-muted); margin: 0; }
    }
    @keyframes iconPop {
      from { opacity: 0; transform: scale(0.6); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* ── FIELDS ── */
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 4px;
      .field-wrap { min-width: 0; }
      @media (max-width: 520px) { grid-template-columns: 1fr; }
    }

    .field-wrap {
      margin-bottom: 16px;
      label { display: block; font-size: 12px; font-weight: 700;
        color: var(--text-primary); margin-bottom: 6px; letter-spacing: 0.3px;
        .req { color: #ef4444; }
      }
    }

    .input-inner {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid var(--border); border-radius: 12px;
      padding: 0 14px; height: 50px; background: var(--bg-secondary);
      transition: border-color 0.2s, background 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted); flex-shrink: 0; }
      input {
        flex: 1; border: none; outline: none; background: none;
        font-size: 14px; color: var(--text-primary);
        &::placeholder { color: var(--text-muted); }
      }
    }
    .field-wrap.focused .input-inner {
      border-color: #667eea; border-width: 2px;
      background: var(--surface); box-shadow: 0 1px 6px rgba(102,126,234,0.15);
    }
    .field-wrap.has-error .input-inner {
      border-color: #ef4444; border-width: 2px; background: var(--surface);
    }

    .eye-btn {
      background: none; border: none; cursor: pointer; padding: 0;
      display: flex; align-items: center;
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #9ca3af; }
      &:hover mat-icon { color: #667eea; }
    }

    .err-msg { font-size: 11px; color: #ef4444; margin-top: 4px; padding-left: 2px; }

    /* ── STRENGTH ── */
    .strength-row {
      display: flex; align-items: center; gap: 10px; margin-top: 6px;
    }
    .strength-bar {
      flex: 1; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden;
      .strength-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease, background 0.3s ease; }
    }
    .strength-label { font-size: 11px; font-weight: 700; min-width: 40px; text-align: right; }

    /* ── TERMS ── */
    .terms-check {
      display: flex; align-items: flex-start; gap: 10px; cursor: pointer; margin-bottom: 4px;
      input[type="checkbox"] { display: none; }
      .checkmark {
        width: 18px; height: 18px; border: 2px solid #d1d5db; border-radius: 5px;
        flex-shrink: 0; margin-top: 1px; transition: all 0.2s;
        display: flex; align-items: center; justify-content: center;
      }
      input:checked ~ .checkmark {
        background: #667eea; border-color: #667eea;
      }
      input:checked ~ .checkmark::after { content: '✓'; font-size: 11px; color: white; font-weight: 900; }
      &.has-error .checkmark { border-color: #ef4444; }
      .terms-text { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    }
    .tlink { color: #667eea; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }
    .terms-err { margin-bottom: 12px; }

    /* ── SUBMIT ── */
    .submit-btn {
      width: 100%; height: 52px; border: none; border-radius: 14px; cursor: pointer;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; font-size: 15px; font-weight: 700; margin-top: 20px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.2s; box-shadow: 0 4px 20px rgba(102,126,234,0.35);
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(102,126,234,0.45);
      }
      &:active:not(:disabled) { transform: translateY(0); }
      &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      &.loading { background: linear-gradient(135deg, #9bb0f8, #a87cc7); }
    }

    .signin-row {
      text-align: center; margin: 22px 0 0; font-size: 14px; color: var(--text-muted);
      a { color: #667eea; font-weight: 700; text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
  `]
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

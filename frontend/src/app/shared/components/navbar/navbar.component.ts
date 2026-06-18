import { Component, EventEmitter, Input, Output, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../core/models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule,
            MatMenuModule, MatIconModule, MatBadgeModule, MatDividerModule, MatTooltipModule],
  template: `
    <mat-toolbar class="navbar" [class.scrolled]="scrolled">
      <a routerLink="/" class="brand">
        <span class="brand-icon">⚡</span>
        <span class="brand-name">SQL Master Pro</span>
      </a>

      @if (!isMobile) {
      <nav class="nav-links">
        <a routerLink="/learn" routerLinkActive="active" mat-button>Learn</a>
        <a routerLink="/playground" routerLinkActive="active" mat-button>Playground</a>
        <a routerLink="/quiz" routerLinkActive="active" mat-button>Quiz</a>
        <a routerLink="/challenges" routerLinkActive="active" mat-button>Challenges</a>
        <a routerLink="/blog" routerLinkActive="active" mat-button>Blog</a>
        <a routerLink="/pricing" routerLinkActive="active" mat-button class="pricing-btn">
          <mat-icon>star</mat-icon> Pricing
        </a>
      </nav>
      }

      <span class="spacer"></span>

      <!-- Theme Dropdown -->
      <button mat-icon-button [matMenuTriggerFor]="themeMenu" [matTooltip]="'Current: ' + currentTheme" class="theme-btn">
        <mat-icon>{{ themeIcon }}</mat-icon>
      </button>
      <mat-menu #themeMenu="matMenu" class="theme-dropdown-menu">
        <div class="theme-menu-header">Choose Theme</div>
        @for (t of themes; track t.value) {
        <button mat-menu-item (click)="themeSelected.emit(t.value)"
          [class.theme-active]="currentTheme === t.value">
          <mat-icon>{{ t.icon }}</mat-icon>
          <span>{{ t.label }}</span>
          @if (currentTheme === t.value) {
          <mat-icon class="check-icon">check</mat-icon>
          }
        </button>
        }
      </mat-menu>

      @if (isAuth()) {
        <div class="nav-divider"></div>
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="avatar-btn">
          <div class="avatar">{{ userInitials() }}</div>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="menu-header" mat-menu-item disabled>
            <div class="menu-user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</div>
            <div class="menu-user-plan">{{ currentUser()?.subscriptionPlan }} Plan</div>
          </div>
          <mat-divider></mat-divider>
          <a mat-menu-item routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a mat-menu-item routerLink="/certificates">
            <mat-icon>workspace_premium</mat-icon> My Certificates
          </a>
          <a mat-menu-item routerLink="/pricing">
            <mat-icon>upgrade</mat-icon> Upgrade Plan
          </a>
          @if (isAdmin()) {
            <mat-divider></mat-divider>
            <a mat-menu-item routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon> Admin Panel
            </a>
          }
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-menu>
      } @else {
        <a routerLink="/auth/login" mat-button>Login</a>
        <a routerLink="/auth/register" mat-raised-button color="primary" class="register-btn">
          Get Started Free
        </a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--nav-bg, rgba(255,255,255,0.95));
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      padding: 0 24px;
      height: 64px;
      transition: all 0.3s ease;
      &.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
    }
    .brand {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; color: inherit;
      .brand-icon { font-size: 24px; }
      .brand-name { font-size: 20px; font-weight: 800;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    }
    .nav-links { display: flex; align-items: center; margin-left: 24px;
      a { font-weight: 500; &.active { color: #667eea; } }
      .pricing-btn { color: #f59e0b !important;
        mat-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; margin-right: 2px; }
      }
    }
    .spacer { flex: 1; }
    .nav-divider { width: 1px; height: 24px; background: #e5e7eb; margin: 0 4px; }
    .avatar-btn { padding: 0 !important; width: 40px !important; height: 40px !important; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; cursor: pointer; letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(102,126,234,0.35);
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover { transform: scale(1.08); box-shadow: 0 4px 14px rgba(102,126,234,0.45); }
    }
    .menu-header { padding: 10px 16px 8px; cursor: default !important; }
    .menu-user-name { font-weight: 700; font-size: 14px; color: #111827; }
    .menu-user-plan { font-size: 12px; color: #667eea; font-weight: 600; margin-top: 2px; }
    .register-btn { margin-left: 8px; border-radius: 20px !important; }
    .theme-btn { transition: transform 0.2s; &:hover { transform: rotate(20deg); } }
    @media (max-width: 768px) { .nav-links { display: none; } }
  `]
})
export class NavbarComponent {
  @Output() themeSelected = new EventEmitter<string>();
  @Input() currentTheme = 'light';

  themes = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark',  label: 'Dark',  icon: 'dark_mode' },
  ];

  isMobile = window.innerWidth < 768;
  scrolled = false;

  get themeIcon(): string {
    const icons: Record<string, string> = {
      light: 'light_mode', dark: 'dark_mode'
    };
    return icons[this.currentTheme] ?? 'palette';
  }

  isAuth!: Signal<boolean>;
  isAdmin!: Signal<boolean>;
  currentUser!: Signal<AuthResponse | null>;
  userInitials = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return '';
    return (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
  });

  constructor(private authService: AuthService) {
    this.isAuth = this.authService.isAuthenticated;
    this.isAdmin = this.authService.isAdmin;
    this.currentUser = this.authService.currentUser;
  }

  logout(): void { this.authService.logout(); }
}

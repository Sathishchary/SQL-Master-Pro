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
import { AuthResponse, ThemeOption } from '../../../core/models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule,
            MatMenuModule, MatIconModule, MatBadgeModule, MatDividerModule, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() themeSelected = new EventEmitter<string>();
  @Input() currentTheme = 'light';

  themes: ThemeOption[] = [
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

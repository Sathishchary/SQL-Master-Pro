import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse, NavItem } from '../../../core/models/models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'people', label: 'Users', path: '/admin/users' },
    { icon: 'library_books', label: 'Courses', path: '/admin/courses' },
    { icon: 'article', label: 'Blog', path: '/admin/blog' },
    { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' },
    { icon: 'payments', label: 'Payments', path: '/admin/payments' }
  ];

  currentUser: Signal<AuthResponse | null>;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
  }

  get userInitials(): string {
    const u = this.currentUser();
    if (!u) return '';
    return (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
  }

  logout(): void {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../../../core/models/models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatMenuModule, MatSnackBarModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['user', 'role', 'xp', 'status', 'actions'];
  totalElements = 0;
  searchQuery = '';
  plans = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'];

  private avatarPalette = [
    'linear-gradient(135deg, #6c5ce7, #8b7bff)',
    'linear-gradient(135deg, #0fb88f, #33d6b0)',
    'linear-gradient(135deg, #f6a609, #ffc24d)',
    'linear-gradient(135deg, #6c5ce7, #4b3fc4)'
  ];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(page = 0): void {
    this.apiService.getAdminUsers(page).subscribe({
      next: (res) => {
        if (res.success) { this.users = res.data.content; this.totalElements = res.data.totalElements; }
      }
    });
  }

  get activeCount(): number { return this.users.filter(u => u.active).length; }
  get totalXp(): number { return this.users.reduce((sum, u) => sum + (u.totalXp || 0), 0); }
  get enterpriseCount(): number { return this.users.filter(u => u.subscriptionPlan === 'ENTERPRISE').length; }

  avatarGradient(index: number): string {
    return this.avatarPalette[index % this.avatarPalette.length];
  }

  roleLabel(plan: string): string {
    return plan && plan !== 'FREE' ? plan.charAt(0) + plan.slice(1).toLowerCase() : 'Member';
  }

  isPremiumPlan(plan: string): boolean {
    return !!plan && plan !== 'FREE';
  }

  deactivateUser(id: number): void {
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open('User deactivated', 'Close', { duration: 3000 });
        this.loadUsers();
      }
    });
  }

  activateUser(id: number): void {
    this.apiService.activateUser(id).subscribe({
      next: () => {
        this.snackBar.open('User activated', 'Close', { duration: 3000 });
        this.loadUsers();
      }
    });
  }

  editUser(user: User): void {
    this.router.navigateByUrl(`/admin/users/edit/${user.id}`);
  }

  updateUserPlan(id: number, plan: string): void {
    this.apiService.updateUserPlan(id, plan).subscribe({
      next: () => {
        this.snackBar.open('User plan updated', 'Close', { duration: 3000 });
        this.loadUsers();
      }
    });
  }

  onPageChange(e: PageEvent): void { this.loadUsers(e.pageIndex); }
}

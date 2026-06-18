import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatInputModule, MatFormFieldModule, MatMenuModule,
    MatSnackBarModule, MatPaginatorModule],
  template: `
    <div class="admin-users">
      <div class="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all registered users</p>
        </div>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search users...</mat-label>
            <input matInput [(ngModel)]="searchQuery" (keyup.enter)="loadUsers()">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
        </div>
      </div>

      <div class="users-table-card">
        <table mat-table [dataSource]="users" class="users-table">
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>User</th>
            <td mat-cell *matCellDef="let u">
              <div class="user-cell">
                <div class="user-avatar">{{ u.firstName?.[0] }}{{ u.lastName?.[0] }}</div>
                <div>
                  <div class="user-name">{{ u.firstName }} {{ u.lastName }}</div>
                  <div class="user-email">{{ u.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let u">{{ u.username }}</td>
          </ng-container>
          <ng-container matColumnDef="plan">
            <th mat-header-cell *matHeaderCellDef>Plan</th>
            <td mat-cell *matCellDef="let u">
              <span class="plan-badge" [class]="u.subscriptionPlan?.toLowerCase()">{{ u.subscriptionPlan }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="xp">
            <th mat-header-cell *matHeaderCellDef>XP</th>
            <td mat-cell *matCellDef="let u">{{ u.totalXp | number }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let u">
              <span class="status-badge" [class.active]="u.active" [class.inactive]="!u.active">
                {{ u.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let u">
              <button mat-icon-button [matMenuTriggerFor]="userMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #userMenu="matMenu">
                <button mat-menu-item (click)="deactivateUser(u.id)">
                  <mat-icon>block</mat-icon> Deactivate
                </button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [length]="totalElements" [pageSize]="10" [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .admin-users { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
      h1 { font-size: 24px; font-weight: 800; margin: 0; color: var(--text-primary); }
      p { color: var(--text-secondary); margin: 4px 0 0; }
    }
    .search-field { width: 280px; }
    .users-table-card { background: var(--surface); border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .users-table { width: 100%; }
    .user-cell { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .user-name { font-weight: 600; font-size: 14px; color: var(--text-primary); }
    .user-email { font-size: 12px; color: var(--text-secondary); }
    .plan-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.free { background: var(--bg-secondary); color: var(--text-secondary); }
      &.basic { background: rgba(29,78,216,0.12); color: #1d4ed8; }
      &.pro { background: rgba(124,58,237,0.12); color: #7c3aed; }
      &.enterprise { background: rgba(217,119,6,0.12); color: #d97706; }
    }
    .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
      &.active { background: rgba(34,197,94,0.12); color: #16a34a; }
      &.inactive { background: rgba(220,38,38,0.12); color: #dc2626; }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['user', 'username', 'plan', 'xp', 'status', 'actions'];
  totalElements = 0;
  searchQuery = '';

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(page = 0): void {
    this.apiService.getAdminUsers(page).subscribe({
      next: (res) => {
        if (res.success) { this.users = res.data.content; this.totalElements = res.data.totalElements; }
      }
    });
  }

  deactivateUser(id: number): void {
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open('User deactivated', 'Close', { duration: 3000 });
        this.loadUsers();
      }
    });
  }

  onPageChange(e: PageEvent): void { this.loadUsers(e.pageIndex); }
}

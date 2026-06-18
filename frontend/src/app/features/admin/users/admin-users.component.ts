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
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
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

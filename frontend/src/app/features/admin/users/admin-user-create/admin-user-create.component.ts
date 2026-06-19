import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../../core/services/api.service';

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './admin-user-create.component.html',
  styleUrls: ['./admin-user-create.component.css']
})
export class AdminUserCreateComponent {
  isSaving = false;
  hidePassword = true;
  userForm: FormGroup;

  roleOptions: RoleOption[] = [
    { value: 'ROLE_STUDENT', label: 'Student', description: 'Standard learner access', icon: 'school' },
    { value: 'ROLE_INSTRUCTOR', label: 'Instructor', description: 'Can create and manage content', icon: 'cast_for_education' },
    { value: 'ROLE_ADMIN', label: 'Admin', description: 'Full administrative access', icon: 'admin_panel_settings' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_STUDENT', Validators.required]
    });
  }

  get initials(): string {
    const fn = this.userForm.value.firstName || '';
    const ln = this.userForm.value.lastName || '';
    return ((fn[0] || '') + (ln[0] || '')).toUpperCase();
  }

  selectRole(value: string): void {
    this.userForm.get('role')?.setValue(value);
  }

  error(field: string): string | null {
    const control = this.userForm.get(field);
    if (!control || !control.touched || !control.errors) return null;
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Enter a valid email address';
    if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    return null;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.apiService.createAdminUser(this.userForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.snackBar.open('User created', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/admin/users');
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open(err.error?.message || 'Failed to create user', 'Close', { duration: 4000, panelClass: 'error-snack' });
      }
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/users');
  }
}

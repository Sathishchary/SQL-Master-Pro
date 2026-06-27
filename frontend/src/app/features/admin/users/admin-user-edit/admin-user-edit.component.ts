import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/models';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.css']
})
export class AdminUserEditComponent implements OnInit {
  userId!: number;
  loading = true;
  saving = false;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      profilePicture: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getAdminUserById(this.userId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          const u = res.data;
          this.userForm.patchValue({
            profilePicture: u.profilePicture || '',
            firstName: u.firstName,
            lastName: u.lastName,
            username: u.username,
            email: u.email
          });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load user', 'Close', { duration: 4000 });
        this.router.navigateByUrl('/admin/users');
      }
    });
  }

  get initials(): string {
    const v = this.userForm.value;
    return ((v.firstName?.[0] || '') + (v.lastName?.[0] || '')).toUpperCase();
  }

  get previewUrl(): string {
    return this.userForm.value.profilePicture || '';
  }

  error(field: string): string | null {
    const control = this.userForm.get(field);
    if (!control || !control.touched || !control.errors) return null;
    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Enter a valid email address';
    return null;
  }

  save(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.apiService.updateAdminUser(this.userId, this.userForm.value).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('User updated', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/admin/users');
        }
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Failed to update user', 'Close', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/admin/users');
  }
}

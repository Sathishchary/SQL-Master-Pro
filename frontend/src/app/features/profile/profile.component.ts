import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

const XP_PER_LEVEL = 100;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isAdmin = this.authService.isAdmin;
  isSaving = signal(false);

  // Read-only account info
  username = signal('');
  email = signal('');
  subscriptionPlan = signal('');
  totalXp = signal(0);
  learningStreak = signal(0);
  joinedAt = signal('');

  // Editable fields
  firstName = signal('');
  lastName = signal('');
  profilePicture = signal('');
  phone = signal('');
  bio = signal('');

  userInitials = computed(() => (this.firstName()[0] || '') + (this.lastName()[0] || ''));
  canSave = computed(() => this.firstName().trim().length > 0 && this.lastName().trim().length > 0);

  level = computed(() => Math.floor(this.totalXp() / XP_PER_LEVEL) + 1);
  xpIntoLevel = computed(() => this.totalXp() % XP_PER_LEVEL);
  xpToNextLevel = computed(() => XP_PER_LEVEL - this.xpIntoLevel());
  levelProgress = computed(() => this.xpIntoLevel());

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const current = this.authService.currentUser();
    if (current) {
      this.username.set(current.username);
      this.email.set(current.email);
      this.firstName.set(current.firstName);
      this.lastName.set(current.lastName);
      this.profilePicture.set(current.profilePicture || '');
      this.subscriptionPlan.set(current.subscriptionPlan || '');
    }

    this.apiService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.firstName.set(res.data.firstName);
          this.lastName.set(res.data.lastName);
          this.bio.set(res.data.bio || '');
          this.phone.set(res.data.phone || '');
          this.profilePicture.set(res.data.profilePicture || '');
          this.totalXp.set(res.data.totalXp);
          this.learningStreak.set(res.data.learningStreak);
          this.joinedAt.set(res.data.createdAt);
        }
      }
    });
  }

  save(): void {
    if (!this.canSave()) return;
    this.isSaving.set(true);
    this.apiService.updateMyProfile({
      firstName: this.firstName(),
      lastName: this.lastName(),
      bio: this.bio(),
      phone: this.phone(),
      profilePicture: this.profilePicture()
    }).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        if (res.success) {
          this.authService.updateCurrentUser({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            profilePicture: res.data.profilePicture
          });
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.snackBar.open('Failed to update profile', 'Close', { duration: 4000, panelClass: 'error-snack' });
      }
    });
  }

  back(): void {
    this.router.navigateByUrl(this.isAdmin() ? '/admin' : '/dashboard');
  }
}

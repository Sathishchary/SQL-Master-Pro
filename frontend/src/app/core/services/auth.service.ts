import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'smp_access_token';
  private readonly REFRESH_KEY = 'smp_refresh_token';
  private readonly USER_KEY = 'smp_user';

  private _currentUser = signal<AuthResponse | null>(this.getStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.roles?.includes('ROLE_ADMIN') ?? false);
  readonly isPremium = computed(() => {
    const plan = this._currentUser()?.subscriptionPlan;
    return plan === 'PRO' || plan === 'ENTERPRISE' || plan === 'BASIC';
  });

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string; firstName: string; lastName: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(res => { if (res.success) this.storeAuth(res.data); })
    );
  }

  login(emailOrUsername: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, { emailOrUsername, password }).pipe(
      tap(res => { if (res.success) this.storeAuth(res.data); })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/auth/forgot-password?email=${email}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${environment.apiUrl}/auth/reset-password?token=${token}&newPassword=${newPassword}`, {});
  }

  verifyEmail(token: string): Observable<ApiResponse<void>> {
    return this.http.get<ApiResponse<void>>(`${environment.apiUrl}/auth/verify-email?token=${token}`);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/refresh-token?refreshToken=${refreshToken}`, {}).pipe(
      tap(res => { if (res.success) this.storeAuth(res.data); }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  updateCurrentUser(updates: Partial<AuthResponse>): void {
    const current = this._currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this._currentUser.set(updated);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
    }
  }

  private storeAuth(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);
    localStorage.setItem(this.REFRESH_KEY, auth.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
    this._currentUser.set(auth);
  }

  private getStoredUser(): AuthResponse | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/auth';
  private readonly TOKEN_KEY = 'blaze_token';
  private readonly USER_KEY = 'blaze_user';

  private currentUser$ = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  get user$(): Observable<AuthResponse | null> {
    return this.currentUser$.asObservable();
  }

  get currentUser(): AuthResponse | null {
    return this.currentUser$.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ROLE_ADMIN';
  }

  changePassword(currentPassword: string, newPassword: string): Observable<string> {
    return this.http.post(this.API + '/change-password',
      { currentPassword, newPassword },
      { responseType: 'text' }
    );
  }

  register(req: RegisterRequest): Observable<string> {
    return this.http.post(this.API + '/register', req, { responseType: 'text' });
  }

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API + '/login', req).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res));
        this.currentUser$.next(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  sendForgotPasswordOtp(email: string): Observable<string> {
    return this.http.post(this.API + '/forgot-password/send-otp', { email }, { responseType: 'text' });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<string> {
    return this.http.post(this.API + '/forgot-password/reset', { email, code, newPassword }, { responseType: 'text' });
  }

  private getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <ng-container>
    <section #loginSection class="min-h-screen flex items-center justify-center px-6 py-10 sm:py-20 bg-cream">
      <!-- Decorative side element -->
      <div class="hidden lg:flex flex-col justify-center items-end pr-16 max-w-md">
        <div #decoBlock>
          <p class="text-drama text-5xl text-moss leading-tight mb-4">
            Welcome<br />back<span class="text-clay">.</span>
          </p>
          <p class="font-heading text-sm text-charcoal/40 max-w-xs leading-relaxed">
            Sign in to your workspace. Your team is waiting.
          </p>
          <div class="flex items-center gap-3 mt-8">
            <div class="h-px w-12 bg-clay/40"></div>
            <span class="text-data text-charcoal/30 text-[10px] uppercase tracking-widest">Secure Auth</span>
          </div>
        </div>
      </div>

      <!-- Login Card -->
      <div #loginCard class="card-organic w-full max-w-md">
        <div class="mb-8">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <h2 class="font-heading text-3xl font-bold tracking-tighter-custom mt-6 mb-1">Sign In</h2>
          <p class="text-sm text-charcoal/50">Enter your credentials to access the workspace</p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm font-heading">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Username</label>
            <input type="text" [(ngModel)]="username" name="username" class="input-organic"
              placeholder="Enter your username" required />
          </div>

          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Password</label>
            <div class="relative">
              <input [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password" name="password"
                class="input-organic !pr-12"
                placeholder="Enter your password" required />
              <button type="button" (click)="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot password link -->
          <div class="flex justify-end">
            <button type="button" (click)="openForgotPassword()"
              class="text-xs text-clay font-heading font-semibold hover:underline">
              Forgot password?
            </button>
          </div>

          <button type="submit" [disabled]="loading" class="btn-primary w-full !py-4 mt-2">
            <span class="btn-slide"></span>
            <span class="btn-label">{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-charcoal/40">
            Don't have an account?
            <a routerLink="/register" class="text-clay font-semibold hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Forgot Password Modal ===== -->
    <div *ngIf="showForgotModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
      style="background: rgba(26,26,26,0.6); backdrop-filter: blur(6px);">
      <div class="card-organic w-full max-w-sm relative">

        <!-- Close -->
        <button (click)="closeForgotModal()"
          class="absolute top-4 right-4 text-charcoal/30 hover:text-charcoal/60 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Step 1: Enter email -->
        <div *ngIf="fpStep === 1">
          <h3 class="font-heading text-2xl font-bold tracking-tighter-custom mb-1">Reset Password</h3>
          <p class="text-sm text-charcoal/50 mb-6">Enter the email address on your account and we'll send you a 6-digit code.</p>

          <div *ngIf="fpError" class="mb-4 p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">{{ fpError }}</div>

          <div class="space-y-4">
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Email Address</label>
              <input type="email" [(ngModel)]="fpEmail" class="input-organic" placeholder="your@email.com" />
            </div>
            <button (click)="sendOtp()" [disabled]="fpLoading || !fpEmail"
              class="btn-primary w-full !py-3">
              <span class="btn-slide"></span>
              <span class="btn-label">{{ fpLoading ? 'Sending...' : 'Send Code' }}</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Enter OTP -->
        <div *ngIf="fpStep === 2">
          <h3 class="font-heading text-2xl font-bold tracking-tighter-custom mb-1">Enter Code</h3>
          <p class="text-sm text-charcoal/50 mb-6">
            We sent a 6-digit code to <span class="font-semibold text-charcoal">{{ fpEmail }}</span>. Check your inbox (and spam folder).
          </p>

          <div *ngIf="fpError" class="mb-4 p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">{{ fpError }}</div>

          <div class="space-y-4">
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">6-Digit Code</label>
              <input type="text" [(ngModel)]="fpCode" class="input-organic text-center tracking-[0.4em] font-mono text-lg"
                placeholder="000000" maxlength="6" />
            </div>
            <button (click)="verifyOtp()" [disabled]="fpLoading || fpCode.length !== 6"
              class="btn-primary w-full !py-3">
              <span class="btn-slide"></span>
              <span class="btn-label">{{ fpLoading ? 'Verifying...' : 'Verify Code' }}</span>
            </button>
            <button type="button" (click)="fpStep = 1; fpError = ''"
              class="w-full text-xs text-charcoal/40 hover:text-charcoal/60 font-heading transition-colors">
              ← Use a different email
            </button>
          </div>
        </div>

        <!-- Step 3: New password -->
        <div *ngIf="fpStep === 3">
          <h3 class="font-heading text-2xl font-bold tracking-tighter-custom mb-1">New Password</h3>
          <p class="text-sm text-charcoal/50 mb-6">Choose a strong new password for your account.</p>

          <div *ngIf="fpError" class="mb-4 p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">{{ fpError }}</div>
          <div *ngIf="fpSuccess" class="mb-4 p-3 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm">{{ fpSuccess }}</div>

          <div *ngIf="!fpSuccess" class="space-y-4">
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">New Password</label>
              <div class="relative">
                <input [type]="fpShowNew ? 'text' : 'password'" [(ngModel)]="fpNewPassword"
                  class="input-organic !pr-12" placeholder="At least 6 characters" />
                <button type="button" (click)="fpShowNew = !fpShowNew"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors">
                  <svg *ngIf="!fpShowNew" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="fpShowNew" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Confirm Password</label>
              <div class="relative">
                <input [type]="fpShowConfirm ? 'text' : 'password'" [(ngModel)]="fpConfirmPassword"
                  class="input-organic !pr-12"
                  [class.border-clay]="fpConfirmPassword && fpNewPassword !== fpConfirmPassword"
                  placeholder="Re-enter password" />
                <button type="button" (click)="fpShowConfirm = !fpShowConfirm"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors">
                  <svg *ngIf="!fpShowConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="fpShowConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="fpConfirmPassword && fpNewPassword !== fpConfirmPassword"
                 class="mt-1.5 text-[11px] text-clay font-heading">Passwords do not match</p>
            </div>
            <button (click)="submitReset()"
              [disabled]="fpLoading || fpNewPassword.length < 6 || fpNewPassword !== fpConfirmPassword"
              class="btn-primary w-full !py-3">
              <span class="btn-slide"></span>
              <span class="btn-label">{{ fpLoading ? 'Resetting...' : 'Reset Password' }}</span>
            </button>
          </div>
        </div>

        <!-- Step indicator -->
        <div class="flex justify-center gap-2 mt-6">
          <div *ngFor="let s of [1,2,3]" class="w-1.5 h-1.5 rounded-full transition-colors"
            [style.background]="fpStep === s ? '#CC5833' : 'rgba(26,26,26,0.15)'"></div>
        </div>
      </div>
    </div>
    </ng-container>
  `,
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loginSection', { static: true }) loginSection!: ElementRef;
  @ViewChild('loginCard', { static: true }) loginCard!: ElementRef;
  @ViewChild('decoBlock') decoBlock?: ElementRef;

  username = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  loading = false;

  // Forgot password state
  showForgotModal = false;
  fpStep = 1;
  fpEmail = '';
  fpCode = '';
  fpNewPassword = '';
  fpConfirmPassword = '';
  fpShowNew = false;
  fpShowConfirm = false;
  fpLoading = false;
  fpError = '';
  fpSuccess = '';

  private ctx!: gsap.Context;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.loginCard.nativeElement, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      if (this.decoBlock) {
        gsap.from(this.decoBlock.nativeElement, { x: -30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
      }
    }, this.loginSection.nativeElement);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([res.role === 'ROLE_ADMIN' ? '/admin' : '/workspace']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error || 'Login failed. Check your credentials or account status.';
      },
    });
  }

  openForgotPassword(): void {
    this.fpStep = 1; this.fpEmail = ''; this.fpCode = '';
    this.fpNewPassword = ''; this.fpConfirmPassword = '';
    this.fpError = ''; this.fpSuccess = '';
    this.showForgotModal = true;
  }

  closeForgotModal(): void { this.showForgotModal = false; }

  sendOtp(): void {
    this.fpError = '';
    this.fpLoading = true;
    this.authService.sendForgotPasswordOtp(this.fpEmail).subscribe({
      next: () => { this.fpLoading = false; this.fpStep = 2; },
      error: (err) => { this.fpLoading = false; this.fpError = err.error || 'Failed to send code. Check the email address.'; },
    });
  }

  verifyOtp(): void {
    // Just advance to step 3 — actual verification happens on submit
    this.fpStep = 3;
    this.fpError = '';
  }

  submitReset(): void {
    this.fpError = '';
    if (this.fpNewPassword !== this.fpConfirmPassword) { this.fpError = 'Passwords do not match.'; return; }
    if (this.fpNewPassword.length < 6) { this.fpError = 'Password must be at least 6 characters.'; return; }
    this.fpLoading = true;
    this.authService.resetPassword(this.fpEmail, this.fpCode, this.fpNewPassword).subscribe({
      next: () => {
        this.fpLoading = false;
        this.fpSuccess = 'Password reset successfully! You can now sign in with your new password.';
        setTimeout(() => this.closeForgotModal(), 2500);
      },
      error: (err) => { this.fpLoading = false; this.fpError = err.error || 'Reset failed. The code may be wrong or expired.'; },
    });
  }

  ngOnDestroy(): void { this.ctx?.revert(); }
}

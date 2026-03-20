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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section
      #registerSection
      class="min-h-screen flex items-center justify-center px-6 py-10 sm:py-20 bg-cream"
    >
      <!-- Decorative side element -->
      <div class="hidden lg:flex flex-col justify-center items-end pr-16 max-w-md">
        <div #decoBlock>
          <p class="text-drama text-5xl text-moss leading-tight mb-4">
            Join the<br />fire<span class="text-clay">.</span>
          </p>
          <p class="font-heading text-sm text-charcoal/40 max-w-xs leading-relaxed">
            Create your account. An admin will approve your access shortly.
          </p>
          <div class="flex items-center gap-3 mt-8">
            <div class="h-px w-12 bg-clay/40"></div>
            <span class="text-data text-charcoal/30 text-[10px] uppercase tracking-widest">
              Approval Required
            </span>
          </div>
        </div>
      </div>

      <!-- Register Card -->
      <div #registerCard class="card-organic w-full max-w-md">
        <div class="mb-8">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <h2 class="font-heading text-3xl font-bold tracking-tighter-custom mt-6 mb-1">
            Create Account
          </h2>
          <p class="text-sm text-charcoal/50">Register as a developer to get started</p>
        </div>

        <div *ngIf="successMessage" class="mb-6 p-4 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm font-heading">
          {{ successMessage }}
          <a routerLink="/login" class="block mt-2 text-clay font-semibold hover:underline">Go to Sign In &rarr;</a>
        </div>
        <div *ngIf="errorMessage" class="mb-6 p-4 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm font-heading">
          {{ errorMessage }}
        </div>

        <form *ngIf="!successMessage" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Username -->
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Username</label>
            <input type="text" [(ngModel)]="username" name="username" class="input-organic"
              placeholder="Choose a username" required />
          </div>

          <!-- Email -->
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Email</label>
            <input type="email" [(ngModel)]="email" name="email" class="input-organic"
              placeholder="your@email.com" required />
          </div>

          <!-- Password -->
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Password</label>
            <div class="relative">
              <input [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password" name="password"
                class="input-organic !pr-12"
                placeholder="Create a password" required />
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

          <!-- Confirm Password -->
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Confirm Password</label>
            <div class="relative">
              <input [type]="showConfirm ? 'text' : 'password'"
                [(ngModel)]="confirmPassword" name="confirmPassword"
                class="input-organic !pr-12"
                [class.border-clay]="confirmPassword && password !== confirmPassword"
                placeholder="Re-enter your password" required />
              <button type="button" (click)="showConfirm = !showConfirm"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/70 transition-colors">
                <svg *ngIf="!showConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg *ngIf="showConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p *ngIf="confirmPassword && password !== confirmPassword"
               class="mt-1.5 text-[11px] text-clay font-heading">Passwords do not match</p>
          </div>

          <button type="submit" [disabled]="loading || (!!confirmPassword && password !== confirmPassword)"
            class="btn-secondary w-full !py-4 mt-2">
            <span class="btn-slide"></span>
            <span class="btn-label">{{ loading ? 'Creating Account...' : 'Register' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-charcoal/40">
            Already have an account?
            <a routerLink="/login" class="text-clay font-semibold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('registerSection', { static: true }) registerSection!: ElementRef;
  @ViewChild('registerCard', { static: true }) registerCard!: ElementRef;
  @ViewChild('decoBlock') decoBlock?: ElementRef;

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  private ctx!: gsap.Context;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.registerCard.nativeElement, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      if (this.decoBlock) {
        gsap.from(this.decoBlock.nativeElement, { x: -30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
      }
    }, this.registerSection.nativeElement);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    this.loading = true;
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (msg) => { this.loading = false; this.successMessage = msg; },
      error: (err) => { this.loading = false; this.errorMessage = err.error?.message || err.error || 'Registration failed. Try again.'; },
    });
  }

  ngOnDestroy(): void { this.ctx?.revert(); }
}

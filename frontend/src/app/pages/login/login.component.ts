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
    <section
      #loginSection
      class="min-h-screen flex items-center justify-center px-6 py-20 bg-cream"
    >
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
            <span class="text-data text-charcoal/30 text-[10px] uppercase tracking-widest">
              Secure Auth
            </span>
          </div>
        </div>
      </div>

      <!-- Login Card -->
      <div
        #loginCard
        class="card-organic w-full max-w-md"
      >
        <div class="mb-8">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <h2 class="font-heading text-3xl font-bold tracking-tighter-custom mt-6 mb-1">
            Sign In
          </h2>
          <p class="text-sm text-charcoal/50">
            Enter your credentials to access the workspace
          </p>
        </div>

        <!-- Error Message -->
        <div
          *ngIf="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm font-heading"
        >
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Username
            </label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              class="input-organic"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Password
            </label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="input-organic"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="btn-primary w-full !py-4 mt-2"
          >
            <span class="btn-slide"></span>
            <span class="btn-label">
              {{ loading ? 'Authenticating...' : 'Sign In' }}
            </span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-charcoal/40">
            Don't have an account?
            <a routerLink="/register" class="text-clay font-semibold hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loginSection', { static: true }) loginSection!: ElementRef;
  @ViewChild('loginCard', { static: true }) loginCard!: ElementRef;
  @ViewChild('decoBlock') decoBlock?: ElementRef;

  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  private ctx!: gsap.Context;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.loginCard.nativeElement, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
      if (this.decoBlock) {
        gsap.from(this.decoBlock.nativeElement, {
          x: -30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.4,
        });
      }
    }, this.loginSection.nativeElement);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/workspace']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || err.error || 'Login failed. Check your credentials or account status.';
      },
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

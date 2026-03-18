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
      class="min-h-screen flex items-center justify-center px-6 py-20 bg-cream"
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
      <div
        #registerCard
        class="card-organic w-full max-w-md"
      >
        <div class="mb-8">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <h2 class="font-heading text-3xl font-bold tracking-tighter-custom mt-6 mb-1">
            Create Account
          </h2>
          <p class="text-sm text-charcoal/50">
            Register as a developer to get started
          </p>
        </div>

        <!-- Success Message -->
        <div
          *ngIf="successMessage"
          class="mb-6 p-4 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm font-heading"
        >
          {{ successMessage }}
          <a routerLink="/login" class="block mt-2 text-clay font-semibold hover:underline">
            Go to Sign In &rarr;
          </a>
        </div>

        <!-- Error Message -->
        <div
          *ngIf="errorMessage"
          class="mb-6 p-4 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm font-heading"
        >
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form *ngIf="!successMessage" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Username
            </label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              class="input-organic"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="input-organic"
              placeholder="your@email.com"
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
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="loading"
            class="btn-secondary w-full !py-4 mt-2"
          >
            <span class="btn-slide"></span>
            <span class="btn-label">
              {{ loading ? 'Creating Account...' : 'Register' }}
            </span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-charcoal/40">
            Already have an account?
            <a routerLink="/login" class="text-clay font-semibold hover:underline">
              Sign In
            </a>
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
  errorMessage = '';
  successMessage = '';
  loading = false;

  private ctx!: gsap.Context;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.registerCard.nativeElement, {
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
    }, this.registerSection.nativeElement);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.authService
      .register({ username: this.username, email: this.email, password: this.password })
      .subscribe({
        next: (msg) => {
          this.loading = false;
          this.successMessage = msg;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err.error?.message || err.error || 'Registration failed. Try again.';
        },
      });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

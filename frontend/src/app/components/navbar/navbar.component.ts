import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  HostListener,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <nav
      #navBar
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[100]
             flex items-center gap-1 px-3 py-2
             rounded-full border
             transition-all duration-500 ease-magnetic"
      [class]="scrolled
        ? 'bg-cream/70 backdrop-blur-xl border-charcoal/10 shadow-organic'
        : 'bg-charcoal/90 backdrop-blur-md border-cream/20 shadow-lg'"
    >
      <!-- Brand -->
      <a
        (click)="onBrandClick()"
        class="flex items-center gap-1.5 px-5 py-2 rounded-full cursor-pointer
               font-heading font-extrabold text-xl tracking-tighter-custom
               transition-colors duration-300"
        [class]="scrolled ? 'text-charcoal' : 'text-cream'"
      >
        Blaze<span class="text-clay">.</span>
      </a>

      <!-- Divider -->
      <div
        class="w-px h-6 mx-2 transition-colors duration-300"
        [class]="scrolled ? 'bg-charcoal/15' : 'bg-cream/30'"
      ></div>

      <!-- Logged-out: nav links + sign in -->
      <ng-container *ngIf="!isLoggedIn">
        <a
          routerLink="/login"
          class="btn-magnetic ml-2 !px-6 !py-2 !text-sm bg-clay text-cream"
        >
          <span class="btn-slide bg-clay-dark"></span>
          <span class="btn-label">Sign In</span>
        </a>
      </ng-container>

      <!-- Logged-in: profile dropdown -->
      <ng-container *ngIf="isLoggedIn">
        <a
          routerLink="/workspace"
          routerLinkActive="!text-clay"
          class="hidden sm:block px-5 py-2 rounded-full text-base font-heading font-semibold
                 transition-all duration-300 ease-magnetic"
          [class]="scrolled
            ? 'text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5'
            : 'text-cream hover:text-cream/80 hover:bg-cream/10'"
        >
          Workspace
        </a>
        <a
          *ngIf="isAdmin"
          routerLink="/admin"
          routerLinkActive="!text-clay"
          class="hidden sm:block px-5 py-2 rounded-full text-base font-heading font-semibold
                 transition-all duration-300 ease-magnetic"
          [class]="scrolled
            ? 'text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5'
            : 'text-cream hover:text-cream/80 hover:bg-cream/10'"
        >
          Admin
        </a>

        <!-- Profile button -->
        <div class="relative ml-2" #dropdownRef>
          <button
            (click)="toggleDropdown()"
            class="flex items-center gap-2 px-4 py-2 rounded-full
                   transition-all duration-300 ease-magnetic"
            [class]="scrolled ? 'text-charcoal hover:bg-charcoal/5' : 'text-cream hover:bg-cream/10'"
          >
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full bg-clay flex items-center justify-center
                        font-heading font-bold text-cream text-sm">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <span class="hidden sm:block text-base font-heading font-semibold max-w-[100px] truncate">{{ username }}</span>
            <!-- Chevron -->
            <svg class="w-3 h-3 transition-transform duration-200"
                 [class.rotate-180]="dropdownOpen"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            *ngIf="dropdownOpen"
            class="absolute right-0 top-full mt-2 w-48 rounded-2xl border
                   bg-cream border-charcoal/10 shadow-organic overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-charcoal/5">
              <p class="text-xs font-heading font-bold text-charcoal">{{ username }}</p>
              <p class="text-[10px] text-data text-charcoal/40 uppercase tracking-widest mt-0.5">
                {{ isAdmin ? 'Administrator' : 'Developer' }}
              </p>
            </div>
            <div class="py-1">
              <a
                routerLink="/workspace"
                (click)="dropdownOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-heading
                       text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5
                       transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Workspace
              </a>
              <a
                *ngIf="isAdmin"
                routerLink="/admin"
                (click)="dropdownOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-heading
                       text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5
                       transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Admin Panel
              </a>
              <button
                (click)="openChangePassword()"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading
                       text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5
                       transition-colors text-left"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                Change Password
              </button>
              <div class="border-t border-charcoal/5 mt-1 pt-1">
                <button
                  (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading
                         text-clay hover:bg-clay/5 transition-colors text-left"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </nav>

    <!-- Change Password Modal -->
    <div
      *ngIf="showChangePassword"
      class="fixed inset-0 z-[200] flex items-center justify-center"
    >
      <div (click)="closeChangePassword()" class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"></div>
      <div class="relative z-10 card-organic w-full max-w-md mx-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-heading text-2xl font-bold tracking-tighter-custom">
            Change Password
          </h2>
          <button (click)="closeChangePassword()" class="text-charcoal/30 hover:text-charcoal text-2xl leading-none">&times;</button>
        </div>

        <form (ngSubmit)="submitChangePassword()" class="space-y-4">
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Current Password
            </label>
            <input
              type="password"
              [(ngModel)]="cpCurrent"
              name="cpCurrent"
              class="input-organic"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              New Password
            </label>
            <input
              type="password"
              [(ngModel)]="cpNew"
              name="cpNew"
              class="input-organic"
              placeholder="Enter new password"
              required
              minlength="6"
            />
          </div>
          <div>
            <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
              Confirm New Password
            </label>
            <input
              type="password"
              [(ngModel)]="cpConfirm"
              name="cpConfirm"
              class="input-organic"
              placeholder="Confirm new password"
              required
            />
          </div>

          <div *ngIf="cpError" class="p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">
            {{ cpError }}
          </div>
          <div *ngIf="cpSuccess" class="p-3 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm">
            {{ cpSuccess }}
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <button type="button" (click)="closeChangePassword()" class="btn-ghost !px-6">
              <span class="btn-slide"></span>
              <span class="btn-label">Cancel</span>
            </button>
            <button type="submit" [disabled]="cpSaving" class="btn-primary !px-6">
              <span class="btn-slide"></span>
              <span class="btn-label">{{ cpSaving ? 'Saving...' : 'Update Password' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navBar', { static: true }) navBar!: ElementRef<HTMLElement>;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLElement>;

  scrolled = false;
  dropdownOpen = false;
  showChangePassword = false;

  cpCurrent = '';
  cpNew = '';
  cpConfirm = '';
  cpError = '';
  cpSuccess = '';
  cpSaving = false;

  private scrollHandler!: () => void;
  private ctx!: gsap.Context;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  onBrandClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/workspace']);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (this.router.url !== '/') {
        this.router.navigate(['/']);
      }
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get username(): string {
    return this.authService.currentUser?.username ?? '';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.navBar.nativeElement, {
        y: -40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
    });

    this.ngZone.runOutsideAngular(() => {
      this.scrollHandler = () => {
        const past = window.scrollY > 50;
        if (past !== this.scrolled) {
          this.ngZone.run(() => { this.scrolled = past; });
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  openChangePassword(): void {
    this.dropdownOpen = false;
    this.cpCurrent = '';
    this.cpNew = '';
    this.cpConfirm = '';
    this.cpError = '';
    this.cpSuccess = '';
    this.showChangePassword = true;
  }

  closeChangePassword(): void {
    this.showChangePassword = false;
  }

  submitChangePassword(): void {
    this.cpError = '';
    this.cpSuccess = '';

    if (this.cpNew !== this.cpConfirm) {
      this.cpError = 'New passwords do not match.';
      return;
    }
    if (this.cpNew.length < 6) {
      this.cpError = 'New password must be at least 6 characters.';
      return;
    }

    this.cpSaving = true;
    this.authService.changePassword(this.cpCurrent, this.cpNew).subscribe({
      next: () => {
        this.cpSaving = false;
        this.cpSuccess = 'Password updated successfully!';
        setTimeout(() => this.closeChangePassword(), 1500);
      },
      error: (err) => {
        this.cpSaving = false;
        this.cpError = err.error || 'Failed to change password.';
      },
    });
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    window.removeEventListener('scroll', this.scrollHandler);
  }
}

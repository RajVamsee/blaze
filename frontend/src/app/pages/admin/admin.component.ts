import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, ManagedUser } from '../../services/admin.service';
import gsap from 'gsap';

type StatusTab = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div #adminSection class="min-h-screen bg-cream">

      <!-- Top Bar -->
      <header class="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a (click)="scrollToTop()" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal cursor-pointer">
            Blaze<span class="text-clay">.</span>
          </a>
          <div class="flex items-center gap-3">
            <a routerLink="/workspace"
               class="text-sm font-heading text-charcoal/50 hover:text-charcoal transition-colors">
              Workspace
            </a>
            <!-- Profile dropdown -->
            <div class="relative" #adminDropdownRef>
              <button (click)="toggleDropdown()"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-charcoal/5 transition-colors">
                <div class="w-7 h-7 rounded-full bg-clay flex items-center justify-center font-heading font-bold text-cream text-xs">
                  {{ authService.currentUser?.username?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="hidden sm:block text-sm font-heading font-medium text-charcoal max-w-[80px] truncate">{{ authService.currentUser?.username }}</span>
                <svg class="w-3 h-3 text-charcoal/40 transition-transform duration-200"
                     [class.rotate-180]="dropdownOpen"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="dropdownOpen"
                class="absolute right-0 top-full mt-2 w-48 rounded-2xl border bg-cream border-charcoal/10 shadow-organic overflow-hidden">
                <div class="px-4 py-3 border-b border-charcoal/5">
                  <p class="text-xs font-heading font-bold text-charcoal">{{ authService.currentUser?.username }}</p>
                  <p class="text-[10px] text-data text-charcoal/40 uppercase tracking-widest mt-0.5">Administrator</p>
                </div>
                <div class="py-1">
                  <a routerLink="/workspace" (click)="dropdownOpen=false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Workspace
                  </a>
                  <button (click)="openChangePassword()"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors text-left">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                    </svg>
                    Change Password
                  </button>
                  <div class="border-t border-charcoal/5 mt-1 pt-1">
                    <button (click)="authService.logout()"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-clay hover:bg-clay/5 transition-colors text-left">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-5xl mx-auto px-6 py-10">

        <!-- Page Header -->
        <div class="mb-8">
          <span class="text-data text-clay uppercase tracking-widest text-[10px] mb-2 block">Admin Panel</span>
          <h1 class="font-heading text-3xl sm:text-4xl font-extrabold tracking-tighter-custom mb-2">
            User Management<span class="text-clay">.</span>
          </h1>
          <p class="text-sm text-charcoal/50">Manage user registrations and access permissions</p>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div class="card-organic !p-4 text-center">
            <p class="font-heading text-3xl font-bold text-charcoal">{{ allUsers.length }}</p>
            <p class="text-data text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">Total</p>
          </div>
          <div class="card-organic !p-4 text-center">
            <p class="font-heading text-3xl font-bold text-amber-600">{{ countByStatus('PENDING') }}</p>
            <p class="text-data text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div class="card-organic !p-4 text-center">
            <p class="font-heading text-3xl font-bold text-moss">{{ countByStatus('APPROVED') }}</p>
            <p class="text-data text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">Approved</p>
          </div>
          <div class="card-organic !p-4 text-center">
            <p class="font-heading text-3xl font-bold text-clay">{{ countByStatus('REJECTED') }}</p>
            <p class="text-data text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">Rejected</p>
          </div>
        </div>

        <!-- Tabs + Refresh -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div class="flex flex-wrap gap-1 p-1 rounded-2xl bg-charcoal/5">
            <button *ngFor="let tab of tabs"
              (click)="activeTab = tab"
              class="px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all duration-200"
              [class]="activeTab === tab
                ? 'bg-charcoal text-cream'
                : 'text-charcoal/50 hover:text-charcoal'">
              {{ tab | titlecase }}
              <span *ngIf="tab !== 'ALL'" class="ml-1 opacity-60">({{ countByStatus(tab) }})</span>
            </button>
          </div>
          <button (click)="loadUsers()" class="btn-ghost !px-4 !py-2 !text-xs">
            <span class="btn-slide"></span>
            <span class="btn-label">Refresh</span>
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin"></div>
          <p class="text-data text-charcoal/40 mt-4 text-xs">Loading users...</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && filteredUsers.length === 0" class="text-center py-20">
          <p class="text-drama text-3xl text-charcoal/20 mb-2">All clear</p>
          <p class="text-sm text-charcoal/40">No users in this category.</p>
        </div>

        <!-- User List -->
        <div *ngIf="!loading && filteredUsers.length > 0" class="space-y-4">
          <div *ngFor="let user of filteredUsers"
            class="card-organic flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center font-heading font-bold text-moss text-sm">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-heading font-bold text-base">{{ user.username }}</h3>
                  <p class="text-data text-[10px] text-charcoal/50">{{ user.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 mt-2 ml-[52px]">
                <span class="text-data text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                  [class]="statusBadge(user.status)">
                  {{ user.status }}
                </span>
                <span class="text-data text-[10px] text-charcoal/40">
                  Registered {{ user.createdAt | date:'MMM d, y' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 sm:flex-shrink-0">
              <button *ngIf="user.status === 'PENDING' || user.status === 'REJECTED'"
                (click)="approve(user)"
                [disabled]="user['_acting']"
                class="btn-primary !px-4 !py-2 !text-xs">
                <span class="btn-slide"></span>
                <span class="btn-label">{{ user['_acting'] ? '...' : 'Approve' }}</span>
              </button>
              <button *ngIf="user.status === 'PENDING' || user.status === 'APPROVED'"
                (click)="reject(user)"
                [disabled]="user['_acting']"
                class="btn-ghost !px-4 !py-2 !text-xs !text-clay">
                <span class="btn-slide !bg-clay/10"></span>
                <span class="btn-label">{{ user['_acting'] ? '...' : 'Reject' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div *ngIf="showChangePassword" class="fixed inset-0 z-[200] flex items-center justify-center">
        <div (click)="closeChangePassword()" class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"></div>
        <div class="relative z-10 card-organic w-full max-w-md mx-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-heading text-2xl font-bold tracking-tighter-custom">Change Password</h2>
            <button (click)="closeChangePassword()" class="text-charcoal/30 hover:text-charcoal text-2xl leading-none">&times;</button>
          </div>
          <form (ngSubmit)="submitChangePassword()" class="space-y-4">
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Current Password</label>
              <input type="password" [(ngModel)]="cpCurrent" name="cpCurrent" class="input-organic" placeholder="Enter current password" required />
            </div>
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">New Password</label>
              <input type="password" [(ngModel)]="cpNew" name="cpNew" class="input-organic" placeholder="Enter new password" required minlength="6" />
            </div>
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Confirm New Password</label>
              <input type="password" [(ngModel)]="cpConfirm" name="cpConfirm" class="input-organic" placeholder="Confirm new password" required />
            </div>
            <div *ngIf="cpError" class="p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">{{ cpError }}</div>
            <div *ngIf="cpSuccess" class="p-3 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm">{{ cpSuccess }}</div>
            <div class="flex gap-3 justify-end pt-2">
              <button type="button" (click)="closeChangePassword()" class="btn-ghost !px-6"><span class="btn-slide"></span><span class="btn-label">Cancel</span></button>
              <button type="submit" [disabled]="cpSaving" class="btn-primary !px-6"><span class="btn-slide"></span><span class="btn-label">{{ cpSaving ? 'Saving...' : 'Update Password' }}</span></button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toastMessage"
        class="fixed bottom-8 right-8 z-[300] card-organic !p-4 shadow-organic-lg max-w-sm"
        [class]="toastType === 'success' ? '!bg-moss !text-cream !border-moss-dark/30' : '!bg-clay !text-cream !border-clay-dark/30'">
        <p class="text-sm font-heading">{{ toastMessage }}</p>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('adminSection', { static: true }) adminSection!: ElementRef;
  @ViewChild('adminDropdownRef') adminDropdownRef!: ElementRef<HTMLElement>;

  allUsers: (ManagedUser & { [key: string]: any })[] = [];
  loading = true;
  dropdownOpen = false;
  activeTab: StatusTab = 'ALL';
  tabs: StatusTab[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  showChangePassword = false;
  cpCurrent = '';
  cpNew = '';
  cpConfirm = '';
  cpError = '';
  cpSuccess = '';
  cpSaving = false;

  private ctx!: gsap.Context;

  constructor(
    public authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {}, this.adminSection.nativeElement);
  }

  get filteredUsers() {
    if (this.activeTab === 'ALL') return this.allUsers;
    return this.allUsers.filter(u => u.status === this.activeTab);
  }

  countByStatus(status: string): number {
    return this.allUsers.filter(u => u.status === status).length;
  }

  statusBadge(status: string): string {
    switch (status) {
      case 'PENDING':  return 'bg-amber-100 text-amber-700';
      case 'APPROVED': return 'bg-moss/10 text-moss';
      case 'REJECTED': return 'bg-clay/10 text-clay';
      default:         return 'bg-charcoal/10 text-charcoal';
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  approve(user: ManagedUser & { [key: string]: any }): void {
    user['_acting'] = true;
    this.adminService.approveUser(user.id).subscribe({
      next: (msg) => {
        user.status = 'APPROVED';
        user['_acting'] = false;
        this.showToast(msg, 'success');
      },
      error: () => {
        user['_acting'] = false;
        this.showToast('Failed to approve user.', 'error');
      },
    });
  }

  reject(user: ManagedUser & { [key: string]: any }): void {
    user['_acting'] = true;
    this.adminService.rejectUser(user.id).subscribe({
      next: (msg) => {
        user.status = 'REJECTED';
        user['_acting'] = false;
        this.showToast(msg, 'success');
      },
      error: () => {
        user['_acting'] = false;
        this.showToast('Failed to reject user.', 'error');
      },
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.adminDropdownRef && !this.adminDropdownRef.nativeElement.contains(event.target as Node)) {
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
    if (this.cpNew !== this.cpConfirm) { this.cpError = 'New passwords do not match.'; return; }
    if (this.cpNew.length < 6) { this.cpError = 'Password must be at least 6 characters.'; return; }
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

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMessage = msg;
    this.toastType = type;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => { this.toastMessage = ''; }, 3000);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    clearTimeout(this.toastTimeout);
  }
}

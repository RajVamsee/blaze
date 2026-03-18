import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, PendingUser } from '../../services/admin.service';
import gsap from 'gsap';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div #adminSection class="min-h-screen bg-cream">
      <!-- Top Bar -->
      <header
        class="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5"
      >
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <div class="flex items-center gap-4">
            <a
              routerLink="/workspace"
              class="text-sm text-charcoal/50 hover:text-charcoal font-heading transition-colors"
            >
              Workspace
            </a>
            <span class="text-data text-[10px] px-2 py-0.5 rounded-full bg-clay/10 text-clay uppercase tracking-widest">
              Admin
            </span>
            <button
              (click)="authService.logout()"
              class="btn-magnetic !px-4 !py-1.5 !text-xs bg-charcoal/5 text-charcoal"
            >
              <span class="btn-slide bg-charcoal/10"></span>
              <span class="btn-label">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-5xl mx-auto px-6 py-10">
        <!-- Page Header -->
        <div class="mb-10">
          <span class="text-data text-clay uppercase tracking-widest text-[10px] mb-2 block">
            Admin Panel
          </span>
          <h1 class="font-heading text-4xl font-extrabold tracking-tighter-custom mb-2">
            Pending Approvals<span class="text-clay">.</span>
          </h1>
          <p class="text-sm text-charcoal/50">
            Review and approve new user registrations
          </p>
        </div>

        <!-- Refresh -->
        <div class="flex justify-end mb-6">
          <button (click)="loadPending()" class="btn-ghost !px-4 !py-2 !text-xs">
            <span class="btn-slide"></span>
            <span class="btn-label">Refresh</span>
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin"></div>
          <p class="text-data text-charcoal/40 mt-4 text-xs">Loading pending users...</p>
        </div>

        <!-- Empty -->
        <div
          *ngIf="!loading && pendingUsers.length === 0"
          class="text-center py-20"
        >
          <p class="text-drama text-3xl text-charcoal/20 mb-4">All clear</p>
          <p class="text-sm text-charcoal/40">
            No pending registrations at this time.
          </p>
        </div>

        <!-- User Table -->
        <div
          *ngIf="!loading && pendingUsers.length > 0"
          class="space-y-4"
        >
          <div
            *ngFor="let user of pendingUsers"
            class="card-organic flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <!-- Avatar circle -->
                <div
                  class="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center
                         font-heading font-bold text-moss text-sm"
                >
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-heading font-bold text-base">
                    {{ user.username }}
                  </h3>
                  <p class="text-data text-[10px] text-charcoal/40">
                    {{ user.email }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 mt-2 ml-[52px]">
                <span
                  class="text-data text-[10px] px-2 py-0.5 rounded-full
                         bg-amber-100 text-amber-700 uppercase tracking-widest"
                >
                  {{ user.status }}
                </span>
                <span class="text-data text-[10px] text-charcoal/30">
                  Registered {{ user.createdAt | date:'MMM d, y' }}
                </span>
              </div>
            </div>

            <div class="flex gap-3 sm:flex-shrink-0">
              <button
                (click)="approve(user)"
                [disabled]="user.status === 'APPROVING'"
                class="btn-primary !px-5 !py-2 !text-xs"
              >
                <span class="btn-slide"></span>
                <span class="btn-label">
                  {{ user.status === 'APPROVING' ? 'Approving...' : 'Approve' }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Success Toast -->
        <div
          *ngIf="successMessage"
          class="fixed bottom-8 right-8 z-[300] card-organic !bg-moss !text-cream
                 !border-moss-dark/30 !p-4 shadow-organic-lg max-w-sm"
        >
          <p class="text-sm font-heading">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('adminSection', { static: true }) adminSection!: ElementRef;

  pendingUsers: (PendingUser & { status: string })[] = [];
  loading = true;
  successMessage = '';

  private ctx!: gsap.Context;
  private toastTimeout: any;

  constructor(
    public authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadPending();
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {}, this.adminSection.nativeElement);
  }

  loadPending(): void {
    this.loading = true;
    this.adminService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  approve(user: PendingUser & { status: string }): void {
    user.status = 'APPROVING';
    this.adminService.approveUser(user.id).subscribe({
      next: (msg) => {
        this.showToast(msg);
        this.pendingUsers = this.pendingUsers.filter((u) => u.id !== user.id);
      },
      error: () => {
        user.status = 'PENDING';
      },
    });
  }

  private showToast(msg: string): void {
    this.successMessage = msg;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    clearTimeout(this.toastTimeout);
  }
}

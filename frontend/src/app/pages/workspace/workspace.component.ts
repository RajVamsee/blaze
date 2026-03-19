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
import {
  DocumentService,
  DocumentRequest,
  DocumentResponse,
  DocumentPermissionResponse,
} from '../../services/document.service';
import gsap from 'gsap';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div #workspaceSection class="min-h-screen bg-cream">

      <!-- Top Bar -->
      <header class="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a (click)="scrollToTop()" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal cursor-pointer">
            Blaze<span class="text-clay">.</span>
          </a>
          <div class="flex items-center gap-3">
            <a *ngIf="authService.isAdmin" routerLink="/admin"
               class="text-sm font-heading text-charcoal/50 hover:text-charcoal transition-colors">
              Admin Panel
            </a>
            <div class="relative" #wsDropdownRef>
              <button (click)="toggleDropdown()"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-charcoal/5 transition-colors">
                <div class="w-7 h-7 rounded-full bg-clay flex items-center justify-center font-heading font-bold text-cream text-xs">
                  {{ authService.currentUser?.username?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="text-sm font-heading font-medium text-charcoal">{{ authService.currentUser?.username }}</span>
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
                  <p class="text-[10px] text-data text-charcoal/40 uppercase tracking-widest mt-0.5">
                    {{ authService.isAdmin ? 'Administrator' : 'Developer' }}
                  </p>
                </div>
                <div class="py-1">
                  <a *ngIf="authService.isAdmin" routerLink="/admin" (click)="dropdownOpen=false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Admin Panel
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

      <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- Page Header -->
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="text-data text-clay uppercase tracking-widest text-[10px] mb-2 block">Workspace</span>
            <h1 class="font-heading text-4xl font-extrabold tracking-tighter-custom">
              Documents<span class="text-clay">.</span>
            </h1>
          </div>
          <button (click)="openCreateModal()" class="btn-primary !px-6 !py-3">
            <span class="btn-slide"></span>
            <span class="btn-label">+ New Document</span>
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loadingDocs" class="text-center py-20">
          <div class="inline-block w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin"></div>
          <p class="text-data text-charcoal/40 mt-4 text-xs">Loading documents...</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loadingDocs && documents.length === 0" class="text-center py-20">
          <p class="text-drama text-3xl text-charcoal/20 mb-4">No documents yet</p>
          <p class="text-sm text-charcoal/40 mb-6">Create your first document to get started.</p>
          <button (click)="openCreateModal()" class="btn-secondary">
            <span class="btn-slide"></span>
            <span class="btn-label">Create First Document</span>
          </button>
        </div>

        <!-- Document Grid -->
        <div *ngIf="!loadingDocs && documents.length > 0"
             class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let doc of documents"
               class="card-organic group cursor-pointer flex flex-col"
               (click)="openDocModal(doc)">
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-heading text-lg font-bold tracking-tighter-custom group-hover:text-clay transition-colors leading-snug">
                {{ doc.title }}
              </h3>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span *ngIf="!doc.canEdit"
                  class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-charcoal/5 text-charcoal/40 border border-charcoal/10 whitespace-nowrap">
                  View Only
                </span>
                <button *ngIf="doc.owner || authService.isAdmin"
                  (click)="deleteDoc(doc.id, $event)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity text-charcoal/30 hover:text-clay text-lg leading-none px-1"
                  title="Delete">&times;</button>
              </div>
            </div>
            <p class="text-sm text-charcoal/50 leading-relaxed line-clamp-3 mb-5 flex-1">
              {{ doc.content || 'Empty document' }}
            </p>
            <div class="pt-3 border-t border-charcoal/8 flex items-center gap-2 text-[11px] font-semibold text-charcoal/65">
              <span>by <strong class="font-extrabold text-charcoal/80">{{ doc.authorUsername }}</strong></span>
              <span class="w-1 h-1 rounded-full bg-charcoal/40 shrink-0"></span>
              <span class="text-charcoal/70 font-semibold">{{ doc.createdAt | date:'MMM d, y · h:mm a' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Change Password Modal ─── -->
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

      <!-- ─── Document Modal ─── -->
      <div *ngIf="showModal" class="fixed inset-0 z-[200] flex items-center justify-center">
        <div (click)="closeModal()" class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"></div>

        <div #modalCard class="relative z-10 card-organic w-full max-w-lg mx-6 max-h-[85vh] overflow-y-auto">

          <!-- Header -->
          <div class="flex items-start justify-between mb-5">
            <div>
              <h2 class="font-heading text-2xl font-bold tracking-tighter-custom">
                {{ !editingDoc ? 'New Document' : (editingDoc.canEdit ? 'Edit Document' : editingDoc.title) }}
              </h2>
              <div *ngIf="editingDoc" class="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span class="text-[11px] font-semibold text-charcoal/60">
                  by <strong class="font-extrabold text-charcoal/80">{{ editingDoc.authorUsername }}</strong>
                </span>
                <span class="w-1 h-1 rounded-full bg-charcoal/30"></span>
                <span class="text-[11px] font-semibold text-charcoal/70">
                  {{ editingDoc.updatedAt | date:'MMM d, y · h:mm a' }}
                </span>
              </div>
            </div>
            <button (click)="closeModal()" class="text-charcoal/30 hover:text-charcoal text-2xl leading-none shrink-0 ml-4">&times;</button>
          </div>

          <!-- ── VIEW-ONLY MODE ── -->
          <ng-container *ngIf="editingDoc && !editingDoc.canEdit">
            <div class="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-charcoal/5 border border-charcoal/10">
              <svg class="w-3.5 h-3.5 text-charcoal/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span class="text-[11px] font-heading font-bold text-charcoal/50 uppercase tracking-widest">Read-only — you do not have edit access</span>
            </div>

            <div class="p-4 rounded-2xl bg-charcoal/5 border border-charcoal/10 min-h-[150px] text-sm text-charcoal/75 leading-relaxed whitespace-pre-wrap mb-5">
              {{ editingDoc.content || 'No content.' }}
            </div>

            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div *ngIf="editingDoc.permissionStatus === 'PENDING'"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-heading font-medium">
                ⏳ Request pending — waiting for owner's approval
              </div>
              <div *ngIf="editingDoc.permissionStatus === 'DENIED'"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-clay/10 border border-clay/20 text-clay text-sm font-heading font-medium">
                ✕ Edit access was denied
              </div>
              <div *ngIf="!editingDoc.canRequestAccess && !editingDoc.permissionStatus"
                class="text-[11px] text-charcoal/40 font-heading italic">
                Admin-owned document — view only for all users.
              </div>

              <button *ngIf="editingDoc.canRequestAccess"
                (click)="requestAccess()" [disabled]="requestingAccess"
                class="btn-secondary !px-5 !py-2.5">
                <span class="btn-slide"></span>
                <span class="btn-label text-sm">{{ requestingAccess ? 'Requesting...' : 'Request Edit Access' }}</span>
              </button>
              <button *ngIf="editingDoc.permissionStatus === 'DENIED'"
                (click)="requestAccess()" [disabled]="requestingAccess"
                class="btn-ghost !px-5 !py-2.5">
                <span class="btn-slide"></span>
                <span class="btn-label text-sm">{{ requestingAccess ? 'Requesting...' : 'Request Again' }}</span>
              </button>
            </div>

            <div *ngIf="accessRequestMessage"
              class="mt-3 p-3 rounded-xl bg-moss/10 border border-moss/20 text-moss text-sm font-heading">
              {{ accessRequestMessage }}
            </div>
          </ng-container>

          <!-- ── EDIT / CREATE MODE ── -->
          <ng-container *ngIf="!editingDoc || editingDoc.canEdit">
            <form (ngSubmit)="onSaveDocument()" class="space-y-5">
              <div>
                <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Title</label>
                <input type="text" [(ngModel)]="docTitle" name="title" class="input-organic" placeholder="Document title" required />
              </div>
              <div>
                <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">Content</label>
                <textarea [(ngModel)]="docContent" name="content"
                  class="input-organic !rounded-2xl min-h-[200px] resize-y"
                  placeholder="Start writing..."></textarea>
              </div>
              <div *ngIf="modalError" class="p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm">{{ modalError }}</div>
              <div class="flex gap-3 justify-end">
                <button type="button" (click)="closeModal()" class="btn-ghost !px-6"><span class="btn-slide"></span><span class="btn-label">Cancel</span></button>
                <button type="submit" [disabled]="saving" class="btn-primary !px-6">
                  <span class="btn-slide"></span>
                  <span class="btn-label">{{ saving ? 'Saving...' : (editingDoc ? 'Update' : 'Create') }}</span>
                </button>
              </div>
            </form>

            <!-- Access Requests section (owner only) -->
            <div *ngIf="editingDoc && editingDoc.owner"
                 class="mt-6 pt-5 border-t border-charcoal/10">
              <button (click)="toggleAccessRequests()"
                class="flex items-center justify-between w-full text-left group">
                <span class="text-[11px] font-heading font-bold uppercase tracking-widest text-charcoal/50 group-hover:text-charcoal/70 transition-colors">
                  Access Requests
                  <span *ngIf="pendingCount > 0"
                    class="ml-2 px-1.5 py-0.5 rounded-full bg-clay text-cream text-[9px] font-bold">
                    {{ pendingCount }}
                  </span>
                </span>
                <svg class="w-3 h-3 text-charcoal/40 transition-transform duration-200"
                     [class.rotate-180]="showAccessRequests"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <div *ngIf="showAccessRequests" class="mt-3 space-y-2">
                <div *ngIf="loadingPermissions" class="text-center py-4 text-xs text-charcoal/40">Loading requests...</div>
                <div *ngIf="!loadingPermissions && allPermissions.length === 0"
                  class="text-center py-4 text-xs text-charcoal/40 font-heading">
                  No access requests for this document.
                </div>
                <div *ngFor="let perm of allPermissions"
                  class="flex items-center justify-between p-3 rounded-xl bg-charcoal/5 border border-charcoal/8">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-heading font-bold text-charcoal">{{ perm.requesterUsername }}</span>
                    <span class="text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      [ngClass]="{
                        'bg-amber-100 text-amber-700': perm.status === 'PENDING',
                        'bg-green-100 text-green-700': perm.status === 'APPROVED',
                        'bg-red-100 text-red-700': perm.status === 'DENIED'
                      }">{{ perm.status }}</span>
                  </div>
                  <div *ngIf="perm.status === 'PENDING'" class="flex gap-1">
                    <button (click)="approvePermission(perm)"
                      class="text-xs font-heading font-bold text-green-700 hover:text-green-800 px-2.5 py-1 rounded-lg hover:bg-green-50 transition-colors border border-green-200">
                      Approve
                    </button>
                    <button (click)="denyPermission(perm)"
                      class="text-xs font-heading font-bold text-clay hover:text-clay/70 px-2.5 py-1 rounded-lg hover:bg-clay/5 transition-colors border border-clay/20">
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class WorkspaceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('workspaceSection', { static: true }) workspaceSection!: ElementRef;
  @ViewChild('wsDropdownRef') wsDropdownRef!: ElementRef<HTMLElement>;

  documents: DocumentResponse[] = [];
  loadingDocs = true;
  dropdownOpen = false;

  // Change password
  showChangePassword = false;
  cpCurrent = ''; cpNew = ''; cpConfirm = ''; cpError = ''; cpSuccess = ''; cpSaving = false;

  // Document modal
  showModal = false;
  editingDoc: DocumentResponse | null = null;
  docTitle = ''; docContent = ''; modalError = ''; saving = false;

  // Access request (view mode)
  requestingAccess = false;
  accessRequestMessage = '';

  // Permission management (owner/admin)
  allPermissions: DocumentPermissionResponse[] = [];
  loadingPermissions = false;
  showAccessRequests = false;

  get pendingCount(): number {
    return this.allPermissions.filter(p => p.status === 'PENDING').length;
  }

  private ctx!: gsap.Context;

  constructor(
    public authService: AuthService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void { this.loadDocuments(); }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {}, this.workspaceSection.nativeElement);
  }

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.wsDropdownRef && !this.wsDropdownRef.nativeElement.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  openChangePassword(): void {
    this.dropdownOpen = false;
    this.cpCurrent = ''; this.cpNew = ''; this.cpConfirm = '';
    this.cpError = ''; this.cpSuccess = '';
    this.showChangePassword = true;
  }
  closeChangePassword(): void { this.showChangePassword = false; }
  submitChangePassword(): void {
    this.cpError = ''; this.cpSuccess = '';
    if (this.cpNew !== this.cpConfirm) { this.cpError = 'New passwords do not match.'; return; }
    if (this.cpNew.length < 6) { this.cpError = 'Password must be at least 6 characters.'; return; }
    this.cpSaving = true;
    this.authService.changePassword(this.cpCurrent, this.cpNew).subscribe({
      next: () => { this.cpSaving = false; this.cpSuccess = 'Password updated!'; setTimeout(() => this.closeChangePassword(), 1500); },
      error: (err) => { this.cpSaving = false; this.cpError = err.error || 'Failed to change password.'; },
    });
  }

  loadDocuments(): void {
    this.loadingDocs = true;
    this.documentService.getAll().subscribe({
      next: (docs) => { this.documents = docs; this.loadingDocs = false; },
      error: () => { this.loadingDocs = false; },
    });
  }

  openCreateModal(): void {
    this.editingDoc = null;
    this.docTitle = ''; this.docContent = ''; this.modalError = '';
    this.accessRequestMessage = '';
    this.allPermissions = []; this.showAccessRequests = false;
    this.showModal = true;
  }

  openDocModal(doc: DocumentResponse): void {
    this.editingDoc = doc;
    this.docTitle = doc.title;
    this.docContent = doc.content;
    this.modalError = '';
    this.accessRequestMessage = '';
    this.requestingAccess = false;
    this.allPermissions = [];
    this.showAccessRequests = false;
    this.showModal = true;

    if (doc.owner) {
      this.loadPermissions(doc.id);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingDoc = null;
    this.modalError = '';
  }

  onSaveDocument(): void {
    this.modalError = '';
    this.saving = true;
    const request: DocumentRequest = { title: this.docTitle, content: this.docContent };
    const obs = this.editingDoc
      ? this.documentService.update(this.editingDoc.id, request)
      : this.documentService.create(request);
    obs.subscribe({
      next: () => { this.saving = false; this.closeModal(); this.loadDocuments(); },
      error: (err) => { this.saving = false; this.modalError = err.error?.message || err.error || 'Failed to save.'; },
    });
  }

  deleteDoc(id: number, event: Event): void {
    event.stopPropagation();
    this.documentService.delete(id).subscribe({
      next: () => this.loadDocuments(),
      error: (err) => alert(err.error?.message || err.error || 'Failed to delete.'),
    });
  }

  requestAccess(): void {
    if (!this.editingDoc) return;
    this.requestingAccess = true;
    this.documentService.requestAccess(this.editingDoc.id).subscribe({
      next: () => {
        this.requestingAccess = false;
        this.accessRequestMessage = '✓ Request sent — waiting for the owner to approve.';
        if (this.editingDoc) {
          this.editingDoc = { ...this.editingDoc, permissionStatus: 'PENDING', canRequestAccess: false };
        }
      },
      error: (err) => { this.requestingAccess = false; this.accessRequestMessage = err.error || 'Failed to send request.'; },
    });
  }

  loadPermissions(docId: number): void {
    this.loadingPermissions = true;
    this.documentService.getPermissions(docId).subscribe({
      next: (perms) => {
        this.allPermissions = perms;
        this.loadingPermissions = false;
        if (perms.some(p => p.status === 'PENDING')) {
          this.showAccessRequests = true;
        }
      },
      error: () => { this.loadingPermissions = false; },
    });
  }

  toggleAccessRequests(): void { this.showAccessRequests = !this.showAccessRequests; }

  approvePermission(perm: DocumentPermissionResponse): void {
    if (!this.editingDoc) return;
    this.documentService.approvePermission(this.editingDoc.id, perm.id).subscribe({
      next: () => { perm.status = 'APPROVED'; },
    });
  }

  denyPermission(perm: DocumentPermissionResponse): void {
    if (!this.editingDoc) return;
    this.documentService.denyPermission(this.editingDoc.id, perm.id).subscribe({
      next: () => { perm.status = 'DENIED'; },
    });
  }

  ngOnDestroy(): void { this.ctx?.revert(); }
}

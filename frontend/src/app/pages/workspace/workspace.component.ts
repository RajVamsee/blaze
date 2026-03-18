import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  DocumentService,
  DocumentRequest,
  DocumentResponse,
} from '../../services/document.service';
import gsap from 'gsap';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div #workspaceSection class="min-h-screen bg-cream">
      <!-- Top Bar -->
      <header
        class="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5"
      >
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a routerLink="/" class="font-heading font-extrabold text-lg tracking-tighter-custom text-charcoal">
            Blaze<span class="text-clay">.</span>
          </a>
          <div class="flex items-center gap-4">
            <span class="text-data text-charcoal/40 text-xs">
              {{ (authService.user$ | async)?.username }}
            </span>
            <span class="text-data text-[10px] px-2 py-0.5 rounded-full bg-moss/10 text-moss uppercase tracking-widest">
              {{ (authService.user$ | async)?.role === 'ROLE_ADMIN' ? 'Admin' : 'Dev' }}
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

      <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- Page Header -->
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="text-data text-clay uppercase tracking-widest text-[10px] mb-2 block">
              Workspace
            </span>
            <h1 class="font-heading text-4xl font-extrabold tracking-tighter-custom">
              Documents<span class="text-clay">.</span>
            </h1>
          </div>
          <button
            (click)="openCreateModal()"
            class="btn-primary !px-6 !py-3"
          >
            <span class="btn-slide"></span>
            <span class="btn-label">+ New Document</span>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loadingDocs" class="text-center py-20">
          <div class="inline-block w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin"></div>
          <p class="text-data text-charcoal/40 mt-4 text-xs">Loading documents...</p>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!loadingDocs && documents.length === 0"
          class="text-center py-20"
        >
          <p class="text-drama text-3xl text-charcoal/20 mb-4">No documents yet</p>
          <p class="text-sm text-charcoal/40 mb-6">
            Create your first document to get started.
          </p>
          <button (click)="openCreateModal()" class="btn-secondary">
            <span class="btn-slide"></span>
            <span class="btn-label">Create First Document</span>
          </button>
        </div>

        <!-- Document Grid -->
        <div
          *ngIf="!loadingDocs && documents.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            *ngFor="let doc of documents"
            class="card-organic group cursor-pointer"
            (click)="openEditModal(doc)"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="font-heading text-lg font-bold tracking-tighter-custom group-hover:text-clay transition-colors">
                {{ doc.title }}
              </h3>
              <button
                (click)="deleteDoc(doc.id, $event)"
                class="opacity-0 group-hover:opacity-100 transition-opacity
                       text-charcoal/30 hover:text-clay text-sm px-2"
                title="Delete"
              >
                &times;
              </button>
            </div>
            <p class="text-sm text-charcoal/50 leading-relaxed line-clamp-3 mb-6">
              {{ doc.content || 'Empty document' }}
            </p>
            <div class="flex items-center gap-3 text-data text-[10px] text-charcoal/30">
              <span>ID: {{ doc.id }}</span>
              <span class="w-1 h-1 rounded-full bg-charcoal/20"></span>
              <span>{{ doc.updatedAt | date:'MMM d, y · h:mm a' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div
        *ngIf="showModal"
        class="fixed inset-0 z-[200] flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          (click)="closeModal()"
          class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        ></div>

        <!-- Modal Card -->
        <div
          #modalCard
          class="relative z-10 card-organic w-full max-w-lg mx-6 max-h-[80vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-heading text-2xl font-bold tracking-tighter-custom">
              {{ editingDoc ? 'Edit Document' : 'New Document' }}
            </h2>
            <button
              (click)="closeModal()"
              class="text-charcoal/30 hover:text-charcoal text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <form (ngSubmit)="onSaveDocument()" class="space-y-5">
            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
                Title
              </label>
              <input
                type="text"
                [(ngModel)]="docTitle"
                name="title"
                class="input-organic"
                placeholder="Document title"
                required
              />
            </div>

            <div>
              <label class="text-data text-charcoal/50 text-[10px] uppercase tracking-widest mb-2 block">
                Content
              </label>
              <textarea
                [(ngModel)]="docContent"
                name="content"
                class="input-organic !rounded-2xl min-h-[200px] resize-y"
                placeholder="Start writing..."
              ></textarea>
            </div>

            <!-- Error -->
            <div
              *ngIf="modalError"
              class="p-3 rounded-2xl bg-clay/10 border border-clay/20 text-clay text-sm"
            >
              {{ modalError }}
            </div>

            <div class="flex gap-3 justify-end">
              <button
                type="button"
                (click)="closeModal()"
                class="btn-ghost !px-6"
              >
                <span class="btn-slide"></span>
                <span class="btn-label">Cancel</span>
              </button>
              <button
                type="submit"
                [disabled]="saving"
                class="btn-primary !px-6"
              >
                <span class="btn-slide"></span>
                <span class="btn-label">
                  {{ saving ? 'Saving...' : (editingDoc ? 'Update' : 'Create') }}
                </span>
              </button>
            </div>
          </form>
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

  documents: DocumentResponse[] = [];
  loadingDocs = true;

  // Modal state
  showModal = false;
  editingDoc: DocumentResponse | null = null;
  docTitle = '';
  docContent = '';
  modalError = '';
  saving = false;

  private ctx!: gsap.Context;

  constructor(
    public authService: AuthService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {}, this.workspaceSection.nativeElement);
  }

  loadDocuments(): void {
    this.loadingDocs = true;
    this.documentService.getAll().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loadingDocs = false;
      },
      error: () => {
        this.loadingDocs = false;
      },
    });
  }

  openCreateModal(): void {
    this.editingDoc = null;
    this.docTitle = '';
    this.docContent = '';
    this.modalError = '';
    this.showModal = true;
  }

  openEditModal(doc: DocumentResponse): void {
    this.editingDoc = doc;
    this.docTitle = doc.title;
    this.docContent = doc.content;
    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingDoc = null;
    this.modalError = '';
  }

  onSaveDocument(): void {
    this.modalError = '';
    this.saving = true;

    const request: DocumentRequest = {
      title: this.docTitle,
      content: this.docContent,
    };

    const obs = this.editingDoc
      ? this.documentService.update(this.editingDoc.id, request)
      : this.documentService.create(request);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadDocuments();
      },
      error: (err) => {
        this.saving = false;
        this.modalError = err.error?.message || err.error || 'Failed to save document.';
      },
    });
  }

  deleteDoc(id: number, event: Event): void {
    event.stopPropagation();
    this.documentService.delete(id).subscribe({
      next: () => this.loadDocuments(),
      error: (err) => {
        alert(err.error?.message || err.error || 'Failed to delete.');
      },
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

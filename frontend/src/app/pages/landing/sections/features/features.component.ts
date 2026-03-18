import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section #featuresSection class="section-organic py-32 bg-cream">
      <!-- Section Header -->
      <div #sectionHeader class="text-center mb-20">
        <span class="text-data text-clay uppercase tracking-widest text-xs mb-4 block">
          Functional Artifacts
        </span>
        <h2 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter-custom mb-4">
          Built Different<span class="text-clay">.</span>
        </h2>
        <p class="text-drama text-xl text-charcoal/50 max-w-md mx-auto">
          Not features. Instruments.
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <!-- ═══ CARD 1: Diagnostic Shuffler ═══ -->
        <div
          #card1
          class="card-organic relative min-h-[420px] flex flex-col justify-between overflow-hidden"
        >
          <div>
            <span class="text-data text-moss/50 text-[10px] uppercase tracking-widest">
              01 / Diagnostic
            </span>
            <h3 class="font-heading text-xl font-bold mt-2 mb-1">
              Smart Triage
            </h3>
            <p class="text-sm text-charcoal/50 leading-relaxed">
              Documents auto-prioritize based on activity, edits, and team engagement.
            </p>
          </div>

          <!-- Shuffler Stack -->
          <div #shufflerContainer class="relative mt-6 h-48 w-full">
            <div
              *ngFor="let card of shufflerCards; let i = index"
              #shufflerCard
              class="absolute left-0 right-0 mx-auto w-[85%] h-16 rounded-2xl
                     border border-charcoal/10 px-4 flex items-center gap-3
                     transition-colors duration-300"
              [style.backgroundColor]="card.bg"
              [style.top.px]="i * 56"
              [style.zIndex]="shufflerCards.length - i"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold"
                [style.backgroundColor]="card.accent"
                [style.color]="'#F2F0E9'"
              >
                {{ card.icon }}
              </div>
              <div>
                <p class="text-xs font-heading font-semibold text-charcoal">
                  {{ card.title }}
                </p>
                <p class="text-[10px] text-charcoal/40 font-mono">
                  {{ card.meta }}
                </p>
              </div>
              <span
                class="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full"
                [style.backgroundColor]="card.accent + '20'"
                [style.color]="card.accent"
              >
                {{ card.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- ═══ CARD 2: Telemetry Typewriter ═══ -->
        <div
          #card2
          class="card-organic relative min-h-[420px] flex flex-col overflow-hidden"
        >
          <div>
            <span class="text-data text-moss/50 text-[10px] uppercase tracking-widest">
              02 / Telemetry
            </span>
            <h3 class="font-heading text-xl font-bold mt-2 mb-1">
              Live Stream
            </h3>
            <p class="text-sm text-charcoal/50 leading-relaxed">
              Real-time activity feed across your entire workspace.
            </p>
          </div>

          <!-- Live Feed Label -->
          <div class="flex items-center gap-2 mt-6 mb-3">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-clay"></span>
            </span>
            <span class="text-[10px] font-mono text-clay uppercase tracking-widest">
              Live Feed
            </span>
          </div>

          <!-- Terminal -->
          <div
            class="flex-1 rounded-2xl bg-charcoal p-4 font-mono text-xs leading-loose overflow-hidden"
          >
            <div *ngFor="let line of typewriterLines; let i = index">
              <span class="text-moss/60">{{ line.time }}</span>
              <span class="text-cream/80 ml-2">{{ line.text }}</span>
            </div>
            <!-- Current typing line -->
            <div>
              <span class="text-moss/60">{{ currentLineTime }}</span>
              <span class="text-cream/80 ml-2">{{ currentTypedText }}</span>
              <span class="inline-block w-1.5 h-3.5 bg-clay ml-0.5 align-middle cursor-blink"></span>
            </div>
          </div>
        </div>

        <!-- ═══ CARD 3: Cursor Protocol Scheduler ═══ -->
        <div
          #card3
          class="card-organic relative min-h-[420px] flex flex-col overflow-hidden"
        >
          <div>
            <span class="text-data text-moss/50 text-[10px] uppercase tracking-widest">
              03 / Protocol
            </span>
            <h3 class="font-heading text-xl font-bold mt-2 mb-1">
              Auto Schedule
            </h3>
            <p class="text-sm text-charcoal/50 leading-relaxed">
              Intelligent task assignment based on team availability.
            </p>
          </div>

          <!-- Weekly Grid -->
          <div #schedulerGrid class="mt-6 flex-1 flex flex-col">
            <div class="grid grid-cols-7 gap-1.5 mb-4">
              <div
                *ngFor="let day of weekDays; let i = index"
                class="relative flex flex-col items-center"
              >
                <span class="text-[10px] font-mono text-charcoal/40 mb-1.5">
                  {{ day }}
                </span>
                <div
                  #dayCell
                  class="w-full aspect-square rounded-xl border border-charcoal/10
                         bg-white/60 flex items-center justify-center
                         text-xs font-mono text-charcoal/30 transition-all duration-300"
                  [ngClass]="{
                    'bg-clay/10 border-clay/30 text-clay': highlightedDays.includes(i)
                  }"
                >
                  {{ i + 1 }}
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="mt-auto flex justify-end">
              <button
                #saveBtn
                class="px-5 py-2 rounded-xl bg-moss text-cream text-xs font-heading
                       font-semibold transition-transform duration-200"
              >
                Save Schedule
              </button>
            </div>

            <!-- Animated SVG Cursor -->
            <svg
              #cursorSvg
              class="absolute pointer-events-none z-20"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style="top: 0; left: 0; opacity: 0"
            >
              <path
                d="M5 3l14 8-7 2-3 7z"
                fill="#CC5833"
                stroke="#1A1A1A"
                stroke-width="0.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .cursor-blink {
        animation: blink 0.8s step-end infinite;
      }
    `,
  ],
})
export class FeaturesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('featuresSection', { static: true }) featuresSection!: ElementRef;
  @ViewChild('sectionHeader', { static: true }) sectionHeader!: ElementRef;
  @ViewChild('card1', { static: true }) card1!: ElementRef;
  @ViewChild('card2', { static: true }) card2!: ElementRef;
  @ViewChild('card3', { static: true }) card3!: ElementRef;
  @ViewChild('shufflerContainer', { static: true }) shufflerContainer!: ElementRef;
  @ViewChild('schedulerGrid', { static: true }) schedulerGrid!: ElementRef;
  @ViewChild('saveBtn', { static: true }) saveBtn!: ElementRef;
  @ViewChild('cursorSvg', { static: true }) cursorSvg!: ElementRef;

  private ctx!: gsap.Context;
  private shuffleInterval: any;
  private typeInterval: any;
  private cursorTimeline: any;

  // ── Card 1: Shuffler Data ──
  shufflerCards = [
    { title: 'API Redesign', meta: '12 edits · 4 users', icon: 'D1', bg: '#ffffff', accent: '#CC5833', status: 'Active' },
    { title: 'Sprint Retro', meta: '3 edits · 2 users', icon: 'D2', bg: '#f8f8f6', accent: '#2E4036', status: 'Idle' },
    { title: 'Onboarding Flow', meta: '8 edits · 5 users', icon: 'D3', bg: '#f4f3ef', accent: '#CC5833', status: 'Active' },
  ];

  // ── Card 2: Typewriter Data ──
  typewriterLines: { time: string; text: string }[] = [];
  currentTypedText = '';
  currentLineTime = '';
  private feedMessages = [
    'user.auth → session.created (dev_k8s)',
    'doc.update → "API Redesign" by @sarah',
    'ws.connect → 3 active collaborators',
    'role.check → APPROVED ✓ admin_panel',
    'doc.create → "Sprint Notes Q2" by @raj',
    'telemetry → latency: 12ms p99',
    'ws.broadcast → edit_delta pushed to 3 peers',
    'user.status → @mike approved by admin',
  ];
  private feedIndex = 0;

  // ── Card 3: Scheduler Data ──
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  highlightedDays: number[] = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(this.sectionHeader.nativeElement, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.sectionHeader.nativeElement,
          start: 'top 80%',
        },
      });

      const cards = [this.card1, this.card2, this.card3];
      cards.forEach((card, i) => {
        gsap.from(card.nativeElement, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top 85%',
          },
        });
      });
    }, this.featuresSection.nativeElement);

    this.ngZone.runOutsideAngular(() => {
      this.startShuffler();
      this.startTypewriter();
      this.startCursorProtocol();
    });
  }

  // ════════════════════════════════
  // CARD 1 — Diagnostic Shuffler
  // ════════════════════════════════
  private startShuffler(): void {
    this.shuffleInterval = setInterval(() => {
      const container = this.shufflerContainer.nativeElement as HTMLElement;
      const cardEls = container.children;
      if (!cardEls.length) return;

      // Pop last, unshift to front
      const last = this.shufflerCards.pop()!;
      this.shufflerCards.unshift(last);

      // Animate repositioning
      this.ngZone.run(() => {});
      setTimeout(() => {
        for (let i = 0; i < cardEls.length; i++) {
          gsap.to(cardEls[i], {
            y: 0,
            top: i * 56,
            zIndex: this.shufflerCards.length - i,
            duration: 0.6,
            ease: 'back.out(1.4)',
          });
        }
        // Pop-in effect on the new top card
        gsap.fromTo(
          cardEls[0],
          { scale: 0.92, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
        );
      }, 20);
    }, 3000);
  }

  // ════════════════════════════════
  // CARD 2 — Telemetry Typewriter
  // ════════════════════════════════
  private startTypewriter(): void {
    this.currentLineTime = this.getTime();
    const msg = this.feedMessages[this.feedIndex];
    let charIdx = 0;

    const type = () => {
      this.typeInterval = setTimeout(() => {
        if (charIdx < msg.length) {
          this.ngZone.run(() => {
            this.currentTypedText = msg.substring(0, charIdx + 1);
          });
          charIdx++;
          type();
        } else {
          // Line done — push to history, start next
          setTimeout(() => {
            this.ngZone.run(() => {
              this.typewriterLines.push({
                time: this.currentLineTime,
                text: this.currentTypedText,
              });
              // Keep max 6 lines
              if (this.typewriterLines.length > 6) {
                this.typewriterLines.shift();
              }
              this.currentTypedText = '';
              this.feedIndex = (this.feedIndex + 1) % this.feedMessages.length;
              this.currentLineTime = this.getTime();
            });
            this.startTypewriter();
          }, 1200);
        }
      }, 30 + Math.random() * 40);
    };
    type();
  }

  private getTime(): string {
    const d = new Date();
    return (
      d.getHours().toString().padStart(2, '0') +
      ':' +
      d.getMinutes().toString().padStart(2, '0') +
      ':' +
      d.getSeconds().toString().padStart(2, '0')
    );
  }

  // ════════════════════════════════
  // CARD 3 — Cursor Protocol
  // ════════════════════════════════
  private startCursorProtocol(): void {
    const gridEl = this.schedulerGrid.nativeElement as HTMLElement;
    const cursor = this.cursorSvg.nativeElement as SVGElement;
    const saveEl = this.saveBtn.nativeElement as HTMLElement;

    // Sequence: pick 3 random days, click each, then click Save, loop
    const runCycle = () => {
      const dayCells = gridEl.querySelectorAll('[class*="aspect-square"]');
      if (!dayCells.length) return;

      const targets = [1, 3, 5]; // Mon, Wed, Fri
      this.ngZone.run(() => (this.highlightedDays = []));

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => runCycle(), 1500);
        },
      });

      // Show cursor
      tl.to(cursor, { opacity: 1, duration: 0.3 });

      targets.forEach((dayIdx, i) => {
        const cell = dayCells[dayIdx] as HTMLElement;
        const rect = cell.getBoundingClientRect();
        const parentRect = gridEl.getBoundingClientRect();
        const x = rect.left - parentRect.left + rect.width / 2;
        const y = rect.top - parentRect.top + rect.height / 2;

        // Move to cell
        tl.to(cursor, {
          left: x,
          top: y,
          duration: 0.5 + i * 0.1,
          ease: 'power2.inOut',
        });
        // Click effect
        tl.to(cursor, { scale: 0.7, duration: 0.1 });
        tl.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(3)' });
        // Highlight day
        tl.call(() => {
          this.ngZone.run(() => {
            this.highlightedDays = [...this.highlightedDays, dayIdx];
          });
        });
        tl.to({}, { duration: 0.3 });
      });

      // Move to Save button
      const saveRect = saveEl.getBoundingClientRect();
      const parentRect = gridEl.getBoundingClientRect();
      tl.to(cursor, {
        left: saveRect.left - parentRect.left + saveRect.width / 2,
        top: saveRect.top - parentRect.top + saveRect.height / 2,
        duration: 0.6,
        ease: 'power2.inOut',
      });
      // Click save
      tl.to(cursor, { scale: 0.7, duration: 0.1 });
      tl.to(saveEl, { scale: 0.95, duration: 0.1 }, '<');
      tl.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(3)' });
      tl.to(saveEl, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, '<');
      // Flash save button
      tl.to(saveEl, {
        backgroundColor: '#CC5833',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
      // Hide cursor
      tl.to(cursor, { opacity: 0, duration: 0.4, delay: 0.5 });
    };

    setTimeout(() => runCycle(), 2000);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    clearInterval(this.shuffleInterval);
    clearTimeout(this.typeInterval);
    this.cursorTimeline?.kill();
  }
}

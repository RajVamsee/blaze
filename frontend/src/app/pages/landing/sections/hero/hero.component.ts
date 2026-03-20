import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section
      #heroSection
      class="relative min-h-screen w-full overflow-hidden flex items-end"
    >
      <!-- Background — rich dark gradient with geometric grid -->
      <div class="absolute inset-0 z-0 hero-bg">
        <div class="absolute inset-0 hero-grid opacity-[0.07]"></div>
        <div class="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-moss/30 blur-[120px]"></div>
        <div class="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-clay/20 blur-[100px]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent"></div>
      </div>

      <!-- Content row -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-16 lg:pt-40 lg:pb-36 flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">

        <!-- Left: text -->
        <div class="max-w-3xl w-full">
          <div #eyebrow class="flex items-center gap-3 mb-8 opacity-0">
            <div class="h-px w-12 bg-clay"></div>
            <span class="text-data text-clay uppercase tracking-widest text-xs">
              Collaborative Workspace
            </span>
          </div>

          <h1
            #line1
            class="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold
                   tracking-tighter-custom text-cream leading-[1.05] mb-2 opacity-0"
          >
            Where ideas find their
          </h1>

          <h1
            #line2
            class="text-drama text-5xl sm:text-7xl lg:text-[10rem] font-semibold
                   text-cream leading-[0.9] mb-10 opacity-0"
          >
            Ignition<span class="text-clay">.</span>
          </h1>

          <p
            #subtext
            class="font-heading text-base sm:text-lg text-cream/50 max-w-lg
                   leading-relaxed mb-10 opacity-0"
          >
            Blaze is the workspace where distributed teams think, build, and
            ship together — with real-time documents, role-based access, and
            zero friction.
          </p>

          <div #ctaRow class="flex flex-wrap gap-4 opacity-0">
            <a routerLink="/register" class="btn-primary !px-7 sm:!px-10 !py-3 sm:!py-4 !text-sm sm:!text-base">
              <span class="btn-slide"></span>
              <span class="btn-label">Start Building</span>
            </a>
            <a
              routerLink="/login"
              class="btn-magnetic bg-cream/10 text-cream border border-cream/20
                     !px-7 sm:!px-10 !py-3 sm:!py-4 !text-sm sm:!text-base backdrop-blur-sm"
            >
              <span class="btn-slide bg-cream/10"></span>
              <span class="btn-label">Sign In</span>
            </a>
          </div>
        </div>

        <!-- Right: Blaze emblem — visible on all screens, larger on desktop -->
        <div class="flex items-center justify-center shrink-0 lg:-translate-x-24 lg:-translate-y-24">
          <div
            #blazeEmblem
            class="blaze-emblem flex flex-col items-center gap-4 lg:gap-6 opacity-0 cursor-default select-none"
            (mouseenter)="onEmblemEnter($event)"
            (mousemove)="onEmblemMove($event)"
            (mouseleave)="onEmblemLeave()"
          >
            <div class="relative">
              <canvas #emberCanvas class="absolute inset-0 pointer-events-none" style="z-index:10; border-radius: 48px;"></canvas>
              <div class="blaze-logo-mark" #logoMark>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="280" height="280" class="w-44 h-44 lg:w-[280px] lg:h-[280px]">
                  <defs>
                    <linearGradient id="heroFlame" x1="0%" y1="100%" x2="20%" y2="0%">
                      <stop offset="0%" stop-color="#C4572A"/>
                      <stop offset="45%" stop-color="#E8732A"/>
                      <stop offset="100%" stop-color="#FFB347"/>
                    </linearGradient>
                    <radialGradient id="heroGlow" cx="50%" cy="65%" r="50%">
                      <stop offset="0%" stop-color="#E8732A" stop-opacity="0.35"/>
                      <stop offset="100%" stop-color="#E8732A" stop-opacity="0"/>
                    </radialGradient>
                    <filter id="emboss">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#C4572A" flood-opacity="0.6"/>
                    </filter>
                  </defs>
                  <rect width="120" height="120" rx="28" fill="#1C1917"/>
                  <rect width="120" height="120" rx="28" fill="none" stroke="#E8732A" stroke-opacity="0.15" stroke-width="1.5"/>
                  <ellipse cx="60" cy="75" rx="44" ry="38" fill="url(#heroGlow)"/>
                  <path d="M72 18 C72 18 80 26 76 34 C78 28 84 31 82 38 C80 33 74 35 74 29 C72 33 70 38 72 42" fill="#FF9A3C" opacity="0.55" stroke="none"/>
                  <path d="M60 14 C60 14 64 20 62 26 C63 22 67 24 66 28 C65 25 61 26 61 22 C60 25 59 28 61 30" fill="#FFB347" opacity="0.4" stroke="none"/>
                  <text x="60" y="94" font-family="Georgia, 'Times New Roman', serif" font-size="82" font-weight="900" text-anchor="middle" fill="url(#heroFlame)" filter="url(#emboss)">B</text>
                  <circle cx="82" cy="16" r="3.5" fill="#FFB347" opacity="0.85"/>
                  <circle cx="76" cy="10" r="2.2" fill="#FF8C42" opacity="0.65"/>
                  <circle cx="90" cy="22" r="2" fill="#FFB347" opacity="0.5"/>
                  <circle cx="68" cy="8" r="1.8" fill="#FF9A3C" opacity="0.45"/>
                </svg>
              </div>
            </div>
            <span class="blaze-wordmark font-heading font-extrabold text-3xl lg:text-5xl tracking-widest"
                  style="background: linear-gradient(135deg, #C4572A 0%, #E8732A 50%, #FFB347 100%);
                         -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                         background-clip: text; letter-spacing: 0.18em;">
              BLAZE
            </span>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div #scrollIndicator class="absolute bottom-8 right-8 hidden sm:flex flex-col items-center gap-2 opacity-0">
          <span class="text-data text-cream/30 text-[10px] uppercase tracking-widest rotate-90 origin-center translate-y-6">
            Scroll
          </span>
          <div class="w-px h-16 bg-gradient-to-b from-cream/40 to-transparent scroll-line-anim"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-bg {
      background: linear-gradient(135deg, #0f1a13 0%, #1A1A1A 40%, #1e2e22 70%, #0f1a13 100%);
    }
    .hero-grid {
      background-image:
        linear-gradient(rgba(242,240,233,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(242,240,233,1) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(1); opacity: 0.4; }
      50% { transform: scaleY(0.6); opacity: 1; }
    }
    .scroll-line-anim {
      animation: scrollPulse 2s ease-in-out infinite;
      transform-origin: top;
    }

    .blaze-emblem {
      perspective: 600px;
    }

    .blaze-logo-mark {
      transition: transform 0.12s ease-out;
      transform-style: preserve-3d;
      will-change: transform;
      position: relative;
      border-radius: 24px;
    }

    .blaze-wordmark {
      transition: transform 0.2s ease-out, letter-spacing 0.2s ease-out;
    }

    .blaze-emblem:hover .blaze-wordmark {
      letter-spacing: 0.26em;
    }
  `],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;
  @ViewChild('eyebrow', { static: true }) eyebrow!: ElementRef;
  @ViewChild('line1', { static: true }) line1!: ElementRef;
  @ViewChild('line2', { static: true }) line2!: ElementRef;
  @ViewChild('subtext', { static: true }) subtext!: ElementRef;
  @ViewChild('ctaRow', { static: true }) ctaRow!: ElementRef;
  @ViewChild('scrollIndicator', { static: true }) scrollIndicator!: ElementRef;
  @ViewChild('blazeEmblem', { static: false }) blazeEmblem!: ElementRef;
  @ViewChild('logoMark', { static: false }) logoMark!: ElementRef;
  @ViewChild('emberCanvas', { static: false }) emberCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: gsap.Context;
  private embers: Ember[] = [];
  private animFrameId: number | null = null;
  private emberInterval: any = null;
  private isHovering = false;
  private emberColors = ['#FFB347', '#FF9A3C', '#E8732A', '#FF6B1A', '#FFC86B', '#FF8C42'];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(this.eyebrow.nativeElement, { y: 0, opacity: 1, duration: 0.8, delay: 0.4 })
        .fromTo(this.line1.nativeElement, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.4')
        .fromTo(this.line2.nativeElement, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.6')
        .fromTo(this.subtext.nativeElement, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
        .fromTo(this.ctaRow.nativeElement, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo(this.scrollIndicator.nativeElement, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.2')
        .fromTo(this.blazeEmblem.nativeElement, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' }, '-=1.2');
    }, this.heroSection.nativeElement);

    // Size the canvas to match the emblem
    this.sizeCanvas();
  }

  private sizeCanvas(): void {
    if (!this.emberCanvas) return;
    const canvas = this.emberCanvas.nativeElement;
    const emblem = this.blazeEmblem.nativeElement as HTMLElement;
    canvas.width = emblem.offsetWidth || 200;
    canvas.height = emblem.offsetHeight || 240;
  }

  onEmblemEnter(e: MouseEvent): void {
    this.isHovering = true;
    this.sizeCanvas();
    this.startEmberLoop();
    this.spawnBurst(e);
  }

  onEmblemMove(e: MouseEvent): void {
    if (!this.logoMark) return;
    const el = this.blazeEmblem.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
    const rotY = dx * 18;
    const rotX = -dy * 12;
    (this.logoMark.nativeElement as HTMLElement).style.transform =
      `perspective(600px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.05)`;
  }

  onEmblemLeave(): void {
    this.isHovering = false;
    if (this.logoMark) {
      (this.logoMark.nativeElement as HTMLElement).style.transform =
        'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    }
    this.stopEmberLoop();
  }

  private spawnBurst(e: MouseEvent): void {
    if (!this.emberCanvas) return;
    const canvas = this.emberCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.embers.push({
        x: mx + (Math.random() - 0.5) * 30,
        y: my + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 2 + Math.random() * 4,
        alpha: 0.8 + Math.random() * 0.2,
        decay: 0.012 + Math.random() * 0.018,
        color: this.emberColors[Math.floor(Math.random() * this.emberColors.length)],
      });
    }
  }

  private startEmberLoop(): void {
    if (this.animFrameId !== null) return;

    // Continuously spawn embers from bottom of the logo while hovering
    this.emberInterval = setInterval(() => {
      if (!this.isHovering || !this.emberCanvas) return;
      const canvas = this.emberCanvas.nativeElement;
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < 3; i++) {
        const x = w * 0.25 + Math.random() * w * 0.5;
        const y = h * 0.55 + Math.random() * h * 0.25;
        this.embers.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -(1.5 + Math.random() * 2.5),
          size: 1.5 + Math.random() * 3,
          alpha: 0.7 + Math.random() * 0.3,
          decay: 0.01 + Math.random() * 0.015,
          color: this.emberColors[Math.floor(Math.random() * this.emberColors.length)],
        });
      }
    }, 50);

    this.zone.runOutsideAngular(() => {
      const loop = () => {
        this.drawEmbers();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    });
  }

  private stopEmberLoop(): void {
    if (this.emberInterval) { clearInterval(this.emberInterval); this.emberInterval = null; }
    // Let remaining embers finish fading
    const finish = () => {
      if (this.embers.length === 0) {
        if (this.animFrameId !== null) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
        if (this.emberCanvas) {
          const ctx = this.emberCanvas.nativeElement.getContext('2d');
          ctx?.clearRect(0, 0, this.emberCanvas.nativeElement.width, this.emberCanvas.nativeElement.height);
        }
        return;
      }
      this.drawEmbers();
      requestAnimationFrame(finish);
    };
    if (this.animFrameId !== null) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    requestAnimationFrame(finish);
  }

  private drawEmbers(): void {
    if (!this.emberCanvas) return;
    const canvas = this.emberCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.embers = this.embers.filter(e => e.alpha > 0.02);

    for (const e of this.embers) {
      ctx.save();
      ctx.globalAlpha = e.alpha;
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      // Slightly elongated ember shape
      ctx.ellipse(e.x, e.y, e.size * 0.6, e.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update physics
      e.x += e.vx;
      e.y += e.vy;
      e.vy -= 0.04;            // slight upward acceleration (heat rising)
      e.vx *= 0.98;            // gentle drag
      e.size *= 0.98;
      e.alpha -= e.decay;
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    if (this.emberInterval) clearInterval(this.emberInterval);
  }
}

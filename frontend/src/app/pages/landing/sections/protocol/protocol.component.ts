import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-protocol',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section #protocolSection class="relative bg-cream">
      <!-- Section Header -->
      <div class="section-organic text-center pb-10 pt-32">
        <span class="text-data text-clay uppercase tracking-widest text-xs mb-4 block">
          Protocol
        </span>
        <h2 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter-custom mb-4">
          The Stack<span class="text-clay">.</span>
        </h2>
        <p class="text-drama text-xl text-charcoal/50 max-w-md mx-auto">
          Three layers. One system.
        </p>
      </div>

      <!-- Stacking Cards Container -->
      <div #stackContainer class="relative px-6 max-w-5xl mx-auto pb-[50vh]">

        <!-- ═══ STACK CARD 1: Concentric Circles / Double Helix ═══ -->
        <div
          #stackCard
          class="sticky top-[15vh] w-full min-h-[70vh] rounded-organic overflow-hidden
                 bg-charcoal border border-charcoal/20 shadow-organic-lg mb-8
                 flex flex-col justify-between p-10"
        >
          <div class="relative z-10">
            <span class="text-data text-clay text-[10px] uppercase tracking-widest">
              Layer 01 / Foundation
            </span>
            <h3 class="font-heading text-3xl font-bold text-cream mt-3 mb-2">
              Identity & Access
            </h3>
            <p class="text-sm text-cream/40 max-w-md leading-relaxed">
              JWT authentication, role-based access control, and user lifecycle
              management form the bedrock of every Blaze interaction.
            </p>
          </div>

          <!-- SVG: Rotating Concentric Circles -->
          <div class="absolute inset-0 flex items-center justify-center opacity-20">
            <svg #helixSvg width="500" height="500" viewBox="0 0 500 500">
              <g transform="translate(250,250)">
                <circle
                  *ngFor="let r of concentricRadii; let i = index"
                  [attr.r]="r"
                  fill="none"
                  stroke="#CC5833"
                  [attr.stroke-width]="0.5 + i * 0.3"
                  [attr.stroke-dasharray]="r * 0.5 + ' ' + r * 0.8"
                  [attr.class]="'helix-ring-' + i"
                  opacity="0.6"
                />
              </g>
            </svg>
          </div>

          <div class="relative z-10 flex items-center gap-3 mt-8">
            <div class="h-px flex-1 bg-cream/10"></div>
            <span class="text-data text-cream/20 text-[10px]">BCRYPT + JJWT + RBAC</span>
          </div>
        </div>

        <!-- ═══ STACK CARD 2: Scanning Laser Line ═══ -->
        <div
          #stackCard
          class="sticky top-[15vh] w-full min-h-[70vh] rounded-organic overflow-hidden
                 bg-moss border border-moss-dark/30 shadow-organic-lg mb-8
                 flex flex-col justify-between p-10"
        >
          <div class="relative z-10">
            <span class="text-data text-clay text-[10px] uppercase tracking-widest">
              Layer 02 / Transport
            </span>
            <h3 class="font-heading text-3xl font-bold text-cream mt-3 mb-2">
              Real-Time Sync
            </h3>
            <p class="text-sm text-cream/40 max-w-md leading-relaxed">
              Every keystroke, cursor move, and document mutation is broadcast
              through a low-latency WebSocket mesh to every connected collaborator.
            </p>
          </div>

          <!-- SVG: Dot Grid with Scanning Laser -->
          <div class="absolute inset-0 flex items-center justify-center opacity-25">
            <svg #laserSvg width="500" height="300" viewBox="0 0 500 300">
              <!-- Dot Grid -->
              <g>
                <circle
                  *ngFor="let dot of laserDots"
                  [attr.cx]="dot.x"
                  [attr.cy]="dot.y"
                  r="2"
                  fill="#F2F0E9"
                  opacity="0.3"
                />
              </g>
              <!-- Laser Line -->
              <line
                #laserLine
                x1="0" y1="0" x2="0" y2="300"
                stroke="#CC5833"
                stroke-width="2"
                opacity="0.8"
              />
              <!-- Glow -->
              <line
                #laserGlow
                x1="0" y1="0" x2="0" y2="300"
                stroke="#CC5833"
                stroke-width="8"
                opacity="0.15"
              />
            </svg>
          </div>

          <div class="relative z-10 flex items-center gap-3 mt-8">
            <div class="h-px flex-1 bg-cream/10"></div>
            <span class="text-data text-cream/20 text-[10px]">WEBSOCKET + CRDT + DELTA</span>
          </div>
        </div>

        <!-- ═══ STACK CARD 3: EKG Waveform ═══ -->
        <div
          #stackCard
          class="sticky top-[15vh] w-full min-h-[70vh] rounded-organic overflow-hidden
                 bg-gradient-to-br from-clay to-clay-dark border border-clay-dark/30
                 shadow-organic-lg mb-8 flex flex-col justify-between p-10"
        >
          <div class="relative z-10">
            <span class="text-data text-cream/70 text-[10px] uppercase tracking-widest">
              Layer 03 / Intelligence
            </span>
            <h3 class="font-heading text-3xl font-bold text-cream mt-3 mb-2">
              Workspace Pulse
            </h3>
            <p class="text-sm text-cream/50 max-w-md leading-relaxed">
              Continuous monitoring of workspace health — activity telemetry,
              collaboration density, and engagement signals synthesized into
              actionable insight.
            </p>
          </div>

          <!-- SVG: EKG Waveform -->
          <div class="absolute inset-0 flex items-center justify-center opacity-20">
            <svg #ekgSvg width="600" height="200" viewBox="0 0 600 200">
              <path
                #ekgPath
                d="M0,100 L60,100 L80,100 L90,60 L100,140 L110,30 L120,170 L130,80 L140,100
                   L200,100 L220,100 L230,60 L240,140 L250,30 L260,170 L270,80 L280,100
                   L340,100 L360,100 L370,60 L380,140 L390,30 L400,170 L410,80 L420,100
                   L480,100 L500,100 L510,60 L520,140 L530,30 L540,170 L550,80 L560,100 L600,100"
                fill="none"
                stroke="#F2F0E9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="relative z-10 flex items-center gap-3 mt-8">
            <div class="h-px flex-1 bg-cream/10"></div>
            <span class="text-data text-cream/30 text-[10px]">TELEMETRY + PULSE + ANALYTICS</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProtocolComponent implements AfterViewInit, OnDestroy {
  @ViewChild('protocolSection', { static: true }) section!: ElementRef;
  @ViewChild('stackContainer', { static: true }) stackContainer!: ElementRef;
  @ViewChildren('stackCard') stackCards!: QueryList<ElementRef>;
  @ViewChild('helixSvg', { static: true }) helixSvg!: ElementRef;
  @ViewChild('laserLine', { static: true }) laserLine!: ElementRef;
  @ViewChild('laserGlow', { static: true }) laserGlow!: ElementRef;
  @ViewChild('ekgPath', { static: true }) ekgPath!: ElementRef;

  private ctx!: gsap.Context;

  // Concentric circle radii
  concentricRadii = [40, 70, 100, 130, 160, 190];

  // Dot grid for laser scanner
  laserDots: { x: number; y: number }[] = [];

  constructor() {
    // Generate dot grid
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 20; col++) {
        this.laserDots.push({
          x: 25 + col * 24,
          y: 15 + row * 30,
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      const cards = this.stackCards.toArray();

      // ── Sticky Stacking Effect ──
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          ScrollTrigger.create({
            trigger: card.nativeElement,
            start: 'top 15%',
            end: 'bottom 15%',
            endTrigger: cards[cards.length - 1].nativeElement,
            pin: false,
            onUpdate: (self) => {
              // As the next card comes up, scale/blur/fade the current one
              const progress = self.progress;
              gsap.set(card.nativeElement, {
                scale: 1 - progress * 0.08,
                filter: `blur(${progress * 12}px)`,
                opacity: 1 - progress * 0.4,
              });
            },
          });
        }
      });

      // ── Card 1: Rotating Concentric Circles ──
      const rings = this.helixSvg.nativeElement.querySelectorAll('circle');
      rings.forEach((ring: SVGCircleElement, i: number) => {
        gsap.to(ring, {
          rotation: i % 2 === 0 ? 360 : -360,
          transformOrigin: '50% 50%',
          duration: 20 + i * 5,
          ease: 'none',
          repeat: -1,
        });
      });

      // ── Card 2: Scanning Laser Line ──
      gsap.to([this.laserLine.nativeElement, this.laserGlow.nativeElement], {
        attr: { x1: 500, x2: 500 },
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // ── Card 3: EKG Waveform Dash Animation ──
      const ekgEl = this.ekgPath.nativeElement as SVGPathElement;
      const pathLength = ekgEl.getTotalLength();
      gsap.set(ekgEl, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
      gsap.to(ekgEl, {
        strokeDashoffset: -pathLength,
        duration: 4,
        ease: 'none',
        repeat: -1,
      });
    }, this.section.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

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
        <!-- Grid overlay -->
        <div class="absolute inset-0 hero-grid opacity-[0.07]"></div>
        <!-- Radial glow — moss top-right -->
        <div class="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-moss/30 blur-[120px]"></div>
        <!-- Radial glow — clay bottom-left -->
        <div class="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-clay/20 blur-[100px]"></div>
        <!-- Bottom fade to ensure text is readable -->
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent"></div>
      </div>

      <!-- Content — pushed to bottom-left third -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 pb-28 pt-40 lg:pb-36">
        <div class="max-w-3xl">
          <!-- Eyebrow -->
          <div #eyebrow class="flex items-center gap-3 mb-8 opacity-0">
            <div class="h-px w-12 bg-clay"></div>
            <span class="text-data text-clay uppercase tracking-widest text-xs">
              Collaborative Workspace
            </span>
          </div>

          <!-- Line 1 -->
          <h1
            #line1
            class="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold
                   tracking-tighter-custom text-cream leading-[1.05] mb-2 opacity-0"
          >
            Where ideas find their
          </h1>

          <!-- Line 2 — Drama serif -->
          <h1
            #line2
            class="text-drama text-6xl sm:text-8xl lg:text-[10rem] font-semibold
                   text-cream leading-[0.9] mb-10 opacity-0"
          >
            Ignition<span class="text-clay">.</span>
          </h1>

          <!-- Subtext -->
          <p
            #subtext
            class="font-heading text-base sm:text-lg text-cream/50 max-w-lg
                   leading-relaxed mb-10 opacity-0"
          >
            Blaze is the workspace where distributed teams think, build, and
            ship together — with real-time documents, role-based access, and
            zero friction.
          </p>

          <!-- CTA Row -->
          <div #ctaRow class="flex flex-wrap gap-4 opacity-0">
            <a routerLink="/register" class="btn-primary !px-10 !py-4 !text-base">
              <span class="btn-slide"></span>
              <span class="btn-label">Start Building</span>
            </a>
            <a
              routerLink="/login"
              class="btn-magnetic bg-cream/10 text-cream border border-cream/20
                     !px-10 !py-4 !text-base backdrop-blur-sm"
            >
              <span class="btn-slide bg-cream/10"></span>
              <span class="btn-label">Sign In</span>
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div #scrollIndicator class="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-0">
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

  private ctx!: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(this.eyebrow.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
      })
        .fromTo(
          this.line1.nativeElement,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.4'
        )
        .fromTo(
          this.line2.nativeElement,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          '-=0.6'
        )
        .fromTo(
          this.subtext.nativeElement,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          this.ctaRow.nativeElement,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          this.scrollIndicator.nativeElement,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          '-=0.2'
        );
    }, this.heroSection.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

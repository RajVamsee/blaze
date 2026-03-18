import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-philosophy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      #philosophySection
      class="relative min-h-screen overflow-hidden flex items-center"
    >
      <!-- Background: Dark Moss -->
      <div class="absolute inset-0 bg-moss z-0"></div>

      <!-- Subtle grid texture -->
      <div #bgTexture class="absolute inset-0 z-[1]">
        <div class="h-full w-full opacity-[0.04]"
          style="background-image: linear-gradient(rgba(242,240,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(242,240,233,1) 1px, transparent 1px); background-size: 80px 80px;">
        </div>
      </div>

      <!-- Grain overlay for extra depth -->
      <div class="absolute inset-0 z-[2] opacity-[0.03]"
        style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence baseFrequency=%220.8%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>');
               background-size: 150px;"
      ></div>

      <!-- Content -->
      <div class="relative z-10 section-organic w-full">
        <div class="max-w-5xl mx-auto">
          <!-- Eyebrow -->
          <div #eyebrow class="flex items-center gap-3 mb-16">
            <div class="h-px w-16 bg-cream/20"></div>
            <span class="text-data text-cream/30 uppercase tracking-widest text-[10px]">
              Philosophy
            </span>
          </div>

          <!-- Statement 1 — Neutral, smaller -->
          <div #stmt1 class="mb-6">
            <p
              class="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium
                     text-cream/40 leading-snug tracking-tighter-custom"
            >
              Most software focuses on:
            </p>
            <p
              class="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium
                     text-cream/40 leading-snug tracking-tighter-custom"
            >
              data storage.
            </p>
          </div>

          <!-- Divider -->
          <div #divider class="w-24 h-px bg-clay/40 my-12"></div>

          <!-- Statement 2 — Massive drama serif -->
          <div #stmt2>
            <p
              class="font-heading text-2xl sm:text-3xl text-cream/60
                     leading-snug tracking-tighter-custom mb-4"
            >
              We focus on:
            </p>
            <h2
              class="text-drama text-5xl sm:text-7xl lg:text-[8rem]
                     font-semibold text-cream leading-[0.95]"
            >
              Cognitive<br />
              <span class="text-clay">Leverage</span><span class="text-cream/30">.</span>
            </h2>
          </div>

          <!-- Sub-manifesto -->
          <div #subManifesto class="mt-16 max-w-lg">
            <p class="font-heading text-base text-cream/30 leading-relaxed">
              We don't just store your documents. We amplify the thinking
              behind them — surfacing connections, accelerating collaboration,
              and eliminating the friction between thought and execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PhilosophyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('philosophySection', { static: true }) section!: ElementRef;
  @ViewChild('bgTexture', { static: true }) bgTexture!: ElementRef;
  @ViewChild('eyebrow', { static: true }) eyebrow!: ElementRef;
  @ViewChild('stmt1', { static: true }) stmt1!: ElementRef;
  @ViewChild('divider', { static: true }) divider!: ElementRef;
  @ViewChild('stmt2', { static: true }) stmt2!: ElementRef;
  @ViewChild('subManifesto', { static: true }) subManifesto!: ElementRef;

  private ctx!: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Parallax on the background texture
      gsap.to(this.bgTexture.nativeElement, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: this.section.nativeElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Eyebrow
      gsap.from(this.eyebrow.nativeElement, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.eyebrow.nativeElement,
          start: 'top 80%',
        },
      });

      // Statement 1 — fade in neutral
      gsap.from(this.stmt1.nativeElement.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.stmt1.nativeElement,
          start: 'top 75%',
        },
      });

      // Divider expand
      gsap.from(this.divider.nativeElement, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: this.divider.nativeElement,
          start: 'top 75%',
        },
      });

      // Statement 2 — the massive reveal
      const stmt2Children = this.stmt2.nativeElement.children;
      gsap.from(stmt2Children[0], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.stmt2.nativeElement,
          start: 'top 70%',
        },
      });

      gsap.from(stmt2Children[1], {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.stmt2.nativeElement,
          start: 'top 70%',
        },
      });

      // Sub-manifesto
      gsap.from(this.subManifesto.nativeElement, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.subManifesto.nativeElement,
          start: 'top 80%',
        },
      });
    }, this.section.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

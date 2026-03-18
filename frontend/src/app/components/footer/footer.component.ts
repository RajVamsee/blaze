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
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer #footerSection class="relative bg-charcoal overflow-hidden">
      <!-- Subtle texture -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence baseFrequency=%220.8%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>');
               background-size: 150px;"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <!-- Top Section — Big CTA -->
        <div #ctaBlock class="py-24 border-b border-cream/10 text-center">
          <p class="text-drama text-2xl sm:text-3xl text-cream/30 mb-4">
            Ready to ignite?
          </p>
          <h2
            class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold
                   tracking-tighter-custom text-cream mb-8"
          >
            Start Building<span class="text-clay">.</span>
          </h2>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/register" class="btn-primary !px-10 !py-4 !text-base">
              <span class="btn-slide"></span>
              <span class="btn-label">Create Account</span>
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

        <!-- Middle Section — Links Grid -->
        <div class="py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
          <!-- Brand Column -->
          <div>
            <a routerLink="/" class="font-heading font-extrabold text-2xl tracking-tighter-custom text-cream">
              Blaze<span class="text-clay">.</span>
            </a>
            <p class="text-sm text-cream/30 leading-relaxed mt-4 max-w-xs">
              A collaborative workspace for distributed teams — built to explore
              AI-assisted development on Google Antigravity.
            </p>
          </div>

          <!-- Product — real links only -->
          <div>
            <h4 class="text-data text-cream/40 text-[10px] uppercase tracking-widest mb-5">
              Product
            </h4>
            <ul class="space-y-3">
              <li>
                <a routerLink="/workspace" class="text-sm text-cream/60 hover:text-cream transition-colors">
                  Workspace
                </a>
              </li>
              <li>
                <a routerLink="/register" class="text-sm text-cream/60 hover:text-cream transition-colors">
                  Create Account
                </a>
              </li>
              <li>
                <a routerLink="/login" class="text-sm text-cream/60 hover:text-cream transition-colors">
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          <!-- Roadmap — honest future work -->
          <div>
            <h4 class="text-data text-cream/40 text-[10px] uppercase tracking-widest mb-5">
              On the Roadmap
            </h4>
            <ul class="space-y-3">
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-clay/40"></span>
                <span class="text-sm text-cream/25">Rich Text Editor</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-clay/40"></span>
                <span class="text-sm text-cream/25">Real-Time Collaboration</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-clay/40"></span>
                <span class="text-sm text-cream/25">Document Comments</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-clay/40"></span>
                <span class="text-sm text-cream/25">Tags & Categories</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-clay/40"></span>
                <span class="text-sm text-cream/25">Public Hosting</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="py-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-data text-[11px] text-cream/20">
            &copy; 2026 Blaze. All rights reserved.
          </p>
          <div class="flex items-center gap-6">
            <a href="https://github.com/RajVamsee/blaze" target="_blank" rel="noopener"
               class="text-data text-[10px] text-cream/30 hover:text-cream/60 uppercase tracking-widest transition-colors">
              View on GitHub
            </a>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-clay animate-pulse"></div>
              <span class="text-data text-[10px] text-clay/60">Active Development</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('footerSection', { static: true }) footerSection!: ElementRef;
  @ViewChild('ctaBlock', { static: true }) ctaBlock!: ElementRef;

  private ctx!: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.ctaBlock.nativeElement, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.ctaBlock.nativeElement,
          start: 'top 85%',
        },
      });
    }, this.footerSection.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

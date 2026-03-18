import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      #navBar
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[100]
             flex items-center gap-1 px-3 py-2
             rounded-full border border-transparent
             transition-all duration-500 ease-magnetic"
      [class]="scrolled
        ? 'bg-cream/60 backdrop-blur-xl border-charcoal/10 shadow-organic'
        : 'bg-transparent'"
    >
      <!-- Brand -->
      <a
        routerLink="/"
        class="flex items-center gap-1.5 px-4 py-1.5 rounded-full
               font-heading font-extrabold text-lg tracking-tighter-custom
               transition-colors duration-300"
        [class]="scrolled ? 'text-charcoal' : 'text-cream'"
      >
        Blaze<span class="text-clay">.</span>
      </a>

      <!-- Divider -->
      <div
        class="w-px h-5 mx-1 transition-colors duration-300"
        [class]="scrolled ? 'bg-charcoal/15' : 'bg-cream/20'"
      ></div>

      <!-- Nav Links -->
      <a
        routerLink="/workspace"
        routerLinkActive="!text-clay"
        class="px-4 py-1.5 rounded-full text-sm font-heading font-medium
               transition-all duration-300 ease-magnetic
               hover:bg-charcoal/5"
        [class]="scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-cream/70 hover:text-cream'"
      >
        Workspace
      </a>
      <a
        routerLink="/admin"
        routerLinkActive="!text-clay"
        class="px-4 py-1.5 rounded-full text-sm font-heading font-medium
               transition-all duration-300 ease-magnetic
               hover:bg-charcoal/5"
        [class]="scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-cream/70 hover:text-cream'"
      >
        Admin
      </a>

      <!-- CTA -->
      <a
        routerLink="/login"
        class="btn-magnetic ml-2 !px-5 !py-1.5 !text-xs bg-clay text-cream"
      >
        <span class="btn-slide bg-clay-dark"></span>
        <span class="btn-label">Sign In</span>
      </a>
    </nav>
  `,
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navBar', { static: true }) navBar!: ElementRef<HTMLElement>;
  scrolled = false;
  private ctx!: gsap.Context;
  private scrollHandler!: () => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from(this.navBar.nativeElement, {
        y: -40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
    });

    this.ngZone.runOutsideAngular(() => {
      this.scrollHandler = () => {
        const past = window.scrollY > 50;
        if (past !== this.scrolled) {
          this.ngZone.run(() => {
            this.scrolled = past;
          });
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    window.removeEventListener('scroll', this.scrollHandler);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from './sections/hero/hero.component';
import { FeaturesComponent } from './sections/features/features.component';
import { PhilosophyComponent } from './sections/philosophy/philosophy.component';
import { ProtocolComponent } from './sections/protocol/protocol.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    PhilosophyComponent,
    ProtocolComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar />
    <app-hero />
    <app-features />
    <app-philosophy />
    <app-protocol />
    <app-footer />
  `,
})
export class LandingComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/workspace']);
    }
  }
}

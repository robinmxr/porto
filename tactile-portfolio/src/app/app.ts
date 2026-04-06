import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';

import { TopNav } from './components/top-nav/top-nav';
import { BottomNav } from './components/bottom-nav/bottom-nav';
import { routeTransitionAnimations } from './app.animations';
import { ViewportService } from './viewport.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { GlitchOverlayComponent } from './components/glitch-overlay/glitch-overlay';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TopNav, 
    BottomNav,
    RouterOutlet,
    CommonModule,
    GlitchOverlayComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [routeTransitionAnimations]
})
export class App {
  protected readonly title = signal('SYS_ORCHESTRATOR');
  protected readonly viewport = inject(ViewportService);
  protected readonly isTransitioning = signal(false);

  constructor(
    private contexts: ChildrenOutletContexts,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isTransitioning.set(true);
      } else if (
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      ) {
        // Delay slightly for dramatic effect
        setTimeout(() => this.isTransitioning.set(false), 400);
      }
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}

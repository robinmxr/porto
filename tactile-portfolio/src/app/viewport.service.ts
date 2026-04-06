import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  private readonly platformId = inject(PLATFORM_ID);
  
  // Terminal Dashboard switches to mobile view below 1024px
  // based on the current desktop layout requirements
  private readonly mobileQuery = '(max-width: 1023px)';
  
  readonly isMobile = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const mql = window.matchMedia(this.mobileQuery);
      this.isMobile.set(mql.matches);
      
      mql.addEventListener('change', (e) => {
        this.isMobile.set(e.matches);
      });
    }
  }
}

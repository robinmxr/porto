import { Component, inject, signal, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewportService } from '../../viewport.service';

import { CentralNode } from '../../components/central-node/central-node';
import { StatsCluster } from '../../components/stats-cluster/stats-cluster';
import { TechArsenal } from '../../components/tech-arsenal/tech-arsenal';
import { EvolutionLog } from '../../components/evolution-log/evolution-log';
import { ActiveRepos } from '../../components/active-repos/active-repos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CentralNode, 
    StatsCluster, 
    TechArsenal, 
    EvolutionLog, 
    ActiveRepos
  ],
  templateUrl: './home.html',
})
export class Home {
  protected readonly viewport = inject(ViewportService);
  @ViewChildren('sectionNode') sections!: QueryList<ElementRef>;
  
  protected readonly activeSectionIndex = signal(0);
  protected readonly scrollProgress = signal(0);
  private scrollListener?: () => void;

  ngAfterViewInit() {
    if (this.viewport.isMobile()) {
      const container = document.querySelector('.mobile-scroll-container');
      if (container) {
        this.scrollListener = () => {
          this.calculateFocus(container as HTMLElement);
        };
        container.addEventListener('scroll', this.scrollListener, { passive: true });
        // Initial calculation
        setTimeout(() => this.calculateFocus(container as HTMLElement), 100);
      }
    }
  }

  ngOnDestroy() {
    const container = document.querySelector('.mobile-scroll-container');
    if (container && this.scrollListener) {
      container.removeEventListener('scroll', this.scrollListener);
    }
  }

  private calculateFocus(container: HTMLElement) {
    const centerY = container.scrollTop + container.clientHeight / 2;
    let minDistance = Infinity;
    let activeIdx = 0;

    this.sections.forEach((section, index) => {
      const rect = section.nativeElement.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = container.clientHeight / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      // Store transform data on the element for CSS to pick up if needed, 
      // but let's use signals for the overall active state
      if (distance < minDistance) {
        minDistance = distance;
        activeIdx = index;
      }
    });

    if (this.activeSectionIndex() !== activeIdx) {
      this.activeSectionIndex.set(activeIdx);
    }
    
    this.scrollProgress.set(container.scrollTop / (container.scrollHeight - container.clientHeight));
  }
}

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PROJECT_CARDS, ProjectCardData } from './project-cards.data';
import { INFO } from '../../data/info';

type FilterCategory = 'about' | 'work' | null;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class Projects {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly activeFilter = signal<FilterCategory>(null);
  protected readonly isDark = signal(true);
  protected readonly info = INFO;
  protected readonly profile = INFO.profile;
  protected readonly links = INFO.links;
  protected readonly culture = INFO.culture;
  protected readonly projectCards: ProjectCardData[] = PROJECT_CARDS;
  protected readonly skillGroups = Object.entries(INFO.skills).map(([label, items]) => ({ label, items }));
  protected readonly introSkills = this.skillGroups.flatMap(group => group.items).slice(0, 8);
  protected readonly featuredExperience = INFO.experience.slice(0, 2);

  constructor() {
    this.initTheme();
  }

  protected toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  private initTheme(): void {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    this.isDark.set(dark);
    this.document.documentElement.classList.toggle('dark', dark);
  }

  protected filterCards(category: FilterCategory): void {
    const grid = this.document.querySelector<HTMLElement>('.grid');
    if (!grid) { this.activeFilter.set(category); return; }

    const cards = [...grid.querySelectorAll<HTMLElement>(':scope > .card')];
    const before = cards.map(el => el.getBoundingClientRect());

    this.activeFilter.set(category);

    requestAnimationFrame(() => {
      const moved: HTMLElement[] = [];
      cards.forEach((el, i) => {
        const after = el.getBoundingClientRect();
        const dx = before[i].left - after.left;
        const dy = before[i].top  - after.top;
        if (dx === 0 && dy === 0) return;
        el.style.transition = 'none';
        el.style.transform  = `translate(${dx}px, ${dy}px)`;
        moved.push(el);
      });

      requestAnimationFrame(() => {
        moved.forEach((el, i) => {
          const delay = i * 18;
          el.style.transition = `transform 0.55s ${delay}ms cubic-bezier(0.34, 1.2, 0.64, 1)`;
          el.style.transform  = '';
          el.addEventListener('transitionend', () => { el.style.transition = ''; }, { once: true });
        });
      });
    });
  }

  protected cardOrder(category: 'about' | 'work'): number {
    const f = this.activeFilter();
    return (f === null || f === category) ? 0 : 1;
  }

  protected isMuted(category: 'about' | 'work'): boolean {
    const filter = this.activeFilter();
    return filter !== null && category !== filter;
  }

  protected viewProject(id: string): void {
    this.router.navigate(['/project', id]);
  }
}

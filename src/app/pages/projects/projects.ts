import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECT_CARDS, ProjectCardData } from './project-cards.data';
import { INFO } from '../../data/info';

type ViewId = 'hero' | 'projects' | 'experience' | 'skills' | 'about' | 'contact' | null;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly isDark = signal(true);
  protected readonly info = INFO;
  protected readonly profile = INFO.profile;
  protected readonly links = INFO.links;
  protected readonly culture = INFO.culture;
  protected readonly projectCards: ProjectCardData[] = PROJECT_CARDS;
  protected readonly skillGroups = Object.entries(INFO.skills).map(([label, items]) => ({ label, items }));
  protected readonly experience = INFO.experience;
  protected readonly modalId = signal<string | null>(null);
  protected readonly selectedCard = computed(() => {
    const id = this.modalId();
    return id ? this.projectCards.find(c => c.id === id) ?? null : null;
  });
  protected readonly activeView = signal<ViewId>(null);

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

  protected isSectionVisible(section: string): boolean {
    const view = this.activeView();
    if (view === null) return true;
    if (view === 'about') return section === 'hero' || section === 'about';
    if (view === 'experience') return section === 'status' || section === 'experience';
    return section === view;
  }

  protected sectionOrder(id: string): number {
    const view = this.activeView();
    if (view === null) return 0;
    if (view === 'about') return (id === 'hero' || id === 'about') ? 0 : 1;
    if (view === 'experience') return (id === 'status' || id === 'experience') ? 0 : 1;
    return id === view ? 0 : 1;
  }

  private flip(items: HTMLElement[], oldRects: DOMRect[]): void {
    if (items.length === 0) return;

    requestAnimationFrame(() => {
      const anims: { el: HTMLElement; dx: number; dy: number }[] = [];

      items.forEach((el, i) => {
        const now = el.getBoundingClientRect();
        const dx = oldRects[i].left - now.left;
        const dy = oldRects[i].top - now.top;
        if (dx !== 0 || dy !== 0) {
          anims.push({ el, dx, dy });
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });
      if (anims.length === 0) return;

      void this.document.body.offsetHeight;

      requestAnimationFrame(() => {
        anims.forEach(({ el, dx, dy }) => {
          const anim = el.animate([
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: 'none' },
          ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
          anim.finished.then(() => {
            el.style.transform = '';
            anim.cancel();
          }).catch(() => {});
        });
      });
    });
  }

  protected navClick(id: string): void {
    const grid = this.document.querySelector<HTMLElement>('.grid');
    const items = grid ? Array.from(grid.children) as HTMLElement[] : [];
    const oldRects = items.map(el => el.getBoundingClientRect());

    const nextView: ViewId = id === 'hero' ? null : this.activeView() === id ? null : id as ViewId;
    this.activeView.set(nextView);
    this.flip(items, oldRects);

    setTimeout(() => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = this.document.querySelector<HTMLElement>(`#${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 550);
  }

  protected openModal(id: string): void {
    this.modalId.set(id);
  }

  protected closeModal(): void {
    this.modalId.set(null);
  }

  protected viewProject(id: string): void {
    this.closeModal();
    this.router.navigate(['/project', id]);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.modalId()) {
        this.closeModal();
      } else if (this.activeView()) {
        const grid = this.document.querySelector<HTMLElement>('.grid');
        const items = grid ? Array.from(grid.children) as HTMLElement[] : [];
        const oldRects = items.map(el => el.getBoundingClientRect());
        this.activeView.set(null);
        this.flip(items, oldRects);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}

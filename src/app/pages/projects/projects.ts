import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PROJECT_CARDS, ProjectCardData } from './project-cards.data';
import { INFO } from '../../data/info';

type ViewId = 'hero' | 'projects' | 'experience' | 'skills' | 'about' | 'contact' | null;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  imports: [FormsModule],
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
  protected readonly mobileNavOpen = signal(false);

  protected readonly formName = signal('');
  protected readonly formEmail = signal('');
  protected readonly formMessage = signal('');
  protected readonly formStatus = signal<'idle' | 'sending' | 'sent'>('idle');

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

  private flip(items: HTMLElement[], oldRects: DOMRect[]): Promise<void> {
    if (items.length === 0) return Promise.resolve();

    return new Promise(resolve => {
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
        if (anims.length === 0) { resolve(); return; }

        void this.document.body.offsetHeight;

        requestAnimationFrame(() => {
          const promises: Promise<void>[] = [];
          anims.forEach(({ el, dx, dy }) => {
            const anim = el.animate([
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: 'none' },
            ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
            promises.push(anim.finished.then(() => {
              el.style.transform = '';
              anim.cancel();
            }).catch(() => {}));
          });
          Promise.all(promises).then(() => resolve());
        });
      });
    });
  }

  protected toggleMobileNav(event: Event): void {
    event.stopPropagation();
    this.mobileNavOpen.update(v => !v);
  }

  protected closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  protected submitContact(): void {
    if (!this.formName() || !this.formEmail() || !this.formMessage()) return;
    this.formStatus.set('sending');
    setTimeout(() => {
      this.formStatus.set('sent');
      this.formName.set('');
      this.formEmail.set('');
      this.formMessage.set('');
      setTimeout(() => this.formStatus.set('idle'), 3000);
    }, 1200);
  }

  protected navClick(id: string): void {
    this.closeMobileNav();
    const grid = this.document.querySelector<HTMLElement>('.grid');
    const items = grid ? Array.from(grid.children) as HTMLElement[] : [];

    const nextView: ViewId = id === 'hero' ? null : this.activeView() === id ? null : id as ViewId;

    const oldRects = items.map(el => el.getBoundingClientRect());
    this.activeView.set(nextView);
    this.flip(items, oldRects).then(() => {
      if (id === 'hero') {
        window.scrollTo({ top: 0 });
      } else if (nextView) {
        const target = id === 'experience' ? 'status' : id === 'about' ? 'hero' : id;
        const el = this.document.querySelector<HTMLElement>(`#${target}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const topbar = this.document.querySelector<HTMLElement>('.mobile-topbar');
          const topbarHeight = topbar?.offsetHeight ?? 0;
          const navbar = this.document.querySelector<HTMLElement>('.navbar');
          const offset = topbarHeight > 0 ? topbarHeight : (navbar?.offsetHeight ?? 0);
          if (rect.top < offset || rect.bottom > window.innerHeight) {
            window.scrollBy({ top: rect.top - offset - 20, behavior: 'smooth' });
          }
        }
      }
    });
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
        this.flip(items, oldRects).then(() => {
          window.scrollTo({ top: 0 });
        });
      }
    }
  }
}

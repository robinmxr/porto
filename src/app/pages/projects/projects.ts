import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECT_CARDS, ProjectCardData } from './project-cards.data';
import { INFO } from '../../data/info';

type SectionId = 'experience' | 'studies' | 'work' | 'skills' | 'about' | 'contact';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly document = inject(DOCUMENT);

  protected readonly isDark = signal(this.document.documentElement.classList.contains('dark'));
  protected readonly info = INFO;
  protected readonly profile = INFO.profile;
  protected readonly links = INFO.links;
  protected readonly culture = INFO.culture;
  protected readonly projectCards: ProjectCardData[] = PROJECT_CARDS;
  protected readonly skillGroups = INFO.skills;
  protected readonly secondarySkills = INFO.secondarySkills;
  protected readonly experience = INFO.experience;
  protected readonly focusAreas = INFO.profile.focus.split('·').map(s => s.trim());
  protected readonly caseStudies = INFO.caseStudies;
  protected readonly year = new Date().getFullYear();

  protected readonly sections: { id: SectionId; label: string }[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'studies', label: 'Case studies' },
    { id: 'work', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  protected readonly activeSection = signal<SectionId | null>(null);
  protected readonly scrolled = signal(false);
  protected readonly expandedRole = signal<number | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) return;

      const onScroll = () => this.scrolled.set(win.scrollY > 24);
      onScroll();
      win.addEventListener('scroll', onScroll, { passive: true });

      // Track which section is in view for the nav
      const sectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.activeSection.set((entry.target.id || null) as SectionId | null);
        }
      }, { rootMargin: '-45% 0px -50% 0px' });

      // Fade sections in once as they enter the viewport
      const revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        }
      }, { rootMargin: '0px 0px -10% 0px' });

      this.document.querySelectorAll('.section, .hero').forEach(el => sectionObserver.observe(el));
      this.document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

      destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', onScroll);
        sectionObserver.disconnect();
        revealObserver.disconnect();
      });
    });
  }

  protected toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  protected scrollTo(id: string): void {
    const el = this.document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected toggleRole(index: number): void {
    this.expandedRole.update(current => (current === index ? null : index));
  }
}

import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PROJECT_CARDS, ProjectCardData } from '../projects/project-cards.data';
import { INFO } from '../../data/info';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  imports: [RouterLink],
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  protected readonly profile = INFO.profile;

  protected readonly isDark = signal(true);

  constructor() {
    const saved = localStorage.getItem('theme');
    this.isDark.set(saved ? saved === 'dark' : true);
  }

  protected readonly project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    const card = PROJECT_CARDS.find(p => p.id === id) ?? null;
    if (!card) return null;
    const dark = this.isDark();
    return {
      ...card,
      accent: dark ? card.accent : card.lightAccent,
      background: dark ? card.background : card.lightBackground,
      border: dark ? card.border : card.lightBorder,
      text: dark ? card.text : card.lightText,
    };
  });

  protected goBack(): void {
    this.router.navigate(['/']);
  }
}

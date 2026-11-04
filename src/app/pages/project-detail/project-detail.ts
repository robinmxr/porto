import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PROJECT_CARDS } from '../projects/project-cards.data';
import { INFO } from '../../data/info';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  protected readonly profile = INFO.profile;

  protected readonly project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    const card = PROJECT_CARDS.find(p => p.id === id) ?? null;
    if (!card) return null;
    const dark = this.document.documentElement.classList.contains('dark');
    return { ...card, accent: dark ? card.accent : card.lightAccent };
  });

  protected goBack(): void {
    this.router.navigate(['/'], { fragment: 'work' });
  }
}

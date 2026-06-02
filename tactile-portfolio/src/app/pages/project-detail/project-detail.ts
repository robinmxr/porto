import { Component, computed, inject } from '@angular/core';
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
  protected readonly profile = INFO.profile;

  protected readonly project = computed<ProjectCardData | null>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return PROJECT_CARDS.find(p => p.id === id) ?? null;
  });

  protected goBack(): void {
    this.router.navigate(['/']);
  }
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ArchitectureDiagram } from '../../components/architecture-diagram/architecture-diagram';
import { INFO } from '../../data/info';
import { HeroArt } from '../../components/hero-art/hero-art';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.html',
  imports: [RouterLink, ArchitectureDiagram, HeroArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly profile = INFO.profile;
  protected readonly company = INFO.experience[0].company;

  // Param is a signal so "next case study" links re-render the same component
  private readonly id = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));

  protected readonly study = computed(() => INFO.caseStudies.find(c => c.id === this.id()) ?? null);

  protected readonly principles = computed(() =>
    INFO.principles.filter(p => p.caseStudies.includes(this.id() ?? '')),
  );

  protected readonly next = computed(() => {
    const list = INFO.caseStudies;
    const i = list.findIndex(c => c.id === this.id());
    return i === -1 ? null : list[(i + 1) % list.length];
  });

  protected goBack(): void {
    this.router.navigate(['/'], { fragment: 'studies' });
  }
}

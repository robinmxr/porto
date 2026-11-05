import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Decorative line art for detail-page heroes. The variant is the case study or
 * project id, so each page gets an illustration of its own subject.
 * Purely presentational: aria-hidden, no pointer events, hidden on narrow viewports.
 */
@Component({
  selector: 'app-hero-art',
  templateUrl: './hero-art.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hero-art',
    'aria-hidden': 'true',
  },
})
export class HeroArt {
  readonly variant = input<string>('');
}

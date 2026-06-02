import { Injectable, signal, computed, NgZone } from '@angular/core';
import { animate, stagger } from 'animejs';

type AnimeTargets = string | Element | Element[] | NodeList;
type AnimeConfig = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private activeAnimations = signal<any[]>([]);
  public activeCount = computed(() => this.activeAnimations().length);

  constructor(private ngZone: NgZone) {}

  animate(targets: AnimeTargets, config: AnimeConfig): any {
    let animation: any;

    this.ngZone.runOutsideAngular(() => {
      animation = animate(targets as any, config as any);
      this.activeAnimations.update(animations => [...animations, animation]);

      if (animation.finished) {
        animation.finished.then(() => {
          this.activeAnimations.update(animations =>
            animations.filter(a => a !== animation)
          );
        });
      }
    });

    return animation;
  }

  stagger(values: [number, number] | [string, string], options?: {
    from?: number | 'first' | 'last' | 'center' | 'index';
    grid?: [number, number];
    axis?: 'x' | 'y';
    easing?: string;
  }) {
    return stagger(values as any, options as any);
  }

  stop(target?: AnimeTargets) {
    if (target) {
      // animejs v4 uses remove to stop animations on elements
      const anims = this.activeAnimations().filter(a => {
        if (a.targets && Array.isArray(a.targets)) {
          return a.targets.includes(target);
        }
        return false;
      });
      anims.forEach(a => a.pause());
    } else {
      this.activeAnimations().forEach(anim => anim.pause());
      this.activeAnimations.set([]);
    }
  }
}

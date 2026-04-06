import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const routeTransitionAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.97) translateY(10px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('0.3s ease-out', style({ opacity: 0, transform: 'scale(1.03) translateY(-10px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

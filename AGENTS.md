# AGENTS.md — TactilePortfolio

## Quick start

```bash
ng serve            # dev server at localhost:4200
ng build            # production build → dist/
ng test             # Vitest unit tests
ng test --watch     # watch mode
```

`ng serve` before build is fine — no codegen or migration step needed.

## Architecture

- **Angular 21 standalone SPA** — no NgModules, no NgRx, no Signals-based state mgmt beyond local `signal()`/`computed()`
- **Lazy-loaded routes** for `/experience`, `/bio`, `/project/:id` — main `/` is the grid page (`Projects` component)
- **All content is static** — data lives in `src/app/data/info.json`, typed via `PortfolioInfo` in `info.ts`. No API calls, no HttpClient, no database
- **Dark/light theme**: toggled via `.dark` class on `<html>`, persisted to `localStorage['theme']`. All colors are CSS custom properties in `src/styles.scss`
- **Animation**: AnimeJS v4 wrapped in `src/app/animations/anime.service.ts` — always run animations inside `ngZone.runOutsideAngular()`

## Key project structure

```
src/
  main.ts                                # bootstrapApplication(App, appConfig)
  index.html                             # <app-root></app-root>
  styles.scss                            # CSS vars, dark/light, global styles
  app/
    app.ts / app.html / app.scss         # root component — just <router-outlet>
    app.config.ts                        # provideRouter + provideAnimationsAsync
    app.routes.ts                        # '' → Projects, 'experience', 'bio', 'project/:id'
    data/
      info.json                          # ALL portfolio content (profile, projects, experience, skills, culture)
      info.ts                            # TypeScript interfaces + typed export
    animations/
      anime.service.ts                   # AnimeJS wrapper (injectable, providedIn: 'root')
    pages/
      projects/                          # Main grid page (hero + cards + contact)
      experience/                        # Timeline page
      bio/                               # Profile + contact form (mock only, no backend)
      project-detail/                    # Single project view
    components/                          # Empty — shared components go here when created
    services/                            # Empty — services go here when created
```

## Data model

All portfolio data is in `src/app/data/info.json`. Types are in `src/app/data/info.ts`. Key interfaces:

- `PortfolioInfo` — top-level shape
- `Profile` — name, initials, role, headline, summary, location, status, email
- `ExperienceItem` — role, company, period, achievements[], stack[]
- `ProjectCardData` — id, name, type, description, stack[], metrics[], highlights[], background/accent/border/text colors, repoUrl, demoUrl
- `Culture` — music, book, movie (optional taste section)

The file exports `INFO` (typed) and `PROJECT_CARDS`.

## Conventions

- **Standalone components** with `ChangeDetectionStrategy.OnPush`
- **No NgModules** — use `imports` array on `@Component`
- **SCSS** for styling, CSS custom properties for theming
- **Typography**: `'Space Grotesk'` for body, `'Fraunces'` for headings — loaded via Google Fonts in `index.html`
- **Lazy load** page components via `loadComponent()` in routes
- **Prefer `inject()`** over constructor injection
- **No barrel files** — import directly from the source module

## Testing

- Vitest (not Karma/Jasmine — but uses Jasmine-style `describe`/`it`/`expect`)
- Config: `tsconfig.spec.json` includes `"vitest/globals"`
- Run: `ng test` (or `npx vitest` directly if configured)
- Test files co-located: `*.spec.ts` next to source files

## Notes

- The `src/app/components/` and `src/app/services/` directories exist but are empty — agents should add files there when creating reusable components/services
- Contact form on `/bio` is mock only (`setTimeout` + reset) — no real email backend
- Placeholder repo URLs in `info.json` (`https://github.com/your-username/...`) — replace with real URLs
- `album-art/` path in `info.json` resolves from `public/` — `public/album-art/placeholder.svg` should exist
- No internationalization setup yet

# Portfolio Improvement Plan

Goal: position the site as a **backend / distributed-systems engineer** portfolio. The research behind this plan
(Kleppmann, Brendan Gregg, Marc Brooker, Brittany Chiang, backend-portfolio write-ups) points to three things that
get interviews: **architecture diagrams**, **a number on every project**, and **one working proof per project**.

Legend: 🧑 = needs your input/content · 🤖 = pure code, can be done any time · Effort: Trivial / Small / Medium / Large

---

## Where we left off (2026-11-04)

- [ ] **Commit the redesign.** Everything below "Done" is still uncommitted on `main`.
- Visual design is settled: navy/brass palette, Archivo (expanded headings), editorial single page.
  Don't restyle further until the content phases are done.
- Section order: Hero → 01 Experience → 02 Projects → 03 Skills → 04 About → 05 Contact.

### Done
- [x] Redesign: removed bento grid, background decor, custom cursor, modal, FLIP filter
- [x] Navy & brass palette (light + dark), Archivo font, no monospace
- [x] Experience moved above Projects; section renamed "Projects"
- [x] Hero credibility line + backend-first focus areas
- [x] Experience: headline figures per role, bold outcome leads on each contribution, styled details panel
- [x] Projects: proof figure per row, Case study / Live / Source links
- [x] Skills regrouped into 6 backend groups (core vs. supporting), frontend demoted to one line
- [x] Old #4 "Reorder About" — certifications/education now sit above "Off the clock"
- [x] Old #3 "Professional context in hero" — covered by status line, credibility line and "At a glance" column

---

## Phase 1.4 — Reposition as a distributed backend engineer 🧑🤖

**Master brief: `recon.md`** (private, gitignored — never commit). Start every session from its §10 roadmap.

- [ ] Read `recon.md` §1 (positioning) and §2 (public rules: no client name, "Designed and built")
- [x] Phase A: apply hero, experience, skills and About copy from `recon.md` §7; remove the ❌ claims in §3.3
- [x] Phase B: diagram component + "How I build" section + work case studies (`recon.md` §6, §7.5, §8)
- [ ] Phase C: public demo repo reproducing the patterns + first notes (`recon.md` §9, §10C)
- [ ] Phase D: align résumé, LinkedIn, GitHub README (`recon.md` §10D)
- [ ] Answer the open questions in `recon.md` §11 (Kafka incident, K8s ownership, production numbers)

## Phase 1.6 — Side projects: verify against the code, then document 🧑🤖

Rule learned from SNOMED: **the portfolio claimed pgvector/semantic search and a tsvector table that the side-project
code doesn't have** (the tsvector table is in work code). Every side-project claim must be checked against its repo
before it stays on the site.

### ⚠️ 0. Clean up the public SNOMED repo first 🧑 (urgent, do before linking it anywhere)
- **What:** `github.com/robinael/datamapping` is **public** and tracks `src/SnomedSearch.Console/.env`, which holds
  database credentials and values containing the work client's name. It also tracks `bin/` and `obj/` build output,
  and the code's DB-name defaults use the client name.
- **Steps:**
  - [ ] Make the repo private now (GitHub → Settings → Danger zone), or at minimum stop treating it as public
  - [ ] Rotate that database password if it was ever used outside your laptop
  - [ ] Remove `.env`, `bin/`, `obj/` from tracking; add a `.gitignore`; replace client-named defaults with neutral ones (`snomed`)
  - [ ] Purge history (`git filter-repo --path src/SnomedSearch.Console/.env --invert-paths`, plus bin/obj), force-push
  - [ ] Add a README: what it does, how to load the SNOMED CT RF2 release, `CREATE EXTENSION pg_trgm`, example queries
  - [ ] Only then set `repoUrl` for `snomed-search-api` in `info.json`
- **Done (2026-11-04):** portfolio entry rewritten from the code (`~/Work/robin/datamapping`): ranked word-order-independent
  search, pg_trgm fuzzy fallback, IS-A hierarchy, paged endpoint, console client; two diagrams on `/project/snomed-search-api`.
- **Optional upgrades that would make it stronger** (would be true claims afterwards):
  - [ ] Add a `pg_trgm` GIN index and measure p50/p95 latency on the full release → real "sub-second" number
  - [ ] Expose hierarchy/details endpoints in the API (repository already supports them; only search is routed)
  - [ ] Add tests (Testcontainers Postgres with a small RF2 fixture) — currently none
  - [ ] If you want "semantic search": actually add pgvector embeddings, then reinstate the claim

### A. mypaw — Pet Healthcare Platform 🧑🤖
- **What:** Same treatment as SNOMED. Current claims to verify: modular monolith on .NET 8 + Angular, PostgreSQL +
  pgvector semantic search, RAG triage (Ollama embeddings + Gemini API), Compose → Kubernetes migration with
  hand-written manifests, CI/CD, Serilog/Graylog/Zipkin.
- **Steps:**
  - [ ] Tell Claude where the repo lives (local path / GitHub URL)
  - [ ] Claude reads the code and builds a claims table: ✅ verified / ❌ not found (like `recon.md` §3)
  - [ ] Rewrite `description`, `highlights`, `focusAreas`, `stack`, `metrics`, `proof` from the verified facts only
  - [ ] Add 1–2 `diagrams` (architecture + RAG triage pipeline) — rendered automatically on `/project/mypaw-petcare`
  - [ ] Find one real number (modules, k8s services, retrieval top-k / latency, test count) for `proof`
  - [ ] Check the repo is safe to make public (no `.env`, keys, client names); then set `repoUrl`
- **Effort:** Small–Medium (one session)

### B. The Algomist — DSA Journey 🧑🤖
- **What:** Same treatment. Current claims to verify: React + TypeScript + Tailwind, structured DSA routine,
  AI-generated topic breakdowns via Grok, difficulty progression, progress tracking; live at thealgomist.netlify.app.
- **Steps:**
  - [ ] Tell Claude where the repo lives
  - [ ] Verify each claim against the code (where does Grok get called — client or a serverless function? where is progress stored?)
  - [ ] Rewrite the entry from verified facts; add a small diagram if there's a real data flow worth showing
  - [ ] Real number for `proof`: topics/problems covered, or Netlify analytics visits
  - [ ] Decide positioning: it's a frontend/AI project, so keep it last in Projects or move it to an "Experiments" line
    so it doesn't dilute the backend story
  - [ ] Check for exposed API keys (a Grok key in client code would be public on Netlify); set `repoUrl` if clean
- **Effort:** Small

## Phase 1.5 — Real numbers (do this first, it's the cheapest win)

### 1. Replace placeholder figures with real ones 🧑
- **What:** Swap qualitative proofs for measured numbers. Ballparks are fine ("~350k concepts", "p95 ~120 ms").
- **Why:** "A number on every project" is the single biggest differentiator for backend portfolios.
- **Where:** `src/app/data/info.json` → `projects[].proof`, `projects[].metrics`, `experience[].figures`
- **Effort:** Trivial (data entry) — the hard part is digging up the numbers
- **Status:** Pending
- Numbers to find:
  - [ ] **SNOMED API:** active concepts/descriptions loaded, p50/p95 search latency (exact and fuzzy path) — see 1.6 §0 upgrades
  - [ ] **mypaw:** number of modules, services in the k8s deployment, RAG retrieval latency or top-k, test count
  - [ ] **Algomist:** topics/problems covered, users or visits (Netlify analytics)
  - [ ] **Adaptive Enterprise:** bookings/appointments per day, services in the platform, latency or uptime, test count/coverage
  - [ ] **Teton / ConnexPay:** transactions/day or volume, API count, query speed-ups from the optimisation work
- **Done when:** every project row and every role shows at least one real number. Replace the `metrics` on detail
  pages ("Full", "Web", "Grok" are labels, not metrics).

### 2. Fill empty project links 🧑 *(was old #2)*
- **What:** Add `repoUrl` / `demoUrl` for mypaw and SNOMED. If a repo is private, say so (see task 7, "Proof" block).
- **Why:** At least one clickable, working proof per project.
- **Where:** `info.json` → `projects[]`
- **Effort:** Trivial
- **Status:** Pending
- [ ] mypaw repo / demo
- [ ] SNOMED repo — **blocked on Phase 1.6 §0 cleanup** (public repo currently exposes credentials)
- [ ] Algomist repo (demo already set)

---

## Phase 2 — Project pages become case studies

Target structure for `/project/:id`:
**Hero → Key figures → The problem → Architecture (diagram) → Key decisions & trade-offs → What was built → Stack → Links**

### 3. Write case-study content 🧑
- **What:** For each project, write:
  - [ ] `problem` — 1–2 sentences: who has the problem, why it matters
  - [ ] `decisions` — 2–3 trade-offs, each `{ choice, why }` (e.g. "pgvector over a dedicated vector DB — one less service to run, joins with relational data")
  - [ ] `results` — 1–2 outcome sentences, ideally with numbers from task 1
- **Why:** Trade-off reasoning is the senior-engineer signal; this is what Kleppmann/Brooker-style writing shows.
- **Where:** `info.json` → new fields on `projects[]`
- **Effort:** Small per project (writing)
- **Status:** Pending — Claude can draft from the existing descriptions for you to correct

### 4. Extend the data model 🤖
- **What:** Add to `ProjectCardData` in `info.ts`:
  ```ts
  problem: string;
  decisions: { choice: string; why: string }[];
  results: string[];
  architecture: {
    nodes: { id: string; label: string; kind: 'client' | 'service' | 'store' | 'queue' | 'external'; col: number; row: number }[];
    edges: { from: string; to: string; label?: string }[];
  };
  ```
- **Where:** `src/app/data/info.ts`, `info.json`
- **Effort:** Small
- **Status:** Partly done — `diagrams?: Diagram[]` exists on projects (and case studies). `problem` / `decisions` /
  `results` for side projects still pending.

### 5. Build the architecture diagram component 🤖
- **What:** `src/app/components/architecture-diagram/` — standalone, OnPush. Takes `architecture` as input and renders
  an inline SVG of boxes and arrows on a simple column/row grid (no layout library).
- **Design spec:**
  - Hairline boxes (`--rule-strong`), labels in Archivo, small uppercase kind label (CLIENT / SERVICE / STORE…)
  - Stores drawn with a cylinder-ish top edge or double rule; queues with a notched edge — keep it subtle
  - Arrows in `--muted`, edge labels small; the project's accent colour highlights the "core" node
  - Uses CSS vars so it works in light and dark mode automatically
  - Horizontal scroll inside its own container on mobile (never the page); add `role="img"` + `aria-label` summary
  - Optional polish: nodes fade in left→right on reveal (CSS only, respect `prefers-reduced-motion`)
- **Effort:** Medium
- **Status:** Done (Phase B) — used by `/work/:id` and `/project/:id`
- [x] Component + unit test (renders N nodes / N edges)
- [ ] Draft diagrams 🧑 (correct the drafts):
  - [ ] **mypaw:** Angular SPA → .NET 8 modular monolith (modules) → PostgreSQL + pgvector; Ollama (embeddings) + Gemini API (answers) for RAG triage; Serilog → Graylog, Zipkin; k8s
  - [x] **SNOMED API:** search pipeline + architecture diagrams, drawn from the actual code
  - [ ] **Algomist:** React SPA → Grok AI for topic breakdowns → local progress store (confirm actual setup)

### 6. Restructure the project detail page 🤖
- **What:** Rebuild `project-detail.html` into the case-study order above, using the new fields and the diagram component.
  Number the sections (01 Problem, 02 Architecture, 03 Decisions, 04 What was built, 05 Stack).
- **Where:** `src/app/pages/project-detail/project-detail.{html,ts}`, `src/styles.scss` (detail block)
- **Effort:** Medium
- **Status:** Pending (depends on 4, 5)
- [ ] "Decisions" styled as a two-column list: choice (bold) / why (muted)
- [ ] "Next project →" link at the bottom to keep people moving
- [ ] Make the accent colour react to theme toggle (currently read once from `<html>` at load)

### 7. "Proof" block for private work 🤖
- **What:** When `repoUrl` is empty, show a quiet note: "Source is private — happy to walk through it on a call" + email link.
- **Why:** Turns a missing link into an invitation instead of a gap.
- **Where:** detail page + optionally the project row
- **Effort:** Trivial
- **Status:** Pending

---

## Phase 3 — Writing (optional, high signal)

### 8. Notes section 🧑🤖
- **What:** Brooker-style dated list of short technical write-ups. Home page shows the latest 3; `/notes/:slug` renders one.
- **Why:** Writing about real systems is the strongest backend signal there is, and almost nobody's portfolio has it.
- **Where:** new `src/app/pages/notes/`, content as Markdown in `src/app/data/notes/` (or `public/notes/`), route in `app.routes.ts`
- **Effort:** Medium (code) + writing time
- **Status:** Pending — decide if you want it
- Post ideas, in order of impact:
  - [ ] **Postmortem: the Kafka disk-space incident** — timeline, root cause (log retention / volume sizing), fix, what changed after
  - [ ] **Designing a slot-hold lifecycle** — race conditions in concurrent booking and the convergent release mechanisms
  - [ ] **Lexical + semantic search in one Postgres** — tsvector vs. pgvector, how you combine them
  - [ ] **Compose → Kubernetes for a modular monolith** — what hand-writing manifests taught you
- Code tasks:
  - [ ] Markdown rendering (e.g. `marked` at build time, or pre-rendered HTML) — keep it static, no backend
  - [ ] Note page typography: 66ch column, code blocks, captions
  - [ ] Add "Notes" to nav and as a numbered section between Projects and Skills

### 9. Public API docs for SNOMED 🧑
- **What:** Host a read-only Scalar/Swagger page (or a static OpenAPI render) for the SNOMED API.
- **Why:** "API-first showcase": the closest thing a backend project has to a screenshot.
- **Effort:** Small–Medium (depends on hosting the API or just the spec)
- **Status:** Pending

### 10. "Currently building" line *(was old #5)* 🧑🤖
- **What:** One line in the hero aside ("Currently building — …") with a link, updated by hand.
- **Why:** Shows momentum. Keep it to one line; a whole section would be too heavy.
- **Where:** `info.json` (new `profile.building` field) + hero aside in `projects.html`
- **Effort:** Trivial
- **Status:** Pending

---

## Phase 4 — Polish & launch

### 11. SEO & sharing 🤖
- [ ] `<meta name="description">`, Open Graph + Twitter card tags, canonical URL in `src/index.html`
- [ ] OG image (1200×630) in the site style: name + credibility line, navy/brass
- [ ] Per-route `<title>` via Angular `Title` service (project pages: "SNOMED CT Clinical Search API — Robin Islam")
- [ ] Favicon in brass monogram ("RI") to replace the default Angular one
- [ ] `sitemap.xml` + `robots.txt` in `public/`
- **Effort:** Small

### 12. Quality pass 🤖
- [ ] Lighthouse: aim for 95+ on Performance, Accessibility, Best Practices, SEO
- [ ] Keyboard-only walkthrough (focus states, Details toggle, skip link to main content)
- [ ] Check contrast of `--faint` text on both backgrounds (WCAG AA for small text)
- [ ] Mobile nav: sections are hidden < 640px — consider a compact menu or a "Jump to" select
- [ ] Test on real phone widths (360 / 390 / 430) and Safari
- **Effort:** Small–Medium

### 13. Contact *(old #1, now changed)* 🧑
- **What:** The mock form was removed in the redesign; contact is a `mailto:` link. Decide:
  - [ ] Keep mailto only (simplest, recommended), **or**
  - [ ] Add a real form via Formspree/EmailJS — only if it actually sends
- **Effort:** Trivial / Small
- **Status:** Decision pending

### 14. Deploy 🤖
- [ ] Netlify config (`netlify.toml`, SPA redirect `/* /index.html 200`) for `robinislam.netlify.app` or a custom domain
- [ ] Update `links.website` if the domain changes
- **Effort:** Small

---

## Cleanup / tech debt 🤖

- [ ] `AnimeService` (`src/app/animations/`) and the `animejs` dependency are unused — remove, or use them for diagram reveals (task 5)
- [ ] `provideAnimationsAsync()` in `app.config.ts` is unused (no Angular animations) — remove with `@angular/animations`
- [ ] Unused project fields in `info.json`: `background`, `border`, `text`, `lightBackground`, `lightBorder`, `lightText`; `culture.music.albumArtUrl` — drop from JSON + `info.ts`
- [ ] `pages/projects/project-cards.data.ts` is a re-export (AGENTS.md says no barrel files) — import from `data/info` directly
- [ ] Root clutter: `portfolio_concept_1_terminal_brutalist.html`, `stitch-desktop.html`, `examples/` — delete or move to a `design-archive/` folder
- [ ] `AGENTS.md` still lists `/experience` and `/bio` routes and a bio contact form — update the architecture/structure sections
- [ ] Tests: add specs for `Projects` (renders sections, toggles details) and `ProjectDetail` (unknown id → not-found)
- [ ] Sync `update.md` (GitHub profile README) with the new positioning: lead with backend, drop "Full-Stack" from the title line

---

## Suggested order for your next sessions

1. **Session 1 (30 min, no code):** commit the redesign, gather numbers (task 1) and links (task 2).
2. **Session 2:** data model + diagram component (tasks 4, 5) with Claude drafting diagrams; you correct them.
3. **Session 3:** write problem/decisions/results (task 3), then rebuild the detail page (task 6, 7).
4. **Session 4:** SEO, quality pass, deploy (tasks 11, 12, 14) and cleanup.
5. **Later:** Notes + the Kafka postmortem (task 8) — the highest-signal item, whenever you have writing time.

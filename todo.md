# Portfolio Improvement Plan

## 1. Contact Form → Real Backend
- **What:** Replace mock `setTimeout` with EmailJS or Formspree
- **Why:** Recruiters clicking "Send" and getting nothing kills credibility
- **Where:** `src/app/pages/projects/projects.ts` (submitContact method)
- **Effort:** Small — ~30 lines of code + service setup
- **Status:** Pending

## 2. Fill Empty Project Links
- **What:** Add real `repoUrl` and `demoUrl` to all projects in `info.json`
- **Why:** Empty links make projects look incomplete
- **Where:** `src/app/data/info.json` (projects array)
- **Effort:** Trivial — just data entry
- **Status:** Pending

## 3. Add Professional Context to Hero
- **What:** Add a "Looking for" / "Open to" tag list below the status badge
- **Why:** Tells recruiters immediately what you want
- **Where:** `info.json` (new `lookingFor` field) + `projects.html` (status card)
- **Effort:** Small — data + template change
- **Status:** Pending

## 4. Reorder About Section
- **What:** Move certifications + education above culture (book/movie/music)
- **Why:** Recruiters care about certs before your taste in music
- **Where:** `projects.html` (about card sections)
- **Effort:** Trivial — HTML reorder
- **Status:** Pending

## 5. Add "Currently Building" Section
- **What:** Add a small section showing what you're actively working on
- **Why:** Shows momentum and current relevance
- **Where:** New card in grid or inline in hero
- **Effort:** Medium — new component or card
- **Status:** Pending

# Recon — Professional presence brief: distributed backend engineer

> **PRIVATE · gitignored · never commit, publish or paste this file anywhere public.**
> It summarises internal employer code. Everything meant for the public is in §7–§9 and is already sanitised.
>
> - **Collected:** 2026-11-04 from the work repos (appointment, payment and telemedicine services; supporting context
>   from the gateway, notification, API reference specs, web portals, mobile app and deployment config).
> - **Not copied:** secrets, hostnames, IPs, patient data. Config is described by shape only.
> - **Purpose:** the single source of truth for rebuilding Robin's portfolio, résumé, LinkedIn and GitHub around
>   **distributed backend engineering**.

---

## How to use this file

1. **Starting a session?** Read §1 (positioning) and §2 (rules), then pick the next unchecked item in §10 (roadmap).
2. **Writing copy?** Use §7. It is pre-written, sanitised and code-backed.
3. **Building a diagram or case study?** Use §6 (diagram specs) and §8 (case studies). §5 has the details behind them.
4. **Need to justify a claim?** Look it up in §3 (claims ledger). If it isn't there, don't publish it.
5. **Re-checking a fact in the work code?** §12 has the source map (private paths, for your eyes only).
6. **Want to grow your credibility as a distributed-systems engineer?** §13 has the gap analysis, quick wins on existing
   projects, and ranked new projects to build.

---

## 1. Positioning

### 1.1 One-liner
> **Backend engineer who builds distributed systems that stay correct under concurrency, retries and failure —
> race-free booking, forgery-safe payments, and secure, encrypted video consultations for a healthcare platform.**

### 1.2 The story in three sentences
1. I design and build backend services where correctness matters more than features: money, medical records, and
   scarce appointment slots.
2. My tools are the fundamentals of distributed systems: database-enforced invariants, optimistic and pessimistic
   concurrency, idempotency, explicit state machines, transactional outboxes and defensive trust boundaries. I prove
   them with tests that actually race on a real database.
3. I also run what I build: containers, Kubernetes (K3s), Kafka, CI/CD, logging and tracing in production.

### 1.3 Lead with vs. support with

| **Lead with** (headline, case studies, figures) | **Support with** (secondary line, skills "more") |
|---|---|
| Concurrency control and race-condition prevention | Kubernetes / K3s, Docker, Docker Swarm |
| Idempotency and exactly-once *effects* over at-least-once delivery | Kafka, RabbitMQ (operated on the platform) |
| State machines and lifecycle design | GitLab CI/CD, SonarQube |
| Reliable messaging (transactional outbox, delivery semantics) | Serilog / Graylog, Zipkin |
| Trust boundaries and verification (payments, tokens) | Azure, AWS |
| Resilience (timeouts, retries, circuit breakers, sweepers) | Frontend: Angular, React, TypeScript |
| Data protection (encryption at rest, PHI-safe logging) | |
| Testing distributed behaviour (real-DB race tests) | |

**Why:** infra keywords are common on CVs. "Eight concurrent patients, exactly one booking, proven on real Postgres"
is rare. Recruiters for senior backend roles screen for the second kind.

---

## 2. Rules for anything public

### 2.1 Naming
- **Never name the client or product.** Describe it as *"a healthcare platform"* or *"a healthcare
  marketplace for online and in-person doctor visits"*.
- The **employer** (Adaptive Enterprise Ltd) is fine to name: it's already on the CV.
- **No colleague names.** Say "my manager" or "the team" if needed.

### 2.2 Authorship wording
- Use **"Designed and built"** (agreed). The team/booking lead was the manager, so avoid "led the team" or "owned".
- Robin is the main implementer by git history:

| Service | Commits by Robin | Changes |
|---|---|---|
| appointment | 387 of 442 | ~+85k / −29k lines |
| payment | 28 of 37 | ~+15k lines |
| telemedicine | 72 of 91 | ~+18k lines code, ~10k docs |

- Robin also wrote most of the contract and design docs. *"Wrote the service contracts and design docs"* is a fair claim.

### 2.3 Never publish
- **Code, screenshots or excerpts** from work repos: configs, CI files, docs, logs, API collections. Several contain
  credentials, some of them in git history. 👉 Raise privately with the team: rotation of some is still pending.
- **Internal topology:** service names, ports, hosts, gateway routes, identity-provider URLs, tracing endpoints.
- **Ticket codes and internal decision or risk IDs.** Paraphrase the reasoning instead.
- **Open security gaps**, at most "hardening work", never itemised:
  - in-cluster trust without service authentication
  - peer-asserted identity headers
  - Swagger in prod
  - an IDOR on schedules
  - the legacy open-room token mint
  - both call parties holding publisher rights
  - no read-audit trail
  - no consent gate yet
  - PHI sent to the LLM (approved for dev only)
  - the payment bypass flag once enabled in staging/prod
  - unmasked SMS bodies in logs
- **Business numbers:** fee and VAT math, fail-open default fee, receipt and finance placeholders.
- **Known bugs:** e.g. the mobile app's payment-return URL prefix is stale after the payment extraction.

### 2.4 Diagrams
Generic labels only ("Appointment service", "Payment gateway (SSLCommerz)", "Video provider (Agora)"). Naming public
vendors (SSLCommerz, Agora, Keycloak, Postgres) is fine. Internal service names and topology are not.

---

## 3. Claims ledger

**Legend:** ✅ = verified in code · 🟡 = real, but not in service code (ops/infra work, user-confirmed) · ❌ = not supported.
Remove ❌ items or reword them as shown.

### 3.1 ✅ Verified in code (publish freely, using §7 wording)
- Race-free booking:
  - partial unique index (first-come-first-served)
  - `xmin` optimistic concurrency
  - transaction-scoped advisory locks
  - `SKIP LOCKED` sweeps
- Real-Postgres race tests:
  - 8 patients on 1 slot → 1 booking
  - 3-seat session → 3 seats
  - duplicate callbacks → 1 confirm
  - payment vs. sweep → never confirms an expired booking
- Slot-hold lifecycle: 5-min hold, fresh 10-min payment window, max 3 checkout attempts, 8 release paths into a terminal `Expired`.
- Layered idempotency:
  - idempotency keys
  - unique-index backstop
  - duplicate → 200 no-op
  - `X-Idempotency-Key` replay filter
  - cross-service dedupe
- Payment:
  - server-to-server re-validation
  - split validity vs. transaction-match flags (anti-forgery)
  - advisory-locked session creation
  - anchor row
  - retrying outcome reporter
  - raw payloads kept for reconciliation
- Telemedicine:
  - appointment-scoped, server-derived Agora RTC/RTM/screen tokens
  - join window
  - expiry pinned to slot end + 10 min
- Transcripts:
  - AES-256-GCM encryption
  - purpose-bound associated data
  - key ring with rotation
  - append-only and undeletable
  - server sealing
  - event-driven seal with source re-verification
  - LLM summaries with chunked map-reduce
- PHI-safe logging: hashed ids, redacted `ToString`, tests assert it.
- Transactional outbox with per-channel delivery, backoff, dead letters, Graylog alerting (including a heartbeat whose absence alerts).
- Kafka-ready event contracts with no personal data in payloads.
- SSE live availability fanned out across pods with Postgres `LISTEN/NOTIFY`.
- Polly resilience on all outbound calls: timeouts, retries with backoff, circuit breakers.
- OpenTelemetry → Zipkin with a custom B3 propagator; Serilog → Graylog; k8s health probes.
- Keycloak JWT and RBAC at the gateway; resource-scoped authorisation in services (non-party → 404).
- Clean Architecture + CQRS (MediatR); RFC 7807 errors.
- **1,402 automated tests**:

  | Service | Tests |
  |---|---|
  | appointment | 1,052 |
  | payment | 110 |
  | telemedicine | 240 |
- Service extractions:
  - payment moved out of appointment (lift-and-shift, no client-visible change)
  - scheduling moved out of telemedicine
- GitLab CI: test → SonarQube → build → deploy across dev / staging / prod.

### 3.2 🟡 Real infra experience, not in service code (publish as supporting experience)
- **Kafka and RabbitMQ.** Operated on the platform, including diagnosing a disk-space incident traced to Kafka's storage volume.
  - 👉 *Fill in:* what Kafka was used for, rough cluster size, how the incident was found and fixed, and what changed after.
- **Kubernetes (K3s) and Docker Swarm production deployments.**
  - 👉 *Fill in:* number of services, environments, what you owned (manifests? Ansible? upgrades?).
- **Azure Key Vault.** Keep only if you can say where it was used. Not used by these services, which read credentials from env vars.
- **Docker, GitLab CI/CD, Serilog/Graylog, Zipkin operations.**

Phrase these as *"Ran the platform in production: …"*, as one bullet or one supporting line, never the headline.

### 3.3 ❌ Remove or reword
| Current claim (in `info.json`) | Problem | Use instead |
|---|---|---|
| "real-time updates via **WebSockets**/SSE" | SSE only | "live availability over SSE, fanned out with Postgres LISTEN/NOTIFY" |
| "SSLCommerz … with **platform-aware redirects**" | No server-side switch; the clients differ, and the mobile return is likely broken | "hosted checkout for web and in-app WebView" (or drop it) |
| "implemented **audit logging of sensitive patient-record access**" | No read-audit trail yet | "PHI-safe logging and an append-only, undeletable consultation record" |
| "**Led** development of …" | Wording agreed above | "Designed and built …" |
| Kafka/RabbitMQ as the *messaging* of these services | They use an outbox + HTTP | "transactional outbox with Kafka-ready event contracts"; Kafka stays under 3.2 |

**Teton / ConnexPay experience was not researched** (no repo access here). Re-check those bullets against your own memory with the same discipline.


### 3.4 Side projects (verified separately)
- **SNOMED CT search** (`~/Work/robin/datamapping`, personal, GitHub repo). **Re-verified 2026-11-05** on branch
  `feature/credible-snomed-search` (phases 0 to 6; **merged to `main` via PR #1 and public at github.com/robinmxr/snomed**):
  - ✅ denormalized `search_term` table with a generated `tsvector` column, GIN and trigram indexes; plans in `docs/query-plans.md`
  - ✅ word-order-independent ranked search, typo fallback by trigram word similarity, keyset paging, page-past-the-end bug fixed
  - ✅ transitive IS-A closure (7,611,410 pairs, depth 22) with descendants and subtree-filtered search
  - ✅ RF2 loader, compose file, CI, README; tests against a real Postgres on a synthetic fixture (84 discovered by `--list-tests`; the session reported 88, so write "80+" until `dotnet test` is run)
  - ✅ measured on an M1 Pro, API and Postgres on the same machine: suggest p95 9.5 ms at 1 client and 18.7 ms at 16 over 546,786 searchable descriptions (`docs/benchmarks.md`). Lexical search p95 is 62.8 ms and 121.2 ms
  - ⚠️ "Searchable" means the finding and disorder tags only. The release has 1,693,873 descriptions and 378,553 active concepts, so never say "the full release is searchable"
  - 🟡 semantic and hybrid modes (pgvector HNSW, reciprocal rank fusion) are built and tested but **no embeddings are stored and no model has been compared**. Never claim semantic accuracy or semantic latency yet. The lexical baseline on 54 everyday phrases is recall@10 0.43, and it misses "belly pain", "tummy ache" and "runny nose", which is the gap semantic search must close
  - ❌ the old résumé lines are still false until reworded: "semantic autocomplete", "tsvector columns", "sub-second semantic lookup using pgvector". Use the sanctioned wording in §13.8
  - 🔴 **owner actions still open:** the credentials file is gone from current files but **still exists in two older commits of the public repo** (checked 2026-11-05 via the commit API), so run `docs/history-purge.md` on a fresh clone and force push, and rotate the database password if it was ever real. The repo URL is already on the portfolio card. Also fix the build warning for a known high-severity advisory on `Microsoft.OpenApi` 2.4.1
- **mypaw, Algomist:** not yet verified (todo.md Phase 1.6 A/B).

---

## 4. Concept catalogue

This is the core of the positioning. Each concept shows the problem it solves, where Robin applied it, how it was
implemented, the evidence, ready-to-use public phrasing, and a possible write-up. Use these to build the "How I build"
section, interview stories and blog posts.

### C1. Database-enforced invariants
- **Problem:** Application-level "check then insert" loses races. Two requests both see a free slot.
- **Where:** appointment booking.
- **How:**
  - A partial unique index over (doctor, venue type, `COALESCE(chamber, zero-uuid)`, date, start time) where status
    is in (Claimed, PaymentPending, Booked).
  - The **`COALESCE` catch:** NULLs never collide in a unique index, so the originally specified key would have left
    *online* slots (no chamber) completely unprotected. Robin found this during implementation, and the contract was
    corrected.
  - A day-serial unique index acts as a backstop for in-person queue numbers. Serial = max + 1 *including cancelled
    rows*, so numbers are never reissued.
- **Evidence:** real-Postgres race tests (8 → 1, 3-seat → 3).
- **Public phrasing:** *"Made booking fairness a database invariant, not an application check — and caught a NULL-key
  gap in the original spec that would have left online slots double-bookable."*
- **Write-up idea:** "The NULL that would have double-booked every online appointment."

### C2. Optimistic concurrency
- **Problem:** Concurrent updates to the same booking or transaction (checkout vs. release, payment vs. sweep).
- **Where:** appointment, payment, telemedicine.
- **How:**
  - Postgres `xmin` as a row-version token. This needs zero schema change.
  - Small bounded retries (max 2–3).
  - The loser maps to a clear domain error (`BOOK_HOLD_EXPIRED`).
  - In telemedicine, the version token makes the seal sweep multi-replica-safe *without locks*: a row that loses the race is simply skipped.
- **Evidence:** tests for checkout racing release, and payment racing the sweep.
- **Public phrasing:** *"Used row-version optimistic concurrency with bounded retries so conflicting updates fail
  cleanly into domain errors instead of corrupting state."*

### C3. Pessimistic coordination with advisory locks
- **Problem:** Some invariants span rows or replicas: one live claim per patient per doctor, sequential queue numbers,
  one payment session per booking, singleton background jobs.
- **Where:** appointment, payment.
- **How:**
  - Transaction-scoped `pg_advisory_xact_lock(hash(scope), hash(key))`:
    - claim lock per (doctor, patient)
    - serial lock per (doctor, chamber, day)
    - session lock per booking (double-click or two tabs)
  - `pg_try_advisory_lock` so each of the 7 background jobs runs once across replicas.
  - `FOR UPDATE SKIP LOCKED` for batch sweeps.
- **Public phrasing:** *"Coordinated cross-replica work with Postgres advisory locks and SKIP LOCKED batches — no extra
  infrastructure, no in-process locks that silently break at two replicas."*

### C4. Idempotency and exactly-once effects
- **Problem:** Payment providers retry, clients double-submit, networks duplicate. The *effect* (confirm, notify,
  charge) must happen once.
- **Where:** payment and appointment (end to end), telemedicine (event handlers).
- **How (layered):**
  1. Natural idempotency key `{valId}:{tranId}`, checked before writing.
  2. A unique index as the backstop for concurrent duplicates. The unique violation becomes a typed
     `DuplicateTransaction` → **200 no-op**, not a 500, so the provider stops retrying.
  3. The same key deduped again on the receiving service.
  4. A generic `X-Idempotency-Key` filter reserves the key, replays the stored 2xx, and waits for a concurrent twin.
  5. Idempotent event handlers instead of an inbox table.
- **Evidence:** "duplicate payment callbacks → confirm once, notify once" (real-Postgres test); an 11-scenario edge-case
  suite (duplicate IPN, double-session race, malformed IPN, …).
- **Public phrasing:** *"Achieved exactly-once effects over at-least-once delivery with layered idempotency: natural
  keys, unique-index backstops that turn duplicates into no-ops, and receiver-side dedupe."*
- **Write-up idea:** "Exactly-once payments on top of a gateway that calls you twice."

### C5. Explicit state machines with convergent cleanup
- **Problem:** A held slot must be released if the patient abandons, the payment fails, time runs out, or anything
  crashes. Correctness can't depend on a cron job running on time.
- **Where:** appointment booking lifecycle.
- **How:**
  - States: `Claimed` → `PaymentPending` → `Booked` → `Completed` / `NoShow`, plus terminal `Expired` / `Cancelled`.
  - Two clocks: a 5-minute review hold, then a **fresh** 10-minute payment window (reset, not extended).
  - **Eight convergent release paths:**
    1. lazy expiry on read
    2. reclaim-on-conflict at insert
    3. a 60-second `SKIP LOCKED` sweep
    4. explicit release
    5. verified payment failure
    6. checkout auto-release (cutoff, attempts)
    7. cancel
    8. purge of old expired rows
  - The first two guarantee correctness on their own. The sweep is housekeeping.
  - `Expired` is terminal and never revived. Late payments are refunded, because the UI already told the patient the slot was lost.
- **Public phrasing:** *"Modelled booking as an explicit state machine with eight convergent release paths, so a
  stalled background job can never strand a slot."*
- **Write-up idea:** "Designing a slot-hold lifecycle that survives everything."

### C6. Trust boundaries and verification
- **Problem:** Payment callbacks arrive on public, unauthenticated routes. Video tokens grant access to private
  medical conversations. Events can be replayed or forged.
- **Where:** payment, telemedicine.
- **How:**
  - **Trust only lookup keys** (`tran_id`, `val_id`). Status and amount are always re-fetched server-to-server from
    the provider. If no record matches, fail closed.
  - **Split signals:** "is the payment valid" and "does it belong to this transaction" are reported separately. Merging
    them would let a forged callback (fake tranId + someone else's real valId) release a victim's slot. Found while
    implementing the contract.
  - **Payment reports, booking decides.** Only the booking service has status and fee context, so it makes every
    state decision. An amount mismatch is flagged for manual reconciliation; the booking is not touched.
  - **Server-derived identifiers:** video channel and uid are computed from the appointment, never taken from the
    request. The screen-share endpoint binds no request body at all. This closed an earlier path where a forged user
    header could mint a token for any appointment's call.
  - **Events as hints:** before sealing a transcript, the service re-verifies the appointment status at the source.
  - **Resource-scoped authorisation:** non-parties get 404, not 403, so nothing leaks about whether a booking exists.
  - **Server-side fee resolution** closed a "client sets their own price" hole.
- **Public phrasing:** *"Treated every inbound signal as untrusted: re-validated payments with the provider, split
  validity from ownership so forged callbacks can't touch other bookings, and derived all access identifiers server-side."*
- **Write-up idea:** "Two booleans that stopped a payment forgery."

### C7. Reliable messaging and delivery semantics
- **Problem:** "Save the booking, then send the notification" can lose messages (crash between the two steps) or send
  ghosts (notify, then roll back).
- **Where:** appointment (publisher); telemedicine and notifications (consumers).
- **How:**
  - **Transactional outbox:** each event is one row per channel (in-app, SMS, event bus, payment), written in the same
    DB transaction as the state change.
  - Dispatcher: 2-second poll, 8 parallel lanes, per-row exponential backoff from 45 s to 600 s, max 5 attempts, then dead-letter.
  - **Delivery semantics chosen per channel.** Notifications are *at-most-once on purpose*, because downstream SMS and
    feeds aren't idempotent. Moving to at-least-once is documented as three coordinated changes. Payment and event-bus
    channels are at-least-once, with receivers deduping on event id.
  - **Kafka-ready contracts:** an envelope `{id, type, source, topic, occurredOn, data}`, topic keyed by booking id, no
    personal data in payloads (rendered at dispatch). Switching transport means 2 DI registrations. The consumer-side
    dispatcher maps Handled / Ignored / Rejected / Retry onto HTTP today and onto commit / dead-letter / don't-commit for Kafka later.
  - **Operability:** health checks on outbox lag and dead letters; alerts on undelivered events; a heartbeat log whose *absence* triggers an alert.
- **Public phrasing:** *"Built a transactional outbox with per-channel delivery semantics and Kafka-ready contracts —
  events are atomic with the state change and transport can be swapped without touching handlers."*
- **Write-up idea:** "At-most-once on purpose: choosing delivery semantics per channel."

### C8. Resilience
- **Problem:** Every downstream service (payment provider, user service, booking service, summariser) can be slow or down.
- **How:**
  - Polly on every outbound client: per-attempt and overall timeouts, 2 retries with exponential backoff (~400 ms then ~800 ms), circuit breaker opening for 30 s after 5 failures.
  - A **retry sweeper** for payment outcomes: every 60 s, 30 s grace period, batch 100, max 20 attempts. A partial index keeps it cheap, and there is an ops kill-switch.
  - **IPN is authoritative; the redirect is a best-effort fast path.**
  - SSE degrades to polling.
  - The summary job backs off at 1 / 5 / 15 / 60 min.
  - Fail-loud config: credentials from env only, empty URL defaults fail loudly, sandbox by default.
- **Public phrasing:** *"Designed for partial failure: timeouts, backoff and circuit breakers on every hop, an
  authoritative slow path with a best-effort fast path, and sweepers that finish what requests couldn't."*

### C9. Data protection for sensitive records
- **Problem:** Consultation transcripts are medical records. They must be private, tamper-evident and never leak through logs or errors.
- **Where:** telemedicine.
- **How:**
  - **AES-256-GCM** at the application layer via an EF value converter. Format: `enc:v1:<keyId>:<nonce‖ciphertext‖tag>`, with a fresh nonce per write.
  - **Associated data** binds the key id and a purpose label (document vs. summary), so ciphertext copied between columns fails to decrypt.
  - **Key ring** with rotation, validated fail-fast at startup.
  - **Append-only and undeletable in three layers:** domain aggregate, repository, no DELETE route.
  - **Server-side sealing**, triggered by a booking-ended event (re-verified), a sweep, or lazily on next access. Hang-up doesn't seal, so dropped calls can rejoin.
  - **PHI-safe logging:** ids logged as 8-hex SHA-256 refs, redacted `ToString()`, exceptions logged by type, no tokens/channels/uids in logs. Validators never read content, so error bodies can't echo speech. Tests assert all of this.
- **Public phrasing:** *"Stored consultation transcripts as encrypted, append-only medical records — AES-256-GCM with
  purpose-bound associated data and key rotation — and made logging provably PHI-safe."*

### C10. Real-time fan-out without new infrastructure
- **Where:** live availability.
- **How:** SSE stream per client. Every claim, release, expire or cancel fires Postgres `pg_notify`; a `LISTEN` loop on
  every pod fans out to that pod's SSE subscribers; clients fall back to polling.
- **Public phrasing:** *"Pushed live slot availability over SSE, fanned out across pods with Postgres LISTEN/NOTIFY —
  real-time without adding a broker."*

### C11. Service boundaries and evolution
- **How:**
  - **Payment extracted** from the booking service as a lift-and-shift with no client-visible change. tranId was
    later separated from bookingId, with an anchor row to recover the booking from callbacks.
  - **Scheduling moved out** of telemedicine, which became a focused call service with *derived* rooms (no session or participant tables).
  - **Clear ownership:** booking decides, payment reports, telemedicine verifies.
  - **Contract-first:** Robin wrote the service contracts and changelogs.
- **Public phrasing:** *"Split a booking monolith into focused services with contract-first interfaces — and moved
  responsibilities to where the data and decisions live."*

### C12. Testing distributed behaviour
- **How:**
  - Testcontainers Postgres for races, indexes and background jobs. Robin reversed an earlier "no Testcontainers"
    decision when race bugs needed a real DB to reproduce.
  - WireMock to fake external HTTP (payment provider, peer services).
  - A manual edge-case suite with 11 scenarios.
  - Tests that assert *logging* is PHI-safe.
- **Numbers:**

  | Service | Test methods | Breakdown |
  |---|---|---|
  | appointment | 1,052 | 678 unit, 287 integration, 87 real-Postgres; ≈1,250 cases incl. theory rows |
  | payment | 110 | — |
  | telemedicine | 240 | — |
  | **Total** | **1,402** | — |

  Appointment grew from 193 tests in July to 1,052.
- **Public phrasing:** *"Proved concurrency guarantees with tests that genuinely race on a real Postgres — 1,400+
  automated tests across three services."*

### C13. Observability
- **How:**
  - Structured JSON logs with correlation ids (→ Graylog).
  - OpenTelemetry traces across HTTP and EF Core (→ Zipkin), with a **custom B3 propagator** because the gateway emits B3, not W3C `traceparent`.
  - k8s liveness and readiness probes gated on dependencies.
  - Alert-on-absence heartbeat for the outbox.
- **Public phrasing:** *"Instrumented services end-to-end — correlated logs, distributed traces across a mixed B3/W3C
  estate, and alerts that fire when a heartbeat goes quiet."*

### C14. Time and windows
- **How:**
  - UTC internally, local time only at the edges (one JSON converter).
  - Hold and payment windows (§C5).
  - Telemedicine join window from start − 10 min to end + 10 min, with stricter client windows (patient ±5, doctor ±10) so the doctor arrives first.
  - Token TTL computed to expire exactly at window close.
- **Public phrasing:** fold into C5 and C6. Interview material more than headline material.

---

## 5. Service deep dives (reference detail)

### 5.1 Appointment service: booking and slot-hold lifecycle

**Scope.** Owns:
- doctor schedules per venue (online / in-person chamber)
- holidays and blocked slots
- live availability
- the booking lifecycle
- in-person queue serials
- reminders
- PDF receipts
- notifications
- a front-desk assistant module (walk-ins, queue, fee collection)

It does not own profiles, money or video.

**Shape:**
- 9 projects; Clean Architecture + CQRS (14 command / 24 query handlers, 14 validators)
- 10 controllers / 40 endpoints
- 13 tables, 17 migrations
- 7 background jobs: GC sweep, hold purge, availability stream listener, reminder dispatch, outbox dispatcher, assistant audit dispatcher, day close
- 7 integration events: BookingConfirmed, PaymentSucceeded, BookingCancelled, AppointmentCompleted, AppointmentNoShow, ReminderDue, InHandPaymentRecorded
- 4 delivery channels
- QuestPDF receipts
- ~18.9k source / ~24.8k test lines

**State machine:**
| From | To | Trigger |
|---|---|---|
| — | Claimed | claim; hold = now + 5 min |
| Claimed / PaymentPending | PaymentPending | checkout: payment session minted, hold **reset** to now + 10 min, attempt + 1 (max 3) |
| PaymentPending | Booked | verified payment (valid + tranId match + amount match); in-person gets day serial |
| Booked | Completed / NoShow | doctor or front desk |
| Claimed / Booked | Cancelled | before deadline (refused while PaymentPending) |
| Claimed / PaymentPending | Expired | any of the 8 release paths (§C5), terminal |

**Booking sequence:**
1. The client loads availability and opens the SSE stream, through the gateway (JWT, RBAC, identity header).
2. **Claim.**
   1. Verify the proxy-patient link.
   2. Take the claim advisory lock.
   3. Check the advance window, holidays and lead time (≥ 15 min).
   4. Resolve the fee server-side.
   5. Insert `Claimed`; the unique index decides the winner.
   6. Commit, then `pg_notify` → every SSE client refreshes.
   7. Return 201 `{ref, fees, holdExpiry}`.
3. **Checkout.**
   1. Check the hold is live, the cutoff and the attempt count.
   2. Payment service creates a session.
   3. Store the tranId; status → `PaymentPending`; hold → +10 min.
   4. Return `checkoutUrl`.
4. The client pays on the provider's hosted page, returns, and polls the booking.
5. The payment service posts the outcome `{tranId, valId, isValid, tranIdMatches, amount}` in-cluster.
6. **Apply the outcome.**
   - Duplicate → no-op.
   - tranId mismatch → record only.
   - Invalid → `Expired` + notify.
   - Amount mismatch → flag for manual reconciliation.
   - Valid → serial lock (in-person) → `Booked`, with outbox rows (PaymentSucceeded, BookingConfirmed) in the same transaction.
7. The outbox delivers to notifications (feed, push, SMS) and to event subscribers.
8. A reminder is sent 10 min before the start.
9. Online visit → telemedicine (§5.3).
10. The doctor marks Complete / NoShow → events fan out.

### 5.2 Payment service: SSLCommerz checkout and verified outcome

**Scope.**
- Creates checkout sessions for the booking service.
- Receives the IPN and browser redirects.
- Re-validates every outcome server-to-server.
- Keeps an append-only transaction audit trail with raw provider payloads.
- Reports outcomes back to the booking service, with a retry sweeper.
- Also records front-desk cash/due payments (a separate table, outside the sweep).
- Knows nothing about bookings beyond an id.

**Shape:**
- 4 projects
- 7 endpoints (+3 health)
- 3 tables, 8 migrations; 5 named indexes on transactions, 2 of them partial
- 3 payment states (`Pending` → `Valid` | `Failed`, one transition, never deleted)
- 6 error codes
- No broker: synchronous HTTP + Polly + sweeper
- Public routes rate-limited (200 req / 10 s, global bucket)
- Gateway-neutral receipt schema with a provider discriminator, ready for a second provider

**Session creation:**
1. Take an advisory lock on the booking.
2. If a pending session already exists, reuse it.
3. Otherwise generate a 12-character crypto-random tranId (36¹² ≈ 4.7×10¹⁸ possibilities, up to 5 tries).
4. Call provider session init.
5. Save the anchor row (partial unique index; on collision, generate a new tranId).
6. Return `{checkoutUrl, sessionKey, tranId}`.

Upstream failure → 503.

**Callbacks:**
- **Redirect.** Recover the booking via the anchor, run a best-effort fast confirm, then a 2-second bounce page.
- **IPN.** Validate input size (ids ≤ 64 characters, payload ≤ 16 KB), then:
  1. Re-fetch from the provider: the validation API by val_id, or the transaction-query API by tran_id. Fail closed if nothing is found.
  2. Compute `isValid` and `tranIdMatches` as separate flags.
  3. Dedupe in two layers.
  4. Set `Valid` / `Failed` and keep the raw payloads.
  5. Report the outcome.
  6. Always return 200 for a known tranId.

**Retry sweeper:** every 60 s, 30 s grace, batch 100, max 20 attempts, then "manual intervention".

**Honest scope.** Not built yet: automated refunds and settlement reconciliation. Late, duplicate and cancelled-booking payments are flagged for manual refund.

**Numbers:**
- 110 tests (102 Fact + 8 Theory / 22 rows), plus 44 payment-related tests on the booking side
- 11-scenario edge-case suite
- Polly: 10 s/attempt to the provider; 5 s attempt / 10 s overall to the booking service; 2 retries; breaker 5 failures / 30 s

### 5.3 Telemedicine service: video rooms, transcripts and AI summaries

**Scope.**
- Server-minted, appointment-scoped Agora tokens: RTC (video/audio), RTM (signalling), screen share.
- An encrypted, append-only, undeletable consultation transcript.
- An LLM-generated consultation summary after sealing.
- No room or session tables: the room is derived from the appointment.

**Shape:**
- 12 routes: 8 API, 1 internal event intake, 3 probes
- 6 commands / 2 queries
- 1 aggregate, 1 table (one transcript per appointment), 6 migrations
- 12 error codes
- 3 events consumed (Completed / NoShow / Cancelled), 0 produced
- 2 jobs: seal sweep every 1 min; summary job every 60 s or woken by a seal
- ~8k source / ~5.5k test lines
- 240 tests (224 Fact, 10 Theory / 34 rows, 6 real-Postgres)

**Token minting:**
1. Read the caller id from the gateway header.
2. Check room access with the booking service (in-cluster): Polly-protected, 20 s cache, 404 to non-parties, 409 for in-person bookings.
3. The caller must be the booking's doctor or patient.
4. The status must be BOOKED and the time inside the window (start − 10 min to end + 10 min).
5. The server derives the identifiers: channel `appt-{id}` / `signal_appt-{id}`, uid `dr-` / `pt-` prefix, screen uid `{uid}-screen`.
6. The token TTL is the seconds left until the window closes.
7. Response: `{channelName, token, uid, role, expiresAt}`.

**Transcript lifecycle:**
1. **Start.** The first doctor write creates the record, with consent stamped "Assumed".
2. **Recording.** Append batches of up to 500 turns, deduped by turn id, with version-race retries.
3. **Sealed.** Triggered by the booking-ended event (re-verified), the sweep, or lazily on next access.
4. **Summary.** States go from `generating` to `ready`.

**Limits:** 3,000 turns, 4,000 characters per turn, 2 MB per document.

**Summary job:**
- The decrypted conversation is sent to the internal summariser (an LLM). Input language is Bengali; timeout is 90 s.
- Conversations over 20,000 characters are chunked: each chunk is summarised, then the chunk summaries are summarised again (map-reduce).
- The result is stored encrypted.
- Failures back off at 1 / 5 / 15 / 60 min.

**Telemedicine sequence:**
1. The online booking is paid; an SMS with a deep call link goes out.
2. The doctor joins at T−10. Gateway → room-access check → token for RTC, then RTM.
3. The patient joins at T−5.
4. Optional screen share.
5. The doctor portal transcribes and appends turns every ~10 s or 5 turns.
6. A hang-up doesn't seal, so the call can be rejoined.
7. Complete / NoShow → outbox event → re-verify status → seal.
8. The sweep acts as a backstop.
9. The seal wakes the summary job → LLM → encrypted summary.
10. Doctor and patient see the summary.

---

## 6. Diagram specs

Rendering guidance for the site component (todo.md task 5):
- Hairline boxes, kind label in small caps.
- Stores drawn as cylinders (subtle), queues with a notched edge.
- Highlight node in the accent colour.
- Generic labels only (§2.4).

### D1. Platform overview (hero diagram for "Experience" / a "How I build" section)
| id | label | kind |
|---|---|---|
| clients | Web portals & mobile app | client |
| idp | Identity provider (Keycloak) | external |
| gw | API gateway — JWT + RBAC | service |
| appt | Appointment service | service |
| pay | Payment service | service |
| tele | Telemedicine service | service |
| outbox | Transactional outbox → events | queue |
| pg | PostgreSQL (per service) | store |
| notif | Notification service | service |
| psp | Payment provider (SSLCommerz) | external |
| video | Video provider (Agora) | external |
| llm | Summariser (LLM) | external |

Edges:
- clients → idp: sign in
- clients → gw: REST + SSE
- gw → appt: book
- gw → tele: join, transcript
- appt → pay: checkout session
- clients → psp: hosted checkout
- psp → pay: IPN
- pay → psp: verify
- pay → appt: verified outcome
- appt → outbox: events (same transaction)
- outbox → notif: confirmations
- outbox → tele: visit ended
- tele → appt: room access
- clients → video: join (server-minted token)
- tele → llm: summarise
- services → pg: own data

### D2. Booking state machine (most striking single visual for C5)
States left → right: `Claimed` → `PaymentPending` → `Booked` → `Completed` / `NoShow`.
- Below: `Expired` (terminal) with **eight labelled arrows** converging on it: lazy expiry, reclaim, sweep, release, payment failed, auto-release, purge.
- Cancel goes to a separate `Cancelled`.
- Annotate the clocks: "5 min hold" on Claimed, "fresh 10 min window" on PaymentPending.

### D3. Payment verification flow (sequence, for C4/C6)
Lanes: Patient · Booking service · Payment service · Provider. Highlights:
- the advisory lock at session creation
- IPN entering on a public route
- the **re-verify** call back to the provider
- two separate flags in the outcome
- the booking service deciding
- the retry sweeper loop drawn as a dashed arrow

### D4. Telemedicine access and record (for C6/C9)
- Nodes: Doctor portal, Patient app, Gateway, Telemedicine, Booking service (room access), Video provider, Speech-to-text, Encrypted transcript store, Seal/summary jobs, LLM.
- Highlight "server-derived channel + expiry at slot end".
- Mark encryption with a lock glyph.

### D5. Outbox (small inline diagram for C7)
Transaction box containing [state change + outbox rows] → dispatcher → channels (in-app, SMS, event bus, payment).
Annotate the delivery semantics on each channel.

---

## 7. Public copy (sanitised, ready to paste)

### 7.1 Hero
- **Name:** Reajul Islam Robin
- **Headline:** *I build backend systems that stay correct under concurrency, retries and failure — from race-free
  booking to forgery-safe payments.*
- **Credibility line:** *Backend engineer · .NET & PostgreSQL · 3 years building distributed systems for healthcare
  and payments*
- **Focus list:** Distributed systems · Concurrency & consistency · Payments · Healthcare

### 7.2 Experience: Adaptive Enterprise Ltd (Software Engineer, Dec 2025 – Present)

**Summary:**
> Designed and built the appointment, payment and telemedicine services of a healthcare platform, and also worked on its prescription service — .NET 8
> microservices with Clean Architecture and CQRS on PostgreSQL.

**Figures** (`experience[0].figures`):
| value | label |
|---|---|
| 1,400+ | automated tests across 3 services |
| 8 → 1 | concurrent patients, exactly one booking |
| 8 | convergent hold-release paths |

**Achievements** (`{lead, detail}`):
1. **Designed race-free booking.** Slot-hold lifecycle with a 5-minute hold, a fresh 10-minute payment window and
   eight convergent release paths; first-come-first-served enforced by a partial unique index, row-version optimistic
   concurrency and Postgres advisory locks, proven by real-database race tests (8 concurrent patients → 1 booking).
2. **Made payments exactly-once and forgery-safe.** Extracted SSLCommerz into its own service; every callback
   re-validated with the provider, validity and ownership reported as separate signals so a forged callback can't
   release another patient's slot, and layered idempotency (natural keys, unique-index backstops, receiver dedupe).
3. **Secured video consultations.** Appointment-scoped Agora video, signalling and screen-share tokens with
   server-derived channels, party and join-window checks, and expiry pinned to the end of the slot.
4. **Turned consultations into an encrypted medical record.** Append-only, undeletable transcripts encrypted with
   AES-256-GCM (purpose-bound, key rotation), PHI-safe logging verified by tests, event-driven sealing re-verified at
   the source, and LLM-generated summaries for long calls.
5. **Built reliable messaging without losing atomicity.** Transactional outbox with per-channel delivery semantics,
   backoff and dead-lettering; Kafka-ready event contracts; live availability over SSE fanned out with Postgres LISTEN/NOTIFY.
6. **Ran the platform in production.** Docker and Kubernetes (K3s) deployments via GitLab CI, Kafka and RabbitMQ
   operations — including diagnosing a disk-space incident on Kafka's storage volume — with Graylog logging and
   OpenTelemetry/Zipkin tracing.

**Stack line:** .NET 8 · C# · PostgreSQL · EF Core · CQRS/MediatR · Polly · Keycloak (OIDC, RBAC) · SSLCommerz ·
Agora · SSE · xUnit · Testcontainers · WireMock · Docker · K3s · GitLab CI/CD · Kafka · RabbitMQ · Serilog/Graylog ·
OpenTelemetry/Zipkin

### 7.3 Skills: regroup by concept, not by tool
| Group | Core (emphasised) | More (muted) |
|---|---|---|
| Concurrency & consistency | Optimistic concurrency, advisory locks, DB-enforced invariants, state machines | SKIP LOCKED work queues, serialisable sections |
| Reliability & messaging | Idempotency, transactional outbox, retries & circuit breakers | Kafka, RabbitMQ, delivery semantics, dead-lettering |
| API & service design | ASP.NET Core / .NET 8, REST, Clean Architecture, CQRS/MediatR | DDD, contract-first design, RFC 7807, service extraction |
| Data | PostgreSQL, EF Core, SQL Server | pgvector, tsvector, Redis, MongoDB |
| Security | OAuth 2.0 / OIDC, Keycloak, RBAC, AES-GCM encryption | PCI-DSS-aligned APIs, PHI-safe logging, Microsoft Identity |
| Testing | xUnit, Testcontainers, integration testing | WireMock, race/concurrency tests, TDD |
| Infrastructure & ops *(supporting)* | Docker, Kubernetes / K3s, GitLab CI/CD | Docker Swarm, Graylog, OpenTelemetry/Zipkin, Azure, AWS |
| Also comfortable with | Angular, TypeScript, React | Node.js, Python, PHP |

### 7.4 About summary (replaces the current long paragraph)
> I'm a backend engineer in Dhaka building distributed systems for healthcare and fintech. Most of my work lives
> where correctness is non-negotiable: scarce appointment slots, payments, and medical records. I like problems that
> look simple until two requests arrive at once — and I prove the answers with tests that actually race.
> Before healthcare I built PCI-DSS-aligned payment APIs for a US fintech platform.

### 7.5 Principles (decided 2026-11-04: NOT a home-page section — shown on case-study pages under "In practice"; home page has a compact "Case studies" list instead)
A short numbered list on the home page, between Experience and Projects, with each item linking to a case study or note:
1. **Make invariants the database's job.** (C1)
2. **Assume every message arrives twice.** (C4)
3. **Model lifecycles explicitly; make cleanup converge.** (C5)
4. **Trust identifiers, verify everything else.** (C6)
5. **Commit state and intent together.** (C7)
6. **Prove concurrency with real races.** (C12)

---

## 8. Case studies (sanitised drafts)

For the project-detail structure in todo.md Phase 2. These are **work case studies**: present them as
"Selected engineering work at Adaptive Enterprise", with no client name, no code and generic diagrams. The side
projects (mypaw, SNOMED, Algomist) stay as personal projects.

### CS1. Race-free appointment booking
- **Problem:** Patients compete for limited doctor slots and pay through an external provider that can be slow, fail
  or call back twice. A slot must never be sold twice, abandoned checkouts must free slots quickly, and nothing can
  depend on a background job running on time.
- **Architecture:** D1 (highlight: appointment service) + D2.
- **Key decisions:**
  - Fairness as a DB constraint, not app code. *Why:* check-then-insert loses races. And the NULL-key gap was caught.
  - Three correctness-bearing expiry paths. *Why:* a stalled sweep must not strand slots.
  - Reset, don't extend, the payment window. *Why:* every checkout attempt gets a full, predictable window.
  - `Expired` is terminal. *Why:* the UI already told the patient; refund rather than surprise them.
  - Advisory locks for cross-row rules. *Why:* in-process locks break silently at two replicas.
- **Results:**
  - 1,052 tests, including real-Postgres races: 8 → 1 booking, 3 seats → 3, duplicate callbacks → one confirm, payment vs. sweep → no expired confirms.
  - 40 endpoints.
  - 7 replica-safe background jobs.

### CS2. Exactly-once, forgery-safe payments
- **Problem:** Payment callbacks hit public, unauthenticated routes, may be duplicated or forged, and the booking must
  be confirmed exactly once — or released only when a payment truly failed.
- **Architecture:** D3.
- **Key decisions:**
  - Trust lookup keys only, re-fetch facts from the provider. *Why:* callback bodies are attacker-controlled.
  - Separate "valid" from "belongs to this transaction". *Why:* merging them lets a forged callback release someone else's slot.
  - Payment reports, booking decides. *Why:* only the booking service has the status and fee context.
  - Layered idempotency with typed no-ops. *Why:* providers retry until they get a 200.
  - HTTP + retry sweeper instead of a broker. *Why:* the receiver dedupes, so delivery can be at-least-once without new infrastructure.
- **Results:**
  - 110 + 44 tests; 11-scenario edge-case suite.
  - The extraction shipped with no client-visible change.

### CS3. Secure video consultations with an encrypted medical record
- **Problem:** Only the booked doctor and patient may join, only around the appointment time, and what's said becomes
  part of a medical record that must be private, tamper-resistant and summarised for follow-up.
- **Architecture:** D4.
- **Key decisions:**
  - Derived rooms and server-assigned identifiers. *Why:* nothing to store, nothing to forge.
  - Events as hints, re-verified at the source. *Why:* a forged event must not end a live call.
  - Application-layer AES-GCM with purpose-bound associated data and key rotation. *Why:* protects against column swaps and allows rotation without downtime.
  - Append endpoint instead of whole-document PUT. *Why:* cut ~50 KB × 360 writes per hour and removed a truncation risk.
  - Seal policy iterated four times. *Why:* balance rejoin-ability against summary latency.
- **Results:**
  - 240 tests, including PHI-logging assertions.
  - Tokens expire at slot end + 10 min.
  - Summaries are ready within minutes of the call ending.

---

## 9. Writing plan (Notes section / LinkedIn / dev.to)

Ordered by impact. Each post is concept-first, uses no client name and no code from work, with generic
pseudo-code only if needed.

| # | Title | Concept | Notes |
|---|---|---|---|
| 1 | The NULL that would have double-booked every online appointment | C1 | Short and punchy, a great LinkedIn post |
| 2 | Two booleans that stopped a payment forgery | C6 | Payment callback threat model |
| 3 | Exactly-once effects on top of a gateway that calls you twice | C4 | Layered idempotency |
| 4 | Designing a slot-hold lifecycle that survives everything | C5 | Use D2 |
| 5 | At-most-once on purpose: choosing delivery semantics per channel | C7 | Outbox |
| 6 | Testing races for real with Testcontainers | C12 | Could pair with the public demo repo |
| 7 | Postmortem: when Kafka ran out of disk | 🟡 3.2 | Needs your incident details; no internal hostnames |
| 8 | Encrypting medical transcripts with AES-GCM and associated data | C9 | |

---

## 10. Roadmap to a professional presence

### Phase A: fix and reframe the portfolio (1 session)
- [x] Apply §7.1 hero copy to `info.json` (`headline`, `credibility`, `focus`)
- [x] Apply §7.2: experience summary, figures, 6 achievements, stack line. Remove the ❌ claims (§3.3)
- [x] Apply §7.3: concept-based skill groups; infra under "supporting"
- [x] Apply §7.4: shorter About summary
- [x] Re-check the Teton bullets with the same discipline
- [x] Remove the client name from any committed file (already only in `todo.md`; fix it there)

### Phase B: "How I build" and work case studies (2–3 sessions)
- [x] Build the diagram component (todo.md task 5) and draw D1, D2 first
- [x] Add the "How I build" section (§7.5)
- [x] Add work case-study pages CS1–CS3 (`/work/:id`), reusing the project-detail template with Problem →
      Architecture → Decisions → Results. Label them "Engineering work at Adaptive Enterprise"
- [ ] Projects section stays for the side projects; consider renaming it "Side projects & experiments" once work
      case studies exist above it

### Phase C: public proof you can link to (high value, no NDA risk)
- [ ] **Open-source demo repo** that reproduces the concepts from scratch on a toy domain (e.g. "seat-hold-lab": .NET 8 +
      Postgres + Testcontainers): partial-unique-index claims, xmin concurrency, advisory locks, convergent expiry,
      idempotent webhook endpoint, transactional outbox, and a test that races 8 clients for 1 seat.
      **Write it fresh — never copy work code.** Link it from CS1/CS2 as "a public reimplementation of the patterns".
- [ ] Notes section + first 2 posts from §9 (#1 and #2 are short)
- [ ] Extend the demo repo and add follow-up projects per §13 (fault injection, measured numbers, job queue, CDC, Raft)

### Phase D: align every channel (1 session)
- [ ] **Résumé:** same six bullets as §7.2, same figures, headline "Backend Engineer — Distributed Systems"
- [ ] **LinkedIn:**
  - headline *"Backend Engineer · Distributed systems, concurrency & payments · .NET / PostgreSQL"*
  - About = §7.4
  - Featured: portfolio, demo repo, first post
- [ ] **GitHub profile README** (`update.md`): lead with backend; drop "Full-Stack" from the title; pin the demo repo, mypaw, SNOMED
- [ ] **Portfolio SEO:** title "Reajul Islam Robin — Backend Engineer, Distributed Systems"; OG image with the one-liner

### Phase E: keep it alive
- [ ] One post a month from §9
- [ ] Update the figures each quarter (tests, services)
- [ ] Add production numbers if the team ever shares them (§11)

---

## 11. Open questions (fill these in to strengthen the material)

1. **Kafka/RabbitMQ:** what were they used for on the platform, roughly what size, and what exactly happened in the disk incident (detection, root cause, fix, prevention)?
2. **Kubernetes/K3s/Swarm:** what did you personally own — manifests, Ansible, upgrades, scaling, incidents?
3. **Azure Key Vault:** where was it used, if anywhere? Otherwise drop it from the CV.
4. **Production numbers** (any ballpark the team is comfortable sharing): bookings per day, consultations per week, payment success rate, p95 claim/checkout latency, outbox delivery lag, summary turnaround.
5. **Teton/ConnexPay:** any numbers beyond the 30% onboarding cut? Transactions per day, gateways, query speed-ups?
6. ~~Is it OK to say "national telehealth platform"?~~ **Resolved 2026-11-05:** no. The platform is a new product at roughly v1 that is still growing its user base, so public copy says *"a healthcare platform"* and describes it as a new v1 still growing its user base. Never use "national" and do not call it an MVP.
7. ~~Production numbers (Q4)~~ **Resolved 2026-11-05:** there are none to share yet, because the user base is still small. Do not invent any. Capacity evidence comes from load tests you run yourself (P1 in §13.3) and from the 10x reasoning on the case studies.
8. **Team context (for interviews, and already on the site):** a small team handles the microservices of a new product, so scope per developer was broad. Be ready to say exactly which services and decisions you owned.
9. **Logistics (now on the site):** 1 month notice period; authorized to work in Bangladesh and remotely.

---

## 12. Source map (private: work repo paths for re-checking)

| Topic | Where (under `~/Work/gitlab/`) |
|---|---|
| Booking aggregate and states | `appointment-service/src/Services/Appointment.Domain/Booking/{Appointment,AppointmentStatus}.cs` |
| Active-claim unique index | `appointment-service/…/Infrastructure/Migrations/20260710083313_AddBookingHoldAndConcurrency.cs` |
| Reclaim-on-conflict | `appointment-service/…/Infrastructure/…/AppointmentRepository.cs` |
| Sweep / purge jobs | `appointment-service/…/Infrastructure/BackgroundServices/{GcSweep,HoldPurge}HostedService.cs` |
| Advisory locks | `appointment-service/…/Infrastructure/Persistence/WriteLock.cs`, `BackgroundServices/AdvisoryLock.cs` |
| Payment outcome apply | `appointment-service/…/Application/Commands/Booking/Internal/ApplyBookingPaymentOutcomeCommandHandler.cs` |
| Checkout + hold options | `appointment-service/…/CheckoutCommandHandler.cs`, `BookingHoldOptions.cs` |
| Outbox | `appointment-service/…/Infrastructure/EventBus/OutboxEventBus.cs`, `BackgroundServices/OutboxDispatcherHostedService.cs` |
| SSE fan-out | `appointment-service/…/Api/Controllers/AvailabilityController.cs`, `Realtime/PostgresAvailabilityChangeNotifier.cs` |
| Race tests | `appointment-service/tests/Appointment.PostgresTests/BookingRaceTests.cs` |
| Session creation | `payment-service/src/Services/Payment.Application/Commands/Payments/CreateSessionCommandHandler.cs` |
| IPN confirm / provider client | `payment-service/…/ConfirmTransactionCommandHandler.cs`, `Infrastructure/Payments/SslCommerzPaymentGateway.cs` |
| Retry sweeper | `payment-service/…/Infrastructure/BackgroundServices/OutcomeReportRetryHostedService.cs` |
| Payment contract | `payment-service/docs/contract-*.md` |
| Join window | `telemedicine-service/src/Services/Telemedicine/Telemedicine.Domain/Consultations/ConsultationWindow.cs` |
| Token minting | `telemedicine-service/…/Application/Services/RoomAccessGuard.cs`, `Infrastructure/Services/AgoraTokenService.cs` |
| Transcript aggregate | `telemedicine-service/…/Domain/Transcripts/ConsultationTranscript.cs` |
| Encryption | `telemedicine-service/…/Infrastructure/Security/{FieldProtector,TranscriptKeyRing}.cs` |
| PHI logging tests | `telemedicine-service/tests/…/Domain/TranscriptPhiLoggingTests.cs` |
| Telemedicine contract | `telemedicine-service/docs/contract-*.md` |
| Gateway RBAC rows | `gateway/src/main/resources/db/changelog/*` |

---

## 13. Credibility upgrades: projects and additions (added 2026-11-05)

Goal: close the gap between "correct on one Postgres" (already strong, see §3.1 and §4) and what a senior
distributed-systems interviewer probes next. Everything here is **proposed, not done**. Nothing in this section may be
published as a claim until the work exists and the evidence is recorded in §3 (same rule as §3.3).

### 13.1 Gap analysis: what interviewers probe vs. what you can show today

| Probe | What you can answer today | Gap | How to close it |
|---|---|---|---|
| "How do you stop two requests double-booking?" | Fully: C1, C2, C3, 87 real-Postgres race tests | none | already your headline |
| "Exactly-once?" | Fully: C4 layered idempotency | none | already your headline |
| "Outbox, and what about consumers?" | Producer side built (C7). Consumer side is "Kafka-ready", not run | no hands-on partitions, consumer groups, rebalancing, offsets, DLQ | P3 (CDC to Kafka) |
| "What happens when a worker dies mid-job?" | Sweepers and convergent cleanup (C5) | no leases or fencing tokens shown | P2 (Postgres job queue) |
| "How does consensus / leader election work?" | Advisory locks only (C3). That is single-node coordination | no consensus, replication or quorum work | P4 (Raft), P8 (Dynamo-style) |
| "How would it scale 100x?" | Nothing written down | no partitioning or sharding story, no capacity numbers | §13.3 "10x section" plus P1 load numbers |
| "How do you know it survives failure?" | Race tests. Edge-case suite | no fault injection, no crash or partition testing | P1 (Toxiproxy), P5 (Jepsen-lite) |
| "What is your p99 under load?" | Nothing measured. "Sub-second" was removed in §3.4 | no benchmarks anywhere | §13.2 item 1, P1 |
| "Read-your-writes, replica lag, isolation anomalies (write skew)?" | Implicit in C1/C2, never stated | vocabulary and a demo are missing | P6 plus a write-skew post (§13.4) |
| "What are your SLOs?" | Health checks, alert-on-absence (C13) | no SLIs, SLOs or error budgets | §13.3 "SLO page" |
| "Time and ordering?" | Windows and expiry (C14) | no logical clocks, no ordering argument | P4/P8 force this naturally |

**Read the table as:** your correctness story is complete. The missing pieces are **replication/consensus,
partitioning, fault injection and measurement**. Pick projects that add those, not a fifth variation on locking.

### 13.2 Quick wins on what already exists (hours to days, high return)

1. **Measure something, anything, and publish the method.** One honest table beats ten adjectives.
   - Booking: p50/p95/p99 claim latency and conflict rate at 8, 64 and 256 concurrent clients (k6 or NBomber against
     the public demo repo, not the work service).
   - SNOMED API: run `EXPLAIN ANALYZE` on the lexical, trigram and hierarchy queries; add the GIN trigram index if
     missing; report p95 at a stated QPS on stated hardware. This also converts the dropped "sub-second" claim (§3.4)
     into a real ✅.
2. **Fix the SNOMED claim mismatch.** `update.md` (the GitHub profile README) still says *"lexical and semantic
   autocomplete"* with a `pgvector` tag. §3.4 verified there is **no pgvector or embeddings** in that repo. Either build
   hybrid search (see 4 below) or delete the claim. Do this before anyone reads it.
3. **mypaw: verify before you tout.** The README line lists Kubernetes, pgvector and RAG triage, and §3.4 says it is not
   yet verified. Read the repo once and record what is real in §3.4. Then upgrade it (item 5).
4. **SNOMED: add one real distributed-systems feature.** Hybrid search: pgvector embeddings + the existing lexical
   rank, merged with reciprocal rank fusion, with an offline relevance check (a small labelled query set, report
   recall@10). Also add keyset pagination, single-flight caching to stop stampedes on hot queries, and
   OpenTelemetry traces. Each one is a day and each is a talking point.
5. **mypaw: make the "modular monolith" claim provable.**
   - Architecture tests (NetArchTest) that fail the build if a module reaches into another module's internals.
   - A transactional outbox between modules, so splitting a module into a service later is a transport swap (this is
     your C7 pattern applied to your own code).
   - The embedding/RAG ingestion as an idempotent background job with retries, backoff and a dead-letter table.
   - K8s manifests with liveness/readiness probes, resource limits and an HPA, plus a load test that shows it scaling.
6. **Algomist: leave it small.** It is the least relevant project to this positioning. If touched at all: queue the AI
   topic generation with retries, backoff and cached responses keyed by request hash. Otherwise demote it to the
   bottom of the list and let the backend work carry the page.
7. **Add three sections to each work case study (no new code, no NDA risk):**
   - **Failure modes:** a table of "what happens if…" (crash after the provider confirms but before we do; duplicate
     callback; sweeper races a live request; DB failover mid-claim) and which mechanism handles each.
   - **Non-guarantees:** what the design deliberately does *not* promise (for example, notifications are at-most-once
     on purpose). Stating limits reads as seniority.
   - **At 10x scale:** partition by doctor id so contention stays inside one shard; move the polling outbox to log-tail
     CDC; serve availability from replicas; rate-limit claim attempts per patient; watch for hot slots. Write it as
     reasoning, not as something you built.
8. **Frame the booking flow as a saga.** The slot-hold → checkout → payment-outcome → confirm/expire lifecycle (C5, §5.1)
   *is* a process manager with compensations. Say so, and name orchestration vs. choreography and why you picked
   the first. No new code, just the right vocabulary.
9. **SLO page.** Define 3 SLIs from things you already emit: claim success latency, outbox delivery lag, payment
   confirmation lag. Add a target and an error-budget sentence for each. It is one page and shows operational maturity.

### 13.3 New projects, ranked by credibility per hour

Each entry: what it is, what it proves, a minimum scope, the proof artefact, effort, and the honest claim it unlocks.
Build **fresh on a toy domain**. Never copy work code (§2.3).

#### Tier 1: do these first

**P1. `seat-hold-lab`, the flagship (already in Phase C; upgrade the scope)**
- **Proves:** C1/C2/C3/C4/C5/C7 as a runnable, public artefact instead of a description.
- **Add to the existing plan:**
  - Toxiproxy between the app and Postgres: inject latency, connection resets and timeouts.
  - `kill -9` the app mid-claim and assert that no hold is stuck once the sweeper runs.
  - Invariant checks after every run: at most one active claim per slot; every confirmed payment has a confirmed
    booking; no orphan holds.
  - k6 or NBomber results table at 8, 64, 256 clients (success, conflict ratio, p50/p95/p99).
  - `docker compose up` runs everything. CI badge. An ADR for each of the 5 key decisions.
- **Effort:** 2 weekends. **Claim unlocked:** *"Public reference implementation of race-free booking, verified under
  injected network faults and process crashes, with published latency numbers."*

**P2. `pg-jobs`: a durable job queue on Postgres**
- **Proves:** leases, fencing tokens, at-least-once with idempotent handlers. It generalises your outbox dispatcher.
- **MVP:** `FOR UPDATE SKIP LOCKED` dequeue; lease with heartbeat; an attempt counter used as a **fencing token** so a
  zombie worker cannot commit stale results; exponential backoff with jitter; dead-letter table; unique keys for
  idempotent enqueue; a cron scheduler where the leader is chosen by an advisory lock; `LISTEN/NOTIFY` wake-ups.
- **Tests:** kill a worker mid-job; two workers race for one job; pause a worker past its lease and let it resume.
- **Proof:** jobs/second against worker count; duplicate-execution rate (should be zero effects, some re-runs).
- **Effort:** 1 to 2 weeks. **Claim unlocked:** *"Built a Postgres-backed job queue with leases and fencing tokens;
  verified no double effects when workers crash or stall."*

**P3. Outbox → CDC → Kafka pipeline**
- **Proves:** hands-on Kafka *development* (you have only operated it so far, §3.2).
- **MVP:** Postgres logical decoding with Debezium's outbox event router into Kafka; 3 partitions keyed by aggregate
  id; consumer group with an idempotent consumer table; retry topic and DLQ; show per-key ordering survives a
  consumer rebalance.
- **Proof:** end-to-end lag (commit → consumed) vs. your 2-second polling dispatcher, measured and charted.
- **Effort:** 1 to 2 weeks. **Claim unlocked:** *"Replaced polling outbox with log-tailing CDC into Kafka, with
  per-key ordering and idempotent consumers; measured lag."*

#### Tier 2: the credibility step-change (harder, rarer)

**P4. Raft consensus in C# (or Go), with a deterministic simulator**
- **Proves:** consensus, replication, quorums, time. This is the single biggest gap in §13.1.
- **MVP:** leader election, log replication, persistence, a replicated KV on top. A simulator owns the clock and
  the network (drop, delay, reorder, partition) so every failure is reproducible from a seed. Property checks for
  election safety, log matching and state-machine safety.
- **Bonus that fits your skills:** a small Angular page that visualises terms, elections and log replication. It
  doubles as a portfolio showpiece.
- **Warning:** do **not** publish solutions to MIT 6.5840 labs (the course asks students not to). Build from the Raft
  paper and Ongaro's thesis with your own structure and tests.
- **Effort:** 3 to 5 weeks. **Claim unlocked:** *"Implemented Raft leader election and log replication; verified safety
  properties under simulated partitions, delays and message loss."*

**P5. Jepsen-lite for your own booking service (builds on P1)**
- **Proves:** you test the way the field tests. Almost no portfolio has this.
- **MVP:** many concurrent clients record a history of operations; faults are injected (DB partition, `kill -9`,
  clock jump); a checker verifies invariants and a simple linearizability model for a slot (claimed/free).
- **Effort:** 1 to 2 weeks after P1. **Claim unlocked:** *"Verified booking invariants under partitions and crashes
  with a history checker."*

**P6. Event-sourced ledger with rebuildable projections**
- **Proves:** append-only logs, optimistic concurrency on streams, CQRS read models, reconciliation. Fits your fintech
  background directly.
- **MVP:** double-entry postings in Postgres; unique `(stream_id, version)`; idempotent commands; snapshots; a
  projection you can drop and rebuild from the log; a reconciliation job comparing projection to ledger.
- **Effort:** 2 to 3 weeks. **Claim unlocked:** *"Event-sourced double-entry ledger with idempotent commands and
  provably rebuildable read models."*

**P7. Distributed rate limiter**
- **Proves:** shared state under contention, failure policy, clock handling.
- **MVP:** token bucket and GCRA in Redis Lua, a sliding window for comparison, ASP.NET middleware; decide and
  document fail-open vs fail-closed when Redis is down; use Redis `TIME`, not app clocks; benchmark across 3 app
  instances.
- **Effort:** 3 to 5 days. **Claim unlocked:** *"Distributed rate limiter with atomic Lua scripts and a documented
  failure policy; benchmarked across instances."*

#### Tier 3: only if you want to go deep

**P8. Dynamo-style key-value store.** Consistent hash ring with virtual nodes, N/R/W quorums, hinted handoff, read
repair, last-write-wins or vector clocks, Merkle-tree anti-entropy; kill nodes in a simulator and show convergence.
3 to 4 weeks. Pairs well with P4 (CP vs AP contrast, which is a great interview answer).

**P9. LSM-tree / write-ahead-log store.** Memtable, WAL with a configurable fsync policy, SSTables, bloom filters,
compaction; a crash-recovery test that truncates the WAL at every byte offset. 2 to 3 weeks. Shows storage internals
and crash consistency.

**P10. Durable saga / process manager.** Booking → payment → notification with compensations, timeouts and persisted
state, compared against a Temporal or MassTransit saga. 1 to 2 weeks. Lower priority because §13.2 item 8 already
claims the vocabulary for the flow you built.

### 13.4 Credibility that is not code

- **ADRs** (architecture decision records) in each public repo: context, options, decision, consequences. Five short
  ones are worth more than a long README.
- **One real postmortem** (§9 #7, the Kafka disk incident): detection, root cause, fix, prevention, no hostnames.
  Needs your answers to §11 Q1.
- **A write-skew post:** show two transactions that each pass a check and together break an invariant under
  READ COMMITTED and REPEATABLE READ, and fix it with SERIALIZABLE or a constraint. It is one of the most-asked
  interview topics and C1 gives you the real-world hook.
- **Small open-source contributions** to tools you already use: Testcontainers for .NET, Npgsql, Polly, MassTransit,
  Wolverine, Debezium docs. Even a docs fix or a reproducible bug report with a failing test shows you read other
  people's distributed code.
- **A reading log in public** (Notes section): the Raft paper, the Dynamo paper, Spanner, *Designing
  Data-Intensive Applications* chapters 5 to 9, and 3 Jepsen analyses. One paragraph each on "what this means for my
  booking service". It signals depth without needing a new project.
- **Talk at a local meetup or a recorded walkthrough** of CS1 (race-free booking). A 10-minute screen recording of the
  8-client race is a very strong LinkedIn asset.

### 13.5 What makes a repo count as evidence

Every public project should have:

- [ ] A **guarantees / non-guarantees table** at the top of the README (what it promises, what it does not).
- [ ] An **architecture diagram** (reuse the D-specs in §6 and the SVG diagram component).
- [ ] **One-command run** (`docker compose up`) and **CI with a passing badge**.
- [ ] A **test suite that races or breaks things on a real database**, not only unit tests.
- [ ] A **benchmark table** with method, hardware and date.
- [ ] A **failure-modes table** and a **known limitations** section.
- [ ] **ADRs** for the key decisions.
- [ ] No secrets or client names committed (the SNOMED `.env` problem in §3.4 must not repeat).

**Avoid:** tech-keyword projects that do not use the tech for a real reason (Kafka with one consumer and no ordering
need), "scalable" with no numbers, tutorial clones, and READMEs that read as generated.

### 13.6 Suggested order (about 10 to 12 weeks part-time)

- [x] **Week 0 (a day):** fix the SNOMED/pgvector claim in `update.md` (§13.2 item 2) *(done 2026-11-05; also retitled the profile README to backend/distributed systems)*
- [ ] Verify mypaw and record it in §3.4 *(blocked: the repo is not on the work machine; do this from the home PC)*
- [ ] **Weeks 1 to 2:** P1 `seat-hold-lab` with Toxiproxy and a numbers table; publish the first two posts from §9
- [x] **Week 3, part 1:** §13.2 items 7 and 8 *(done 2026-11-05: "When things fail" and "Limits and scale" sections on all three case studies, plus the orchestrated-saga decision on CS1)*
- [ ] **Week 3, part 2:** §13.2 items 1 and 9 (measurements need P1 to exist; the SLO page needs real targets, so write it with production numbers from §11 Q4 rather than inventing any)
- [ ] **Weeks 4 to 5:** P2 `pg-jobs`
- [ ] **Weeks 6 to 7:** P3 CDC to Kafka; add its lag chart to CS1
- [ ] **Weeks 8 to 12:** P4 Raft with the Angular visualiser (or P5 + P6 if you prefer breadth over depth)
- [ ] **Throughout:** one ADR set per repo, one post a month (§9), one Notes reading-log entry per paper
- [ ] After each project ships: record evidence in §3.1, add the claim to §7, add a case-study or project page

**If you only have time for three:** P1 (with chaos + numbers), P2, and P4. Together they cover correctness,
failure handling and consensus, which is the full arc a distributed-systems screen walks through.

### 13.7 Decisions for you

1. How many hours a week can you give this? It decides between "P1 + P2 + P3" (breadth, about 6 weeks) and adding Raft
   (depth, about 12 weeks).
2. Do you prefer to build Raft in **C#** (matches your CV) or **Go** (matches how most of this field's open-source reads)?
   C# keeps the story consistent; Go opens more doors.
3. Is it fine to keep Algomist as a low-profile side project, or should it be hidden from the distributed-systems view?
4. Which production numbers can you share (§11 Q4)? They would let CS1 to CS3 carry real figures alongside P1's benchmark.

### 13.8 Sanctioned wording for the SNOMED project (2026-11-05, from the verified repo state)

**Résumé:** Built a SNOMED CT terminology search service in .NET 10 and PostgreSQL. It uses a denormalized search table with a generated tsvector column, GIN and trigram indexes, and word-similarity typo matching. Autocomplete returns at 9.5 ms p95 with one client (18.7 ms at 16) over 547k searchable descriptions, measured on a laptop. Added a transitive-closure table (7.6M IS-A pairs) for subtree queries and value sets, an RF2 loader, and 80+ tests against a real Postgres.

**Profile README:** Postgres full-text and trigram search, an IS-A closure for value sets, and optional pgvector hybrid search in progress.

**Upgrade rule:** add "semantic" or "hybrid" accuracy or latency only after `docs/evaluation.md` has rows for a real embedding model.


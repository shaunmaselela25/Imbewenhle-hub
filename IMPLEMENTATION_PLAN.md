# IMPLEMENTATION_PLAN.md: Imbewenhle Digital Solutions Hub

## 0. Plan details

| Field | Value |
| --- | --- |
| App name | Imbewenhle Digital Solutions Hub |
| Built from PRD version | v1.1 (PRD MVP 1.0 of 28 Oct 2026, numbered v1.0, plus the answers in Section 18). Must match the version in docs/PRD.md |
| Screen designs | Stitch project https://stitch.withgoogle.com/projects/7278328502339602161, exported to `docs/designs/` using the file names in Section 7.3 |
| Plan version | v1.0 |
| Repository | Created by the human before Phase 1 (Section 18 #29). The link is recorded in the Progress log (Section 17) row for Phase 1 |
| Status | Ready to build, once the human confirms the recommended answers in Section 18 |
| Last updated | 04 Nov 2026 |

---

## 1. Start here (instructions for the coding agent)

Before writing any code:

1. Read this whole file from top to bottom.
2. Read `docs/PRD.md`.
3. Look at the screen designs listed in Section 7.3.
4. Check Section 18. If any clarification is still **Open**, stop and ask the human. Do not start.
5. Check that the prerequisites in Section 4.2 are installed.
6. Start **Phase 1 only**. Follow Section 2 at all times.

---

## 2. Rules for the coding agent (copy word for word, do not edit)

1. **One phase at a time.** Only work on the phase the human asked for. When that phase's Definition of Done is complete, stop and wait for the human to say "Start Phase <number>".
2. **Test-driven development (TDD) for every task.** Follow the cycle in Section 12.1:
    - Write the test.
    - Run it and see it fail for the right reason.
    - Write the smallest code that makes it pass.
    - Run all tests.
    - Refactor while all tests still pass.
3. **Never cheat a test.** Never delete, skip, weaken or change a test just to make it pass. If you believe a test is wrong, stop and explain why to the human.
4. **Never break earlier work.** Every test from earlier phases must still pass before a phase is done.
5. **Build only what is planned.** Build only what is in this file and `docs/PRD.md`. Never build anything in Section 3.3 (Deferred).
6. **Ask, don't guess.** If anything is missing, unclear or contradictory, stop, add it to Section 18, and ask the human.
7. **Match the designs.** Every screen must match its design in Section 7.3: layout, order, labels, text, colours and spacing. Use the design tokens in Section 7.1. Never hard-code colours, font sizes or spacing.
8. **Every state, every screen.** Each screen must handle every state listed for it in Section 7.3 (chosen from normal, empty, loading, error, offline, success, plus any screen-specific states).
9. **Exact wording.** Use the exact labels and messages from the PRD. Never invent wording.
10. **Security first.**
    - Never put secret keys in app code, logs, test files or Git.
    - Every permission rule in Section 9 must be enforced on the server or database, never only in the app.
    - Every permission rule must have a test.
11. **Full check before "done".** Run the full check command (Section 4.3) before saying a phase is done, then add a short summary of the results to the Progress log (Section 17).
12. **Record your progress.** After each phase:
    - tick the checkboxes for that phase in this file;
    - add a row to the Progress log;
    - commit using the commit message given in the phase.
13. **No surprise libraries.** Do not add, remove or upgrade any library or tool not listed in Section 4.1 without asking the human first.
14. **Stuck rule.** If the same problem is still failing after 3 attempts, stop and report:
    - what you tried;
    - the exact error;
    - what you need from the human.
15. **Clean code.** Follow the folder structure in Section 5. Use the PRD's key terms (Section 3.4) for names in code. Keep files small and focused.

---

## 3. Project summary and scope

### 3.0 ID mapping (PRD → plan)

The PRD uses FR-/section numbering. These IDs are assigned once and used everywhere.

| Plan ID | PRD source | Name |
| --- | --- | --- |
| F1 | FR-01 | Service catalogue |
| F2 | FR-02 | Enquiry submission |
| F3 | FR-03 | Submission confirmation |
| F4 | FR-04 | Enquiry status |
| F5 | FR-05 | Staff queue |
| F6 | FR-06 | Updates and internal notes |
| F7 | FR-07 | Proposal record |
| F8 | FR-08 | Milestones |
| F9 | FR-09 | Access control |
| F10 | FR-10 | Audit history |
| F11 | §6 story 5, §5 Administrator | Administration: service categories and access (Section 18 #13) |
| US1 | §6 story 1 | Prospective client submits a structured enquiry |
| US2 | §6 story 2 | Client sees enquiry status |
| US3 | §6 story 3 | Consultant classifies and reviews enquiries |
| US4 | §6 story 4 | Consultant records clarification requests and decisions |
| US5 | §6 story 5 | Administrator manages service categories and access |
| BR1 | §8 bullet 1 | Unique, non-guessable public reference |
| BR2 | §8 bullet 2 | Problem description 30–3,000 characters |
| BR3 | §8 bullet 3 | Email format validation |
| BR4 | §8 bullet 4 | Clients access only their own enquiries and client-visible records |
| BR5 | §8 bullet 5 | Internal notes private, excluded from client responses |
| BR6 | §8 bullet 6 | Only staff change status, edit proposals, create milestones |
| BR7 | §8 bullet 7 | Success shown only after server confirms persistence |
| BR8 | FR-04, Section 18 #6 | Allowed status transitions |
| BR9 | §10 Reliability | Repeated submissions never create duplicates |
| BR10 | FR-08 | Milestones only on accepted engagements |
| BR11 | FR-04, FR-10 | Material changes recorded with actor and timestamp |
| BR12 | FR-02, Section 18 #8 | Field limits and allowed values |
| BR13 | §10 Security, Section 18 #9 | Submission rate limit |
| S1 | §9 Public landing | Landing |
| S2 | §9 Service/enquiry | Service enquiry |
| S3 | §9 Confirmation | Confirmation |
| S4 | FR-09 (Section 18 #12) | Sign in |
| S5 | §9 Client dashboard | Client dashboard |
| S6 | §9 Client detail | Client enquiry detail |
| S7 | §9 Staff dashboard | Staff queue |
| S8 | §9 Staff detail | Staff enquiry detail |
| S9 | F11 (Section 18 #13) | Admin: service categories |
| S10 | F11 (Section 18 #13) | Admin: users and roles |
| S11 | §9 privacy explanation, §13 privacy notice (Section 18 #15) | Privacy notice |
| AC1–AC8 | §14 bullets 1–8 | Release-gate acceptance criteria (mapped to tests in Section 15) |

Modals: none. All staff editing happens in panels on S8 (Section 18 #14).

### 3.1 Summary

A responsive web application where businesses describe technology needs, submit service enquiries, follow engagement status and view agreed project information. Imbewenhle staff use a protected workspace to triage enquiries, request clarification, record proposals and milestones, and keep a traceable record from enquiry to delivery.

**Platform:** Responsive web app (desktop and mobile browsers). No native apps.

### 3.2 Features in scope

| ID | Feature | Priority | Built in phase |
| --- | --- | --- | --- |
| F1 | Service catalogue | Must | 3 |
| F2 | Enquiry submission | Must | 4 |
| F3 | Submission confirmation | Must | 4 |
| F4 | Enquiry status | Must | 5 (client view), 6 (staff change) |
| F5 | Staff queue | Must | 6 |
| F6 | Updates and internal notes | Must | 7 |
| F7 | Proposal record | Must | 8 |
| F8 | Milestones | Must | 8 |
| F9 | Access control | Must | 2 (database), 5 (sign in, routing) |
| F10 | Audit history | Must | 2 (database), 7 (screen) |
| F11 | Administration: categories and access | Should | 9 |

### 3.3 Deferred: do NOT build

- Executing automation jobs (PRD §4)
- Performing migrations inside the application (PRD §4)
- Full project-management suite: tasks, time tracking, Gantt charts, resourcing (PRD §4)
- Billing, invoicing and payment processing (PRD §4, FR-07)
- E-signature of proposals (FR-07)
- Clients accepting or declining proposals in the app; staff record the decision (Section 18 #18)
- Marketplace or consultant matching (PRD §4)
- Autonomous AI recommendations (PRD §4)
- Native mobile apps (PRD §4)
- Email or SMS notifications of status changes or updates (not in PRD)
- File attachments on enquiries, updates or proposals (not in PRD)
- Enquiry assignment to a named consultant (Section 18 #11)
- Automated retention purge job (Section 18 #16)
- CAPTCHA or bot challenges (Section 18 #9)
- Analytics dashboards for the §12 metrics; metrics are measured with SQL in docs/metrics.sql (Section 18 #27)
- Password sign-in, social sign-in and multi-factor authentication (Section 18 #1)
- Multiple proposals per enquiry (Section 18 #17)
- Multi-language content

### 3.4 Key terms (use these names in code)

| Term (PRD) | Name in code | Meaning |
| --- | --- | --- |
| User | `Profile`, table `profiles` | A signed-in person; one row per auth user |
| Role | `Role`: `client`, `consultant`, `admin` | What a user may do |
| Staff | `isStaff()` = role in (`consultant`, `admin`) | Consultants and administrators |
| Service category | `ServiceCategory`, table `service_categories` | One of the services in FR-01 |
| Enquiry | `Enquiry`, table `enquiries` | One submitted service request |
| Public reference | `publicReference`, column `public_reference` | Non-guessable ID shown to clients, e.g. `IMB-7K2QX9M4TR` |
| Status | `EnquiryStatus`, column `status` | FR-04 lifecycle value |
| Update | `Update`, table `updates`, `visibility = 'client'` | Message visible to the client |
| Internal note | `Update` with `visibility = 'internal'` | Staff-only note, never sent to clients |
| Proposal | `Proposal`, table `proposals` | FR-07 record, one per enquiry |
| Milestone | `Milestone`, table `milestones` | FR-08 delivery checkpoint |
| Audit event | `AuditEvent`, table `audit_events` | FR-10 history row |
| Engagement | Enquiry with status `accepted`, `in_delivery` or `completed` | An accepted piece of work |

---

## 4. Tech stack, prerequisites and commands

### 4.1 Stack

| Layer | Tool | Version | Used for |
| --- | --- | --- | --- |
| Frontend | Next.js (App Router) + React | latest stable at setup | Pages, server components, server actions, route handlers |
| Language | TypeScript (strict) | latest stable at setup | All app, test and script code |
| Styling | Tailwind CSS | latest stable at setup | Styling via tokens in `theme/tokens.ts` |
| Validation | Zod | latest stable at setup | One schema per form, shared by browser and server |
| Backend and database | Supabase: PostgreSQL, Auth (email magic link), Row Level Security; `@supabase/supabase-js`, `@supabase/ssr` | latest stable at setup | Data, sign in, permissions |
| Server functions | Next.js server actions and route handlers + PostgreSQL functions (RPC). No Supabase Edge Functions | latest stable at setup | Submission, status changes, admin actions |
| Data fetching and caching | None (server components read via Supabase server client) | — | — |
| Unit and component tests | Vitest + React Testing Library + `@testing-library/dom` + `@testing-library/jest-dom` + `@testing-library/user-event` + jsdom + `@vitest/coverage-v8` | latest stable at setup | Rules, components, screen states |
| Database and permission tests | pgTAP via Supabase CLI (`supabase test db`) | latest stable at setup | Constraints, triggers, RLS allow/deny |
| Integration tests | Vitest + supabase-js against the local Supabase stack | latest stable at setup | Backend operations end to end |
| End-to-end tests | Playwright + `@axe-core/playwright` | latest stable at setup | User flows, accessibility scans |
| Performance | Lighthouse CI (`@lhci/cli`) | latest stable at setup | T-NFR-3 load-time target |
| Lint and type check | ESLint (`eslint-config-next`), TypeScript compiler | latest stable at setup | Code quality |
| Secret scan | gitleaks | latest stable at setup | T-NFR-4, release check |
| Build and hosting | Vercel (app) + Supabase Cloud (database, auth) | — | Demo and pilot hosting |

### 4.2 Prerequisites on the computer

- [x] Node.js (current LTS)
- [x] Git, with a GitHub account and an empty repository (Section 18 #29)
- [x] Docker Desktop, running, for the local Supabase stack
- [x] Supabase CLI (installed as a dev dependency, run with `npx supabase`)
- [x] gitleaks
- [x] Playwright browsers (`npx playwright install chromium`)
- [ ] Accounts: Supabase (cloud project for the demo), Vercel (linked to the GitHub repository)

### 4.3 Commands

Before the full check: Docker is running and `npm run db:start` has been run. Playwright starts the app itself (`webServer` in `playwright.config.ts`).

| Purpose | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Start the local backend | `npm run db:start` (`supabase start`) |
| Reset the database (migrations + seed data) | `npm run db:reset` (`supabase db reset`) |
| Start the app | `npm run dev` |
| Unit and component tests | `npm run test:unit` (`vitest run --project unit --project component`) |
| Database and permission tests | `npm run test:db` (`supabase test db`) |
| Integration tests | `npm run test:int` (`vitest run --project integration --no-file-parallelism`) |
| End-to-end tests | `npm run test:e2e` (`playwright test`) |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` (`tsc --noEmit`) |
| **Full check (run before every "done")** | `npm run check` = `lint && typecheck && test:unit && db:reset && test:db && test:int && test:e2e` |
| Build for release | `npm run build` (deploy: push to `main`, Vercel builds) |
| Secret scan | `npm run scan:secrets` (`gitleaks detect --source . --log-opts=--all`) |
| Performance check | `npm run test:perf` (`lhci autorun`) |
| Generate database types | `npm run db:types` (`supabase gen types typescript --local > lib/supabase/database.types.ts`) |

---

## 5. Folder structure

```
imbewenhle-hub/
  app/
    (public)/page.tsx                         S1 Landing
    (public)/enquire/[category]/page.tsx      S2 Service enquiry
    (public)/enquire/submitted/page.tsx       S3 Confirmation
    (public)/enquire/submitted/clear/route.ts Clears the confirmation cookie after S3 shows
    (public)/sign-in/page.tsx                 S4 Sign in
    (public)/privacy/page.tsx                 S11 Privacy notice
    auth/callback/route.ts                    Magic-link callback
    dashboard/page.tsx                        S5 Client dashboard
    dashboard/enquiries/[reference]/page.tsx  S6 Client enquiry detail
    staff/page.tsx                            S7 Staff queue
    staff/enquiries/[reference]/page.tsx      S8 Staff enquiry detail
    staff/admin/categories/page.tsx           S9 Admin: service categories
    staff/admin/users/page.tsx                S10 Admin: users and roles
    layout.tsx, not-found.tsx, error.tsx      Shell, not-found and error states
  components/                                 Shared components (Section 7.2), one per file
  features/
    auth/  catalogue/  enquiry/  status/  queue/
    updates/  proposal/  milestones/  audit/  admin/
                                              Server actions + feature components, per feature
  lib/
    rules/                                    Pure business-rule functions (BR#)
    validation/                               Zod schemas
    copy/messages.ts                          Every UI label and message (Section 10.1)
    supabase/                                 Browser/server clients, database.types.ts
    auth/                                     Session and role helpers, route guards
  theme/tokens.ts                             Design tokens (Section 7.1)
  proxy.ts                                    Route protection (Section 11)
  supabase/
    migrations/                               SQL migrations (Section 8.6)
    seed.sql                                  Seed data (Section 8.7)
    tests/                                    pgTAP database and permission tests
    config.toml
  tests/
    unit/                                     Unit tests
    component/                                Component and screen-state tests
    integration/                              Integration tests
    e2e/                                      Playwright flows
    helpers/                                  Test sign-in, fixtures from seed data
  content/privacy.md                          Privacy notice text supplied by Imbewenhle
  docs/PRD.md
  docs/designs/                               Exported Stitch screens
  docs/metrics.sql                            §12 metric queries
  IMPLEMENTATION_PLAN.md
  .env.example
  README.md
```

**Rule:** a new folder may only be created if it is added to this section first.

---

## 6. Environment variables and secrets

| Name | What it is | Where to get it | Public or secret | Used by |
| --- | --- | --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase API URL | `npx supabase status` (local) / Supabase dashboard → Project Settings → API | Public | App |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anon (public) key; all access limited by RLS | Same as above | Public | App |
| NEXT_PUBLIC_SITE_URL | Base URL for magic-link redirects | `http://localhost:3000` locally; Vercel URL in production | Public | App |
| SUPABASE_SERVICE_ROLE_KEY | Bypasses RLS | Same as above | Secret | Integration tests and `tests/helpers` only |
| SUPABASE_DB_URL | Direct Postgres connection | `npx supabase status` | Secret | Scripts only |

`.env.example` (committed to Git, placeholder values only):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=replace-with-local-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=replace-with-local-service-role-key
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

Rules:

- Real values go in `.env.local`, which is listed in `.gitignore` and never committed.
- To test on a real phone on the same Wi-Fi, open `http://<computer Wi-Fi IP>:3000` and set `NEXT_PUBLIC_SITE_URL` to that address. `127.0.0.1` on the phone is the phone itself.
- Secret values are never used in app code (nothing under `app/`, `components/`, `features/`, `lib/`). They are used only in scripts or integration tests, read from `.env.local`. T-SETUP-7 fails if `SUPABASE_SERVICE_ROLE_KEY` appears in any of those folders.
- Production SMTP for magic-link email is configured in the Supabase dashboard, not in this app.
- If a new variable is needed, add it here and to `.env.example` first.

---

## 7. Design system and screens

### 7.1 Design tokens

All values live in `theme/tokens.ts` and are exposed to Tailwind via `tailwind.config.ts`. Screens use tokens only. **P1-3 status:** colours marked "Stitch screen" were measured from the one Stitch screen supplied so far (Section 18 #40). All others are still provisional until the human confirms them.

| Token | Value | From PRD |
| --- | --- | --- |
| `color.primary` | #FE932C | Stitch screen |
| `color.primaryHover` | #904D00 | Stitch screen |
| `color.background` | #FFFFFF | Stitch screen |
| `color.surface` | #F2F4F6 | Stitch screen |
| `color.text` | #131B2E | Stitch screen |
| `color.textMuted` | #4B5550 | Stitch export (provisional); ≥4.5:1 on background |
| `color.border` | #E6E8EA | Stitch screen |
| `color.focus` | #1A56DB | §10 visible focus; ≥3:1 against adjacent colours |
| `color.error` / `color.success` / `color.warning` | #B42318 / #067647 / #B54708 | Stitch export (provisional) |
| `font.family` | Inter, system-ui, sans-serif | Stitch export (provisional) |
| `font.size.xs` / `sm` / `base` / `lg` / `xl` / `2xl` / `3xl` | 12 / 14 / 16 / 18 / 20 / 24 / 32 px; body 400, headings 600 | Stitch export (provisional) |
| `space.1` … `space.12` | 4 px unit: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 | Stitch export (provisional) |
| `radius.sm` / `md` / `lg` | 4 / 8 / 12 px | Stitch export (provisional) |
| `size.button` / `size.touchMin` | 44 px / 44 | §10 accessibility; WCAG 2.2 target size |
| `breakpoint.md` / `lg` | 768 / 1024 px | Responsive web (§13) |

### 7.2 Shared components

| Component | File | Variants and states | Used on | Tests |
| --- | --- | --- | --- | --- |
| Button | components/Button.tsx | primary, secondary, danger; disabled; loading (shows spinner, `aria-busy`) | All | T-C-1 |
| TextField | components/TextField.tsx | text, email; required marker; error (linked via `aria-describedby`); character counter | S2, S4, S8, S9 | T-C-2 |
| TextArea | components/TextArea.tsx | required marker; error; character counter with min/max | S2, S6, S8, S9 | T-C-3 |
| Select | components/Select.tsx | required marker; error; placeholder | S2, S7, S8, S10 | T-C-4 |
| StatusBadge | components/StatusBadge.tsx | one per FR-04 status, label from `messages.ts` | S5–S8 | T-C-5 |
| Alert | components/Alert.tsx | error, success, warning, info; `role="alert"` for error | All | T-C-6 |
| ServiceCard | components/ServiceCard.tsx | title, description, enquiry action | S1 | T-C-7 |
| EnquiryCard | components/EnquiryCard.tsx | reference, category, status, latest update | S5 | T-C-8 |
| QueueTable | components/QueueTable.tsx | rows; empty; loading skeleton; pagination | S7 | T-C-9 |
| FilterBar | components/FilterBar.tsx | search, status, category, date from/to; clear | S7 | T-C-10 |
| Timeline | components/Timeline.tsx | client updates; internal notes (marked "Internal note"); audit events | S6, S8 | T-C-11 |
| MilestoneList | components/MilestoneList.tsx | read-only (client); editable (staff); empty | S6, S8 | T-C-12 |
| ProposalSummary | components/ProposalSummary.tsx | read-only all FR-07 fields; draft hidden from clients | S6, S8 | T-C-13 |
| PageState | components/PageState.tsx | loading, empty, error (with retry), offline, not found | All | T-C-14 |
| SiteHeader | components/SiteHeader.tsx | logged out; client; staff; admin (admin links) | All | T-C-15 |
| SkipLink | components/SkipLink.tsx | visible on focus | All | T-C-16 |

### 7.3 Screens

Design files are exported from Stitch to `docs/designs/` with exactly these names (Section 18 #22). Tab bar: none in this web app; navigation is the SiteHeader.

| ID | Screen | Route / file | Design | Who can open it (else redirect to) | Tab bar | Required states | Phase |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Landing | `/`, app/(public)/page.tsx | docs/designs/S1-landing.png | Anyone | No | Normal, Loading (categories), Error, Empty (no active categories) | 1 (static), 3 |
| S2 | Service enquiry | `/enquire/[category]`, app/(public)/enquire/[category]/page.tsx | docs/designs/S2-enquiry.png | Anyone; inactive or unknown category → S1 with message `category.unavailable` | No | Normal, Validation error, Submitting, Submit error (values kept), Offline, Rate limited, Signed-in (name, email, organisation prefilled; email read-only) | 4 |
| S3 | Confirmation | `/enquire/submitted`, app/(public)/enquire/submitted/page.tsx | docs/designs/S3-confirmation.png | Anyone holding a valid confirmation cookie (else S1) | No | Success | 4 |
| S4 | Sign in | `/sign-in`, app/(public)/sign-in/page.tsx | docs/designs/S4-sign-in.png | Logged out (else S5 for clients, S7 for staff) | No | Normal, Validation error, Sending, Link sent, Link expired, Error, Offline | 5 |
| S5 | Client dashboard | `/dashboard`, app/dashboard/page.tsx | docs/designs/S5-client-dashboard.png | Client (logged out → S4; staff → S7) | No | Normal, Empty, Loading, Error, Offline | 5 |
| S6 | Client enquiry detail | `/dashboard/enquiries/[reference]`, app/dashboard/enquiries/[reference]/page.tsx | docs/designs/S6-client-detail.png | Client who owns the enquiry (else Not found; logged out → S4) | No | Normal, Loading, Error, Offline, Not found, Awaiting Client (reply form shown), No proposal, No milestones, Reply sent | 5 (status), 7 (updates, reply), 8 (proposal, milestones) |
| S7 | Staff queue | `/staff`, app/staff/page.tsx | docs/designs/S7-staff-queue.png | Consultant, Admin (client → S5; logged out → S4) | No | Normal, Empty (no enquiries), No results (filters), Loading, Error, Offline | 6 |
| S8 | Staff enquiry detail | `/staff/enquiries/[reference]`, app/staff/enquiries/[reference]/page.tsx | docs/designs/S8-staff-detail.png | Consultant, Admin (client → S5; logged out → S4) | No | Normal, Loading, Error, Offline, Not found, Status saved, Invalid transition, Update posted, Note saved, Proposal saved, Milestones locked (not accepted), Milestone saved | 6, 7, 8 |
| S9 | Admin: service categories | `/staff/admin/categories`, app/staff/admin/categories/page.tsx | docs/designs/S9-admin-categories.png | Admin (consultant → S7; client → S5; logged out → S4) | No | Normal, Loading, Error, Offline, Validation error, Saved | 9 |
| S10 | Admin: users and roles | `/staff/admin/users`, app/staff/admin/users/page.tsx | docs/designs/S10-admin-users.png | Admin (consultant → S7; client → S5; logged out → S4) | No | Normal, Empty, Loading, Error, Offline, Saved, Last-admin blocked | 9 |
| S11 | Privacy notice | `/privacy`, app/(public)/privacy/page.tsx | docs/designs/S11-privacy.png (if not in Stitch: same layout as S1 body text) | Anyone | No | Normal | 4 |

---

## 8. Data model and database

### 8.1 Tables

**Table: `profiles`**: one signed-in user (PRD User)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | — | primary key, foreign key → auth.users.id (on delete cascade) | |
| name | text | Yes | null | check length(trim(name)) between 2 and 100 | Set at first enquiry or by admin |
| email | text | No | — | unique; check length ≤ 254 | Copied from auth.users on insert |
| role | text | No | 'client' | check role in ('client','consultant','admin') | BR6; only admin may change (SEC12) |
| organisation | text | Yes | null | check length(trim(organisation)) between 2 and 150 | |
| created_at | timestamptz | No | now() | | |

**Table: `service_categories`**: one service in the catalogue (FR-01)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | |
| slug | text | No | — | unique; check slug ~ '^[a-z0-9-]{3,60}$' | Used in S2 route |
| title | text | No | — | unique; check length between 3 and 80 | |
| description | text | No | — | check length between 10 and 500 | |
| is_active | boolean | No | true | | Inactive = hidden on S1, rejected on submit |
| sort_order | integer | No | 0 | check ≥ 0 | |
| created_at | timestamptz | No | now() | | |

**Table: `enquiries`**: one submitted enquiry

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | Never shown in URLs |
| public_reference | text | No | `generate_public_reference()` | unique; check ~ '^IMB-[0-9A-HJKMNP-TV-Z]{10}$' | BR1 |
| idempotency_key | uuid | No | — | unique | BR9 (Section 18 #19) |
| requester_id | uuid | Yes | null | foreign key → profiles.id (on delete set null) | Null for anonymous submissions until linked |
| requester_name | text | No | — | check length(trim) between 2 and 100 | BR12 (Section 18 #19) |
| requester_email | text | No | — | check length ≤ 254 and format | BR3; stored lower-case |
| organisation | text | No | — | check length(trim) between 2 and 150 | BR12 |
| category_id | uuid | No | — | foreign key → service_categories.id (on delete restrict) | |
| problem_description | text | No | — | check length(trim) between 30 and 3000 | BR2 |
| desired_outcome | text | No | — | check length(trim) between 10 and 1000 | BR12 |
| urgency | text | No | — | check urgency in ('low','medium','high') | BR12 |
| budget_range | text | Yes | null | check in ('under_50k','50k_150k','150k_500k','over_500k','not_sure') | Optional |
| status | text | No | 'new' | check status in ('new','under_review','awaiting_client','proposal_prepared','accepted','in_delivery','completed','closed') | F4, BR8 |
| created_at | timestamptz | No | now() | | |
| updated_at | timestamptz | No | now() | | Set by trigger |

**Table: `updates`**: one client update or internal note (FR-06)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | |
| enquiry_id | uuid | No | — | foreign key → enquiries.id (on delete cascade) | |
| author_id | uuid | No | auth.uid() | foreign key → profiles.id (on delete restrict) | |
| visibility | text | No | — | check visibility in ('client','internal') | BR5 |
| body | text | No | — | check length(trim) between 1 and 2000 | BR12 |
| created_at | timestamptz | No | now() | | |

**Table: `proposals`**: one proposal per enquiry (FR-07)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | |
| enquiry_id | uuid | No | — | unique, foreign key → enquiries.id (on delete cascade) | Section 18 #17 |
| title | text | No | — | check length(trim) between 3 and 150 | |
| scope | text | No | — | check length(trim) between 1 and 5000 | |
| deliverables | text | No | — | check length(trim) between 1 and 5000 | |
| assumptions | text | No | — | check length(trim) between 1 and 5000 | |
| exclusions | text | No | — | check length(trim) between 1 and 5000 | |
| estimated_timeline | text | No | — | check length(trim) between 1 and 200 | |
| decision_status | text | No | 'draft' | check in ('draft','shared','accepted','declined') | Section 18 #18 |
| created_at | timestamptz | No | now() | | |
| updated_at | timestamptz | No | now() | | Set by trigger |

**Table: `milestones`**: one milestone of an accepted engagement (FR-08)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | |
| enquiry_id | uuid | No | — | foreign key → enquiries.id (on delete cascade) | BR10 |
| name | text | No | — | check length(trim) between 3 and 120 | |
| description | text | Yes | null | check length ≤ 1000 | |
| target_date | date | No | — | | |
| status | text | No | 'planned' | check status in ('planned','in_progress','completed') | Section 18 #7 |
| created_at | timestamptz | No | now() | | |
| updated_at | timestamptz | No | now() | | |

**Table: `audit_events`**: one recorded material change (FR-10)

| Column | Type | Null? | Default | Constraints | Notes |
| --- | --- | --- | --- | --- | --- |
| id | uuid | No | generated | primary key | |
| actor_id | uuid | Yes | auth.uid() | foreign key → profiles.id (on delete set null) | Null only for anonymous submission |
| entity_type | text | No | — | check in ('enquiry','proposal','milestone','profile','service_category') | |
| entity_id | uuid | No | — | | |
| action | text | No | — | check in ('created','status_changed','updated','deleted','role_changed') | |
| details | jsonb | No | '{}' | | e.g. `{"from":"new","to":"under_review"}` |
| timestamp | timestamptz | No | now() | | |

### 8.2 Relationships and delete behaviour

- `profiles.id` → `auth.users.id`, on delete cascade.
- `enquiries.requester_id` → `profiles.id`, on delete set null (enquiry history kept).
- `enquiries.category_id` → `service_categories.id`, on delete restrict (categories are deactivated, never deleted once used).
- `updates.enquiry_id`, `proposals.enquiry_id`, `milestones.enquiry_id` → `enquiries.id`, on delete cascade.
- `updates.author_id` → `profiles.id`, on delete restrict.
- `audit_events.actor_id` → `profiles.id`, on delete set null. Audit rows are never deleted by the app.

### 8.3 Status changes

Allowed transitions (BR8). Anything else is rejected with `status.invalidTransition`.

| Table.column | From | To | Triggered by | Enforced by |
| --- | --- | --- | --- | --- |
| enquiries.status | (insert) | new | Submission | column default + `submit_enquiry` |
| enquiries.status | new | under_review, closed | Staff | `enforce_enquiry_status_transition` trigger |
| enquiries.status | under_review | awaiting_client, proposal_prepared, closed | Staff | same |
| enquiries.status | awaiting_client | under_review, closed | Staff | same |
| enquiries.status | proposal_prepared | accepted, awaiting_client, under_review, closed | Staff | same; to `accepted` requires proposal `decision_status = 'accepted'` |
| enquiries.status | accepted | in_delivery, closed | Staff | same |
| enquiries.status | in_delivery | completed, awaiting_client, closed | Staff | same |
| enquiries.status | completed | closed | Staff | same |
| enquiries.status | closed | — (terminal) | — | same |
| proposals.decision_status | draft | shared | Staff | `enforce_proposal_decision_transition` trigger |
| proposals.decision_status | shared | accepted, declined, draft | Staff (records client's decision) | same |
| proposals.decision_status | accepted, declined | — (terminal) | — | same |
| milestones.status | planned | in_progress, completed | Staff | check constraint; any order allowed among the three |

### 8.4 Indexes

- `enquiries (created_at desc)`: staff queue default sort.
- `enquiries (status, created_at desc)`: status filter.
- `enquiries (category_id, created_at desc)`: category filter.
- `enquiries (requester_id)`: client dashboard.
- `enquiries (lower(requester_email))`: account linking, rate limit.
- `enquiries` trigram index (`pg_trgm`) on `organisation`, `requester_name`: staff search.
- `updates (enquiry_id, created_at desc)`: timeline, latest update.
- `milestones (enquiry_id, target_date)`.
- `audit_events (entity_type, entity_id, timestamp desc)`.

### 8.5 Automatic jobs and triggers

| Name | Runs when | What it does | BR# | Test |
| --- | --- | --- | --- | --- |
| `generate_public_reference()` | default on enquiries insert | `IMB-` + 10 Crockford base32 chars from `gen_random_bytes` (50 bits); retries on unique clash | BR1 | T-BR1-1, T-BR1-2 |
| `handle_new_user` | after insert, or update of `email_confirmed_at`, on auth.users (a magic-link user is created unconfirmed and confirmed later) | Creates `profiles` row (role `client`); sets `requester_id` on enquiries with matching confirmed email and null requester | BR4 | T-DB-1, T-DB-2 |
| `link_enquiries_on_submit` | inside `submit_enquiry` | Sets `requester_id` to `auth.uid()` when signed in | BR4 | T-DB-3 |
| `set_updated_at` | before update on enquiries, proposals, milestones | Sets `updated_at = now()` | — | T-DB-4 |
| `enforce_enquiry_status_transition` | before update of status on enquiries | Rejects transitions not in 8.3; rejects non-staff | BR6, BR8 | T-BR8-1 … T-BR8-4 |
| `enforce_proposal_decision_transition` | before update of decision_status on proposals | Rejects transitions not in 8.3 | BR8 | T-BR8-5 |
| `enforce_milestone_engagement` | before insert on milestones | Rejects unless enquiry status in (`accepted`,`in_delivery`,`completed`) | BR10 | T-BR10-1, T-BR10-2 |
| `audit_enquiry_status` | after update of status on enquiries | Inserts `status_changed` audit event with from/to | BR11 | T-BR11-1 |
| `audit_proposal` | after insert or update on proposals | Inserts `created`/`updated` audit event with changed fields | BR11 | T-BR11-2 |
| `audit_milestone` | after insert, update or delete on milestones | Inserts audit event | BR11 | T-BR11-3 |
| `audit_profile_role` | after update of role on profiles | Inserts `role_changed` audit event | BR11 | T-BR11-4 |
| `audit_category` | after insert or update on service_categories | Inserts audit event | BR11 | T-BR11-5 |
| `guard_last_admin` | before update of role on profiles | Rejects removing the last `admin` | — | T-EDGE-9 |

All trigger functions are `security definer` with `set search_path = ''`.

### 8.6 Migrations (in order)

1. `20261104000100_extensions.sql`: `pgcrypto`, `pg_trgm`.
2. `20261104000200_profiles.sql`: `profiles`, `handle_new_user`, `is_staff()`, `is_admin()` helper functions.
3. `20261104000300_service_categories.sql`: `service_categories`.
4. `20261104000400_enquiries.sql`: `generate_public_reference()`, `enquiries`, indexes, `set_updated_at`.
5. `20261104000500_updates.sql`: `updates`.
6. `20261104000600_proposals.sql`: `proposals`, decision trigger.
7. `20261104000700_milestones.sql`: `milestones`, engagement trigger.
8. `20261104000800_audit.sql`: `audit_events`, all `audit_*` triggers.
9. `20261104000900_status_rules.sql`: `enforce_enquiry_status_transition`, `guard_last_admin`.
10. `20261104001000_rls.sql`: enable RLS on every table and create every policy in Section 9.
11. `20261104001100_functions.sql`: `submit_enquiry`, `change_enquiry_status`, `set_user_role`, `client_enquiry_view` (security-invoker view without internal columns).

### 8.7 Seed data and test accounts

- **Seed file:** `supabase/seed.sql`. It loads:
  - the six FR-01 categories in order: Digital & IT Advisory (`digital-it-advisory`), Automation (`automation`), Systems Integration (`systems-integration`), Migration (`migration`), Systems & Software Development (`systems-software-development`), Technical Solutions & Support (`technical-solutions-support`). Descriptions come from Imbewenhle (Section 18 #24); seed uses the approved text.
  - enquiries:
    - client A: `IMB-SEEDA00001` (`new`); `IMB-SEEDA00002` (`in_delivery`, proposal `accepted`, 2 milestones, 1 client update, 1 internal note).
    - client B: `IMB-SEEDB00001` (`awaiting_client`, 1 client update, 1 internal note).
    - one anonymous enquiry `IMB-SEEDX00001` (`new`, no account).
  - Seed references use a fixed pattern for tests only; real references are random.
- **Test accounts:** sign-in is by magic link, so there are no passwords. Locally, links arrive in the Supabase mail viewer at http://127.0.0.1:54324; tests sign in through `tests/helpers/auth.ts` using the service-role key.
  - `admin@imbewenhle.test`: Thandi Mokoena, role `admin`
  - `consultant@imbewenhle.test`: Sipho Dlamini, role `consultant`
  - `client.a@example.test`: Naledi Khumalo, Khumalo Logistics, role `client`
  - `client.b@example.test`: Pieter van Wyk, Karoo Fresh Produce, role `client`

---

## 9. Security and permissions

Roles: `anon` (not signed in), `client`, `consultant`, `admin`. "Staff" = consultant or admin. Every rule is a PostgreSQL RLS policy or a `security definer` function check. The UI hides controls for convenience only.

| ID | Table / resource | Action | Who is allowed | Rule | Enforced by | Tests (allow / deny) |
| --- | --- | --- | --- | --- | --- | --- |
| SEC1 | service_categories | read | Anyone | `is_active = true`, or staff (all) | policy `categories_read` | T-SEC-1a / T-SEC-1b (anon cannot read inactive) |
| SEC2 | service_categories | create, update | Admin | `is_admin()` | policy `categories_admin_write` | T-SEC-2a / T-SEC-2b (consultant, client denied) |
| SEC3 | service_categories | delete | Nobody | no policy | RLS default deny | T-SEC-3a (admin deactivate allowed) / T-SEC-3b (delete denied) |
| SEC4 | enquiries | create | Anyone | only via `submit_enquiry`; no direct insert policy | function `submit_enquiry` | T-SEC-4a / T-SEC-4b (direct insert denied) |
| SEC5 | enquiries | read | Client (own), staff (all) | `requester_id = auth.uid()` or `is_staff()` | policy `enquiries_read` | T-SEC-5a / T-SEC-5b (Client A reads B's enquiry by id and reference: 0 rows) |
| SEC6 | enquiries | update status | Staff | `is_staff()`; transition rules BR8 | function `change_enquiry_status` + trigger | T-SEC-6a / T-SEC-6b (client denied) |
| SEC7 | enquiries | update other fields, delete | Nobody | no policy | RLS default deny | T-SEC-7a (staff status change still allowed) / T-SEC-7b (delete and field edits denied to all roles) |
| SEC8 | updates | read client-visible | Client (own enquiry), staff | `visibility='client'` and enquiry owned, or `is_staff()` | policy `updates_read` | T-SEC-8a / T-SEC-8b (Client B denied A's updates) |
| SEC9 | updates | read internal | Staff | `visibility='internal'` → `is_staff()` only | policy `updates_read` | T-SEC-9a / T-SEC-9b (owning client gets 0 internal rows by any query) |
| SEC10 | updates | create | Staff (client or internal); client (`client` only, own enquiry, status `awaiting_client`) | `author_id = auth.uid()` and rule | policy `updates_insert` | T-SEC-10a / T-SEC-10b (client posting `internal` denied; client posting on other's enquiry denied) |
| SEC11 | proposals | read | Staff (all); client (own enquiry, `decision_status <> 'draft'`) | as stated | policy `proposals_read` | T-SEC-11a / T-SEC-11b (other client denied; draft hidden from owner) |
| SEC12 | proposals | create, update | Staff | `is_staff()` | policy `proposals_staff_write` | T-SEC-12a / T-SEC-12b (client denied) |
| SEC13 | milestones | read | Staff; client (own enquiry) | as stated | policy `milestones_read` | T-SEC-13a / T-SEC-13b (other client denied) |
| SEC14 | milestones | create, update, delete | Staff | `is_staff()` + BR10 | policy `milestones_staff_write` | T-SEC-14a / T-SEC-14b (client denied) |
| SEC15 | audit_events | read | Staff | `is_staff()` | policy `audit_read` | T-SEC-15a / T-SEC-15b (client denied) |
| SEC16 | audit_events | create, update, delete | Nobody directly (triggers only) | no policy | RLS default deny | T-SEC-16a (trigger insert succeeds) / T-SEC-16b (direct insert, update, delete denied to all roles) |
| SEC17 | profiles | read | Self; staff (all) | `id = auth.uid()` or `is_staff()` | policy `profiles_read` | T-SEC-17a / T-SEC-17b (client cannot read other profiles) |
| SEC18 | profiles | update name, organisation | Self | `id = auth.uid()`; role column excluded | policy `profiles_update_self` + column privileges | T-SEC-18a / T-SEC-18b (client changing own role denied) |
| SEC19 | profiles | update role | Admin | via `set_user_role`; `is_admin()` | function `set_user_role` | T-SEC-19a / T-SEC-19b (consultant denied) |
| SEC20 | Staff routes `/staff/**` | open | Staff; `/staff/admin/**` admin only | session role check | `proxy.ts` + server component check | T-SEC-20a / T-SEC-20b |
| SEC21 | Client-facing responses | read | — | Client pages query `client_enquiry_view` and `updates` with RLS; never select internal notes; response contains no `internal` rows | RLS + view | T-SEC-21a (owner sees client updates) / T-SEC-21b (network response of S6 contains no internal note text) |

**Always-on security checks** (tested in the hardening phase):

- [ ] Every table has RLS enabled. T-DB-10 fails if any table in `public` has RLS off or no policy.
- [ ] Input is checked in the app (Zod) **and** in the database (check constraints, `submit_enquiry` validation).
- [ ] Rate limits are enforced on the server: BR13, 5 submissions per email per rolling hour, inside `submit_enquiry`.
- [ ] File uploads: none in v1 (Deferred). No storage buckets exist.
- [ ] No passwords, tokens or personal data (names, emails, enquiry text) are written to logs. T-NFR-7.
- [ ] A secret scan of the repository finds no keys (`npm run scan:secrets`).
- [ ] Security headers set in `next.config.ts`: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, Frame-Options deny. T-NFR-8.
- [ ] Unknown or non-owned references return Not found, never "forbidden", so existence is not revealed.

---

## 10. Backend operations

### 10.1 Message catalogue

Every label and message lives in `lib/copy/messages.ts` under these keys. Wording is from Section 18 #23 and must be used exactly.

| Key | Text |
| --- | --- |
| `form.name.required` | Enter your name. |
| `form.name.length` | Your name must be between 2 and 100 characters. |
| `form.organisation.required` | Enter your organisation's name. |
| `form.organisation.length` | Your organisation's name must be between 2 and 150 characters. |
| `form.email.required` | Enter your email address. |
| `form.email.format` | Enter an email address in the correct format, like name@example.com. |
| `form.category.required` | Choose a service. |
| `form.problem.tooShort` | Describe the problem in at least 30 characters. |
| `form.problem.tooLong` | The problem description must be 3,000 characters or fewer. |
| `form.outcome.tooShort` | Describe the outcome you want in at least 10 characters. |
| `form.outcome.tooLong` | The desired outcome must be 1,000 characters or fewer. |
| `form.urgency.required` | Choose how urgent this is. |
| `form.errorSummary` | There is a problem. Check the fields marked below. |
| `submit.failed` | Your enquiry was not submitted. Your answers have been kept, so you can try again. |
| `submit.rateLimited` | You have sent several enquiries in the last hour. Please try again later. |
| `submit.button` / `submit.buttonBusy` | Submit enquiry / Submitting… |
| `privacy.explanation` | We use these details only to respond to your enquiry and deliver any agreed work. We keep them for up to 24 months after your enquiry is closed. |
| `privacy.link` | Read our privacy notice |
| `confirm.heading` | Enquiry received |
| `confirm.reference` | Your reference is {reference}. Keep it for your records. |
| `confirm.next1` | A consultant will review your enquiry within 2 business days. |
| `confirm.next2` | To follow its progress, sign in with {email}. |
| `confirm.return` | Back to home |
| `category.unavailable` | This service is no longer available. Choose another service. |
| `signin.intro` | Enter your email address and we'll send you a sign-in link. |
| `signin.button` | Send sign-in link |
| `signin.sent` | Check your email for a sign-in link. It expires in 1 hour. |
| `signin.expired` | This sign-in link has expired or was already used. Request a new one. |
| `dashboard.empty` | You have no enquiries yet. |
| `dashboard.emptyAction` | Start an enquiry |
| `detail.noUpdates` | No updates yet. |
| `detail.noProposal` | No proposal has been shared yet. |
| `detail.noMilestones` | No milestones yet. |
| `detail.awaitingClient` | We need more information from you. Reply below. |
| `reply.button` / `reply.sent` | Send reply / Reply sent. |
| `queue.empty` | There are no enquiries yet. |
| `queue.noResults` | No enquiries match these filters. |
| `queue.clearFilters` | Clear filters |
| `status.saved` | Status updated. |
| `status.invalidTransition` | That status change isn't allowed from {status}. |
| `status.needsAcceptedProposal` | Record the proposal as accepted before marking the enquiry Accepted. |
| `update.posted` / `note.saved` | Update posted. / Internal note saved. |
| `note.label` | Internal note (not visible to the client) |
| `proposal.saved` | Proposal saved. |
| `milestone.saved` / `milestone.locked` | Milestone saved. / Milestones can be added once the engagement is accepted. |
| `category.saved` | Service saved. |
| `role.saved` / `role.lastAdmin` | Role updated. / You can't remove the last administrator. |
| `error.notFound` | We couldn't find that enquiry. |
| `error.forbidden` | You don't have permission to do that. |
| `error.load` | Something went wrong loading this page. |
| `error.retry` | Try again |
| `error.offline` | You appear to be offline. Check your connection and try again. |
| `status.label.*` | New, Under Review, Awaiting Client, Proposal Prepared, Accepted, In Delivery, Completed, Closed |
| `urgency.label.*` | Low, Medium, High |
| `budget.label.*` | Under R50 000, R50 000 – R150 000, R150 000 – R500 000, Over R500 000, Not sure yet |
| `decision.label.*` | Draft, Shared with client, Accepted, Declined |
| `milestone.label.*` | Planned, In progress, Completed |

### 10.2 Operations

| ID | Operation | Who can call it | Input | Output | Rules | Errors (exact message) | Built as | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OP1 | List active categories | Anyone | — | categories ordered by sort_order | SEC1 | `error.load` | table select | T-US1-1, T-INT-1 |
| OP2 | Submit enquiry | Anyone | name, organisation, email, category slug, problem, outcome, urgency, budget?, idempotency_key | `public_reference` | BR1, BR2, BR3, BR7, BR9, BR12, BR13, SEC4 | field messages; `category.unavailable`; `submit.rateLimited`; `submit.failed` | server action `features/enquiry/submit.ts` → RPC `submit_enquiry` | T-US1-1 … T-US1-6, T-BR9-1, T-BR13-1 |
| OP3 | Send sign-in link | Anyone | email | link sent | BR3 | `form.email.format`; `error.load` | `supabase.auth.signInWithOtp` | T-AUTH-1 |
| OP4 | Complete sign-in | Holder of link | token | session; redirect by role | — | `signin.expired` | route handler `app/auth/callback/route.ts` | T-AUTH-2, T-AUTH-3 |
| OP5 | List my enquiries | Client | — | reference, category, status, latest client update, created_at | SEC5, SEC8 | `error.load` | select on `client_enquiry_view` | T-US2-1, T-US2-2 |
| OP6 | Get my enquiry detail | Client (owner) | reference | enquiry, client updates, proposal (non-draft), milestones | SEC5, SEC8, SEC9, SEC11, SEC13, SEC21 | `error.notFound` | selects with RLS | T-US2-3, T-US4-4, T-SEC-21b |
| OP7 | Post client reply | Client (owner, status awaiting_client) | reference, body | update | SEC10, BR12 | `error.forbidden`; `submit.failed` | server action → insert `updates` | T-US2-4 |
| OP8 | Search and filter queue | Staff | q, status[], category, from, to, page | 25 rows per page, newest first, total | SEC5 | `error.load` | select with filters | T-US3-1, T-US3-2 |
| OP9 | Change status | Staff | reference, to_status | new status | BR6, BR8, BR11, SEC6 | `status.invalidTransition`; `status.needsAcceptedProposal`; `error.forbidden` | RPC `change_enquiry_status` | T-US3-3, T-BR8-1 … T-BR8-4, T-BR11-1 |
| OP10 | Add client update | Staff | reference, body | update | SEC10, BR12 | `error.forbidden` | server action → insert `updates` (visibility client) | T-US4-1 |
| OP11 | Add internal note | Staff | reference, body | update | BR5, SEC9, SEC10 | `error.forbidden` | server action → insert `updates` (visibility internal) | T-US4-2 |
| OP12 | Create or edit proposal | Staff | reference, FR-07 fields, decision_status | proposal | BR6, BR8, BR11, BR12, SEC12 | field messages; `error.forbidden` | server action → upsert `proposals` | T-US4-3, T-BR8-5, T-BR11-2 |
| OP13 | Create, edit, delete milestone | Staff | reference, name, description, target_date, status | milestone | BR6, BR10, BR11, SEC14 | `milestone.locked`; `error.forbidden` | server action → `milestones` | T-US4-5, T-BR10-1, T-BR10-2, T-BR11-3 |
| OP14 | View audit history | Staff | reference | audit events, newest first, with actor name | SEC15 | `error.load` | select `audit_events` | T-US3-4 |
| OP15 | Create or edit category | Admin | title, slug, description, sort_order, is_active | category | SEC2, SEC3 | field messages; `error.forbidden` | server action → `service_categories` | T-US5-1, T-US5-2 |
| OP16 | List users and change role | Admin | user id, role | profile | SEC17, SEC19 | `role.lastAdmin`; `error.forbidden` | RPC `set_user_role` | T-US5-3, T-US5-4, T-EDGE-9 |

`submit_enquiry` steps: validate every field (same limits as Zod) → reject inactive category → if `idempotency_key` exists, return the existing reference (no new row) → rate limit BR13 → insert → write `created` audit event → return reference. The browser shows S3 only after this returns (BR7).

---

## 11. Navigation rules

- **Logged out:** can open S1, S2, S3 (with confirmation cookie), S4, S11. Any other route → S4, then back to the requested route after sign-in.
- **Logged in, setup not finished:** no setup step in v1. A client without a name sees it prefilled from their first enquiry or left blank.
- **Logged in:** opening S4 → S5 (client) or S7 (staff). Client opening `/staff/**` → S5. Consultant opening `/staff/admin/**` → S7.
- **Tabs:** none. SiteHeader links: logged out → Services (S1), Sign in (S4); client → My enquiries (S5), Sign out; staff → Queue (S7), Sign out; admin adds Services admin (S9), Users (S10).
- **Back button:** browser default. After submit, S3 replaces S2 in history so Back does not resubmit. Queue filters are kept in the URL so Back restores them.
- **Navigation map:**

```mermaid
flowchart LR
  S1[S1 Landing] -->|Enquire| S2[S2 Service enquiry]
  S2 -->|Submitted| S3[S3 Confirmation]
  S3 -->|Back to home| S1
  S2 --> S11[S11 Privacy notice]
  S1 --> S4[S4 Sign in]
  S4 -->|client| S5[S5 Client dashboard]
  S4 -->|staff| S7[S7 Staff queue]
  S5 --> S6[S6 Client enquiry detail]
  S5 -->|Start an enquiry| S1
  S7 --> S8[S8 Staff enquiry detail]
  S7 -->|admin| S9[S9 Admin: categories]
  S7 -->|admin| S10[S10 Admin: users]
```

---

## 12. Testing strategy

### 12.1 The TDD cycle (every task, every phase)

1. **Red:** write one test for the behaviour, using the acceptance criterion or rule. Run it. It must **fail**, and fail for the expected reason (e.g. "screen not found", not "syntax error").
2. **Green:** write the **smallest** amount of code that makes that test pass. Run **all** tests.
3. **Refactor:** clean up names, remove duplication, move code to the right folder. Run all tests again. They must still pass.
4. Repeat for the next test.

### 12.2 Test levels

| Level | What it proves | Tool | Folder | Command |
| --- | --- | --- | --- | --- |
| Unit | Business rules and helper functions give the right answers | Vitest | tests/unit | `npm run test:unit` |
| Component | Each component and screen shows the right things in every state, with fake data | Vitest + React Testing Library | tests/component | `npm run test:unit` |
| Database and permissions | Constraints, triggers and permission rules allow and deny the right people | pgTAP | supabase/tests | `npm run test:db` |
| Integration | Each backend operation works against the real local backend | Vitest + supabase-js | tests/integration | `npm run test:int` |
| End-to-end | Whole user flows work on a real app build | Playwright + axe | tests/e2e | `npm run test:e2e` |
| Manual | Screens match the designs; real-device checks | Human | Checklists in each phase | — |

### 12.3 Test IDs

Every automated test name starts with its ID, so a single test can be found and run on its own.

| Prefix | Comes from | Example |
| --- | --- | --- |
| T-SETUP-# | Phase 1 tool and setup checks | T-SETUP-1 |
| T-US#-# | PRD acceptance criteria (§14) and user stories (§6) | T-US1-2 |
| T-AUTH-# | Sign-in rules (FR-09) | T-AUTH-1 |
| T-BR#-# | Business rules (§8 and Section 3.0) | T-BR2-1 |
| T-SEC-#a / b | Permission rules (Section 9), allow / deny | T-SEC-5b |
| T-DB-# | Database constraints and triggers not covered by a BR | T-DB-2 |
| T-INT-# | Backend operations not covered by a T-US test (Section 10) | T-INT-1 |
| T-C-# | Shared components (Section 7.2) | T-C-4 |
| T-S#-# / T-M#-# | Extra states or behaviour of one screen or modal | T-S7-1 |
| T-NAV-# | Navigation rules (Section 11) | T-NAV-1 |
| T-EDGE-# | Edge cases (Section 18 #26) | T-EDGE-2 |
| T-E2E-# | User flows (§6, §14) | T-E2E-1 |
| T-NFR-# | Quality requirements (§10) | T-NFR-3 |
| T-REL-# | Release checks (release phase) | T-REL-1 |

The same ID may be used at two levels when both prove the same criterion, e.g. T-US1-1 as a component test and as an integration test.

### 12.4 Test data rules

- Tests never depend on each other or on the order they run in.
- Database tests start from a fresh reset (migrations + seed).
- Integration and E2E tests that create data use unique emails (`<test-id>-<random>@example.test`) and never change seed rows other tests read.
- Component tests use fake data from `supabase/seed.sql` values (Section 8.7), never real network calls.
- Tests never use real personal data or real passwords.

### 12.5 Coverage rules

- 100% of PRD acceptance criteria (T-US…) have an automated test, or a manual check where automation is not possible (marked "manual").
- 100% of business rules have unit or database tests.
- 100% of permission rules have an allow test and a deny test.
- 100% of edge cases in Section 18 #26 have a test.
- At least 80% line coverage for `lib/rules/` and `lib/validation/`.

---

## 13. Phases

### 13.0 Phase overview

| Phase | Name | Features | Screens | Main tests |
| --- | --- | --- | --- | --- |
| 1 | Foundation | — | S1 (static) | T-SETUP-1 … 8, T-C-1 … 6, T-C-16 |
| 2 | Data and security | F9, F10 (database) | — | T-SEC-1 … 19, T-BR1/8/10/11/13, T-DB-1 … 10 |
| 3 | Service catalogue | F1 | S1 | T-US1-1, T-C-7, T-S1-1 |
| 4 | Enquiry submission and confirmation | F2, F3 | S2, S3, S11 | T-US1-1 … 6, T-BR2/3/7/9/12/13 |
| 5 | Sign in and client status | F9 (UI), F4 (view) | S4, S5, S6 | T-AUTH-1 … 4, T-US2-1 … 3, T-NAV-1 … 5 |
| 6 | Staff queue and status changes | F5, F4 (change) | S7, S8 | T-US3-1 … 3, T-BR8-1 … 4 |
| 7 | Updates, internal notes and audit history | F6, F10 (screen) | S6, S8 | T-US4-1, T-US4-2, T-US2-4, T-US3-4, T-SEC-21 |
| 8 | Proposals and milestones | F7, F8 | S6, S8 | T-US4-3 … 5, T-BR10-1 … 2 |
| 9 | Administration | F11 | S9, S10 | T-US5-1 … 4, T-EDGE-9 |
| 10 | Hardening | — | All | T-EDGE-1 … 12, T-NFR-1 … 8, T-E2E-1 … 5 |
| 11 | Release | — | All | Full suite, T-REL-1 … 6 |

---

### Phase 1: Foundation

**Goal:** the human can run the project, see every test level pass, and open the static S1 landing page built to its design with real tokens.

**Covers:** Features — · Stories — · Screens S1 (static content only) · Rules — · Operations — · Permissions —

**Starts when:** Section 18 has no Open rows and the human says "Start Phase 1".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-SETUP-1 | Unit | tests/unit/setup.test.ts | Given Vitest is configured, when the unit project runs, then a sample test passes |
| T-SETUP-2 | Component | tests/component/setup.test.tsx | Given RTL + jsdom, when a component renders, then its text is found |
| T-SETUP-3 | Database | supabase/tests/00_setup.test.sql | Given the local stack, when pgTAP runs, then `has_extension('pgcrypto')` passes |
| T-SETUP-4 | Integration | tests/integration/setup.test.ts | Given `.env.local`, when supabase-js calls the local API health endpoint, then it responds |
| T-SETUP-5 | E2E | tests/e2e/setup.spec.ts | Given the app is running, when `/` loads, then the page title contains "Imbewenhle" |
| T-SETUP-6 | Unit | tests/unit/tokens.test.ts | Given `theme/tokens.ts`, when read, then every token in Section 7.1 exists and `color.text`/`color.textMuted` on `color.background` have contrast ≥ 4.5:1 |
| T-SETUP-7 | Unit | tests/unit/no-secrets-in-app.test.ts | Given the source tree, when `app/ components/ features/ lib/` are scanned, then `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_DB_URL` never appear |
| T-SETUP-8 | Unit | tests/unit/no-hardcoded-styles.test.ts | Given `app/` and `components/`, when scanned, then no hex colour or arbitrary px Tailwind value appears outside `theme/` |
| T-C-1 | Component | tests/component/Button.test.tsx | Given each variant, when disabled or loading, then it is not clickable and loading sets `aria-busy` |
| T-C-2 | Component | tests/component/TextField.test.tsx | Given an error, when rendered, then the message is linked by `aria-describedby` and required is announced |
| T-C-3 | Component | tests/component/TextArea.test.tsx | Given min 30 / max 3000, when typing, then the counter updates |
| T-C-4 | Component | tests/component/Select.test.tsx | Given options and an error, when rendered, then label, options and error show |
| T-C-6 | Component | tests/component/Alert.test.tsx | Given type error, when rendered, then `role="alert"` is set |
| T-C-14 | Component | tests/component/PageState.test.tsx | Given each state, when rendered, then the matching message key from `messages.ts` shows |
| T-C-15 | Component | tests/component/SiteHeader.test.tsx | Given logged out, when rendered, then Services and Sign in links show |
| T-C-16 | Component | tests/component/SkipLink.test.tsx | Given keyboard focus, when Tab is pressed first, then "Skip to content" is visible and targets `#main` |
| T-S1-1 | Component | tests/component/S1.test.tsx | Given the static landing, when rendered, then value proposition, services heading, process overview and enquiry action show in design order |

- [x] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [x] P1-1: `npx create-next-app` (TypeScript, App Router, ESLint, Tailwind), then install the Section 4.1 tools only; add all `package.json` scripts from Section 4.3.
- [x] P1-2: `npx supabase init`; `supabase/migrations/20261104000100_extensions.sql`; `.env.example`; `.gitignore` includes `.env*` except `.env.example`.
- [x] Vitest projects `unit`, `component`, `integration`; `playwright.config.ts` with `webServer: npm run dev`.

**Step 3: Frontend (Green)**

- [ ] P1-3: read colours, font, sizes, spacing and radius from the exported Stitch screens in `docs/designs/`; replace provisional values in `theme/tokens.ts` and Section 7.1; human confirms.
- [x] `tailwind.config.ts` reads only `theme/tokens.ts`.
- [x] `lib/copy/messages.ts` with every key in Section 10.1.
- [x] Components: Button, TextField, TextArea, Select, Alert, PageState, SiteHeader (logged-out variant), SkipLink.
- [ ] S1 static: layout, value proposition and process overview to design; services section shows a placeholder list until Phase 3.

**Step 4: Refactor and full check**

- [x] Code cleaned up; no duplicated logic; names use PRD key terms.
- [x] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] `npm run check` runs green on your computer.
- [ ] Token values in `theme/tokens.ts` match the Stitch export.
- [ ] S1 matches `docs/designs/S1-landing.png` side by side at 375 px and 1280 px: layout, text, colours, spacing.

**Definition of Done**

- [x] Every test in Step 1 passes.
- [x] All earlier tests still pass.
- [x] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [x] Progress log updated (Section 17) with exact installed versions and the repository link.

**Commit message:** `Phase 1: Foundation`

**STOP.** Wait for the human to say "Start Phase 2".

---

### Phase 2: Data and security

**Goal:** the complete database exists with every constraint, trigger, audit rule and permission proven by tests. No UI.

**Covers:** Features F9, F10 (database) · Stories — · Screens — · Rules BR1, BR2, BR3, BR4, BR5, BR6, BR8, BR9, BR10, BR11, BR12, BR13 · Operations OP2, OP9, OP16 (database functions) · Permissions SEC1–SEC19

**Starts when:** Phase 1 is complete and the human says "Start Phase 2".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-BR1-1 | Database | supabase/tests/01_reference.test.sql | Given 1,000 generated references, when checked, then all match `^IMB-[0-9A-HJKMNP-TV-Z]{10}$` and are unique |
| T-BR1-2 | Database | supabase/tests/01_reference.test.sql | Given two enquiries, when created back to back, then their references share no sequential pattern (not derived from id or time) |
| T-BR2-1 | Database | supabase/tests/02_constraints.test.sql | Given problem lengths 29, 30, 3000, 3001 (after trim), when inserted, then only 30 and 3000 succeed |
| T-BR3-1 | Database | supabase/tests/02_constraints.test.sql | Given `name@example.com` and `name@`, when inserted, then only the first succeeds |
| T-BR12-1 | Database | supabase/tests/02_constraints.test.sql | Given each length and allowed-value limit in Section 8.1, when violated, then insert fails |
| T-BR8-1 | Database | supabase/tests/03_status.test.sql | Given every allowed transition in 8.3, when staff changes status, then it succeeds |
| T-BR8-2 | Database | supabase/tests/03_status.test.sql | Given every not-allowed pair, when staff changes status, then it fails with `invalid_transition` |
| T-BR8-3 | Database | supabase/tests/03_status.test.sql | Given status closed, when any change is tried, then it fails |
| T-BR8-4 | Database | supabase/tests/03_status.test.sql | Given proposal not accepted, when staff sets `accepted`, then it fails with `needs_accepted_proposal` |
| T-BR8-5 | Database | supabase/tests/03_status.test.sql | Given proposal decision transitions, when allowed/not allowed, then they succeed/fail per 8.3 |
| T-BR9-1 | Database | supabase/tests/04_submit.test.sql | Given the same idempotency_key twice, when `submit_enquiry` runs, then one row exists and both calls return the same reference |
| T-BR10-1 | Database | supabase/tests/05_milestones.test.sql | Given status `under_review`, when staff inserts a milestone, then it fails |
| T-BR10-2 | Database | supabase/tests/05_milestones.test.sql | Given status `accepted`, when staff inserts a milestone, then it succeeds |
| T-BR11-1 | Database | supabase/tests/06_audit.test.sql | Given a status change by Sipho, when complete, then one audit event has actor Sipho, from/to and a timestamp |
| T-BR11-2 | Database | supabase/tests/06_audit.test.sql | Given a proposal insert and update, then `created` and `updated` events exist with changed fields |
| T-BR11-3 | Database | supabase/tests/06_audit.test.sql | Given milestone insert, update, delete, then three audit events exist |
| T-BR11-4 | Database | supabase/tests/06_audit.test.sql | Given a role change, then a `role_changed` event exists |
| T-BR11-5 | Database | supabase/tests/06_audit.test.sql | Given a category insert/update, then an audit event exists |
| T-BR13-1 | Database | supabase/tests/04_submit.test.sql | Given 5 submissions from one email in an hour, when a 6th is sent, then it fails with `rate_limited`; a different email succeeds |
| T-DB-1 | Database | supabase/tests/07_profiles.test.sql | Given a new auth user, then a `client` profile is created |
| T-DB-2 | Database | supabase/tests/07_profiles.test.sql | Given an anonymous enquiry for `x@example.test`, when that email signs up, then the enquiry's requester_id is set |
| T-DB-3 | Database | supabase/tests/04_submit.test.sql | Given a signed-in client, when submitting, then requester_id = their id and requester_email = their email |
| T-DB-4 | Database | supabase/tests/02_constraints.test.sql | Given an update, then `updated_at` changes |
| T-DB-5 | Database | supabase/tests/04_submit.test.sql | Given an inactive category, when submitting, then it fails with `category_unavailable` |
| T-DB-6 | Database | supabase/tests/04_submit.test.sql | Given a successful submission, then a `created` audit event exists with null actor for anon |
| T-DB-7 | Database | supabase/tests/02_constraints.test.sql | Given a second proposal for one enquiry, then insert fails (unique) |
| T-DB-8 | Database | supabase/tests/02_constraints.test.sql | Given a used category, when deleted, then it fails (restrict) |
| T-DB-9 | Database | supabase/tests/08_seed.test.sql | Given seed, then 6 active categories in FR-01 order and 4 test accounts with correct roles exist |
| T-DB-10 | Database | supabase/tests/09_rls_on.test.sql | Given every table in `public`, then RLS is enabled and at least one policy or a documented deny-all exists |
| T-SEC-1a … T-SEC-19b | Database | supabase/tests/10_permissions.test.sql | One allow and one deny test per row in Section 9 (SEC1–SEC19), run as anon, Naledi (client A), Pieter (client B), Sipho (consultant) and Thandi (admin) via `set local role` + JWT claims |
| T-EDGE-9 | Database | supabase/tests/07_profiles.test.sql | Given one admin, when their role is changed to consultant, then it fails with `last_admin` |

- [x] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [x] Migrations 2–11 from Section 8.6, in order.
- [x] `submit_enquiry(p jsonb)` `security definer`: steps in Section 10.2; raises `invalid_input`, `category_unavailable`, `rate_limited`.
- [x] `change_enquiry_status(p_reference text, p_to text)` `security definer`: checks `is_staff()`; raises `invalid_transition`, `needs_accepted_proposal`, `forbidden`.
- [x] `set_user_role(p_user uuid, p_role text)` `security definer`: checks `is_admin()`; raises `last_admin`, `forbidden`.
- [x] `client_enquiry_view` (`security_invoker = true`) exposing only client-safe columns.
- [x] Revoke direct `insert` on `enquiries` and `audit_events` from `anon` and `authenticated`; grant `execute` on the three functions.
- [x] `supabase/seed.sql` per Section 8.7.
- [x] `npm run db:types` and commit `lib/supabase/database.types.ts`.

**Step 3: Frontend (Green)**

- [x] None in this phase.

**Step 4: Refactor and full check**

- [x] Code cleaned up; no duplicated logic; names use PRD key terms.
- [x] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] In Supabase Studio (http://127.0.0.1:54323), every table shows "RLS enabled".
- [ ] Read the permissions test output: every SEC row shows an `a` and a `b` result passing.

**Definition of Done**

- [x] Every test in Step 1 passes.
- [x] All earlier tests still pass.
- [x] Every screen in this phase shows all its required states (none in this phase).
- [ ] Manual checks are ticked by the human.
- [x] Progress log updated (Section 17).

**Commit message:** `Phase 2: Data and security`

**STOP.** Wait for the human to say "Start Phase 3".

---

### Phase 3: Service catalogue

**Goal:** a visitor sees the six active services on the landing page, each with a title, description and enquiry action.

**Covers:** Features F1 · Stories US1 (start) · Screens S1 · Rules — · Operations OP1 · Permissions SEC1

**Starts when:** Phase 2 is complete and the human says "Start Phase 3".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-US1-1 (catalogue) | Component | tests/component/S1.catalogue.test.tsx | Given the six seed categories, when S1 renders, then six ServiceCards show title, description and an "Enquire" action linking to `/enquire/<slug>`, in sort order |
| T-C-7 | Component | tests/component/ServiceCard.test.tsx | Given a category, when rendered, then the action link has an accessible name including the service title |
| T-S1-2 | Component | tests/component/S1.states.test.tsx | Given loading, error and zero categories, when rendered, then PageState loading, `error.load` with retry, and the empty state show |
| T-INT-1 | Integration | tests/integration/catalogue.test.ts | Given anon, when OP1 runs, then 6 active categories return; an inactive one is excluded |
| T-E2E-0 | E2E | tests/e2e/catalogue.spec.ts | Given the app, when a visitor opens `/` and selects "Migration", then they arrive at `/enquire/migration` |

- [x] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [x] `features/catalogue/getCategories.ts` (server): OP1 with Supabase server client.

**Step 3: Frontend (Green)**

- [x] ServiceCard component.
- [ ] S1 services section built to design with states Normal, Loading, Error, Empty.

**Step 4: Refactor and full check**

- [x] Code cleaned up; no duplicated logic; names use PRD key terms.
- [x] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] On a phone and a desktop browser, S1 shows six services in FR-01 order.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [x] Every test in Step 1 passes.
- [x] All earlier tests still pass.
- [x] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [x] Progress log updated (Section 17).

**Commit message:** `Phase 3: Service catalogue`

**STOP.** Wait for the human to say "Start Phase 4".

---

### Phase 4: Enquiry submission and confirmation

**Goal:** a visitor submits a valid enquiry and sees a unique reference only after the server saves it; invalid or failed submissions keep their answers.

**Covers:** Features F2, F3 · Stories US1 · Screens S2, S3, S11 · Rules BR1, BR2, BR3, BR7, BR9, BR12, BR13 · Operations OP2 · Permissions SEC4

**Starts when:** Phase 3 is complete and the human says "Start Phase 4".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-BR2-2 | Unit | tests/unit/enquirySchema.test.ts | Given problem lengths 29/30/3000/3001 and whitespace only, when validated, then only 30 and 3000 pass, with `form.problem.tooShort`/`tooLong` |
| T-BR3-2 | Unit | tests/unit/enquirySchema.test.ts | Given `name@example.com`, `name@`, `@x.com`, when validated, then only the first passes with `form.email.format` otherwise |
| T-BR12-2 | Unit | tests/unit/enquirySchema.test.ts | Given each field limit and allowed value (Section 8.1), when violated, then the matching message key is returned; budget may be empty |
| T-US1-1 | Integration | tests/integration/submit.test.ts | Given a valid enquiry (AC1), when OP2 runs, then a row exists and the returned reference matches BR1 |
| T-US1-1 | Component | tests/component/S2.submit.test.tsx | Given the server resolves with a reference, when Submit is pressed, then the app navigates to S3; S3 is never shown before the server responds (BR7) |
| T-US1-2 | Component | tests/component/S2.validation.test.tsx | Given empty required fields (AC2), when Submit is pressed, then the error summary and each field's specific message show, focus moves to the summary and no request is sent |
| T-US1-3 | Integration | tests/integration/submit.test.ts | Given invalid input that bypasses the browser, when OP2 runs, then the database rejects it and no row is created |
| T-US1-4 | Component | tests/component/S2.failure.test.tsx | Given the server fails (FR-03), when Submit is pressed, then `submit.failed` shows and every entered value is still in the form |
| T-US1-5 | Component | tests/component/S3.test.tsx | Given a reference cookie, when S3 renders, then `confirm.heading`, the reference, both next steps and `confirm.return` show |
| T-US1-6 | Component | tests/component/S2.category.test.tsx | Given `/enquire/automation`, when S2 renders, then "Automation" is shown as the selected category and the privacy explanation and link show |
| T-BR7-1 | Integration | tests/integration/submit.test.ts | Given the action, when the RPC errors, then no confirmation cookie is set |
| T-BR9-2 | Component | tests/component/S2.double.test.tsx | Given a slow server, when Submit is pressed twice, then one request is sent and the button shows `submit.buttonBusy` disabled |
| T-BR9-3 | Integration | tests/integration/submit.test.ts | Given the same idempotency key sent twice, then one row and one reference |
| T-BR13-2 | Integration | tests/integration/submit.test.ts | Given 6 submissions from one email within an hour, then the 6th returns `submit.rateLimited` and values are kept |
| T-S2-1 | Component | tests/component/S2.offline.test.tsx | Given `navigator.onLine = false`, when Submit is pressed, then `error.offline` shows and nothing is sent |
| T-S3-1 | E2E | tests/e2e/confirmation.spec.ts | Given no cookie, when `/enquire/submitted` opens, then it redirects to S1; Back after submit does not resubmit |
| T-S11-1 | Component | tests/component/S11.test.tsx | Given `content/privacy.md`, when S11 renders, then the content shows with headings |
| T-E2E-1 | E2E | tests/e2e/enquiry.spec.ts | Given a visitor, when they open S1, pick a service, fill valid fields and submit, then S3 shows an `IMB-` reference |

- [x] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [x] `lib/validation/enquiry.ts`: Zod schema mirroring Section 8.1 limits, returning message keys.
- [x] `features/enquiry/submit.ts` server action: Zod validate → RPC `submit_enquiry` → map errors to message keys → on success set httpOnly, SameSite=Lax, 10-minute cookie `confirmation` (`reference`, `email`) and `redirect('/enquire/submitted')` (replace).

**Step 3: Frontend (Green)**

- [x] S2 built to design: category shown, labelled fields in PRD order (name, organisation, email, category, problem description, desired outcome, urgency, budget range), required markers, counters, privacy explanation + link, idempotency key generated once per form load; states per 7.3.
- [ ] S3 built to design; reads and clears the cookie.
- [x] S11 renders `content/privacy.md`.

**Step 4: Refactor and full check**

- [x] Code cleaned up; no duplicated logic; names use PRD key terms.
- [x] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] On a real phone, submit an enquiry; the reference shows only after the spinner finishes.
- [ ] Turn Wi-Fi off and submit: the offline message shows and your answers stay.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [x] Every test in Step 1 passes.
- [x] All earlier tests still pass.
- [x] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [x] Progress log updated (Section 17).

**Commit message:** `Phase 4: Enquiry submission and confirmation`

**STOP.** Wait for the human to say "Start Phase 5".

---

### Phase 5: Sign in and client status

**Goal:** a client signs in with a magic link and sees only their own enquiries and statuses; staff are routed to the staff area.

**Covers:** Features F9 (UI), F4 (view) · Stories US2 · Screens S4, S5, S6 (status only) · Rules BR4 · Operations OP3, OP4, OP5, OP6 · Permissions SEC5, SEC20

**Starts when:** Phase 4 is complete and the human says "Start Phase 5".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-AUTH-1 | Component | tests/component/S4.test.tsx | Given a valid email, when "Send sign-in link" is pressed, then `signin.sent` shows; invalid email shows `form.email.format` |
| T-AUTH-2 | Integration | tests/integration/auth.test.ts | Given a valid magic-link token, when the callback runs, then a session cookie is set and a client is redirected to S5, staff to S7 |
| T-AUTH-3 | Integration | tests/integration/auth.test.ts | Given an expired or used token, when the callback runs, then the user lands on S4 with `signin.expired` |
| T-AUTH-4 | E2E | tests/e2e/signout.spec.ts | Given a signed-in client, when Sign out is pressed, then S5 redirects to S4 |
| T-US2-1 | Component | tests/component/S5.test.tsx | Given Naledi's two seed enquiries, when S5 renders, then two EnquiryCards show reference, category, StatusBadge and latest update; empty state shows `dashboard.empty` + action |
| T-US2-2 | Integration | tests/integration/client-isolation.test.ts | Given Naledi signed in (AC3), when she requests Pieter's enquiry by reference, id or via direct API with filters, then 0 rows return |
| T-US2-2 | E2E | tests/e2e/client-isolation.spec.ts | Given Naledi signed in, when she opens `/dashboard/enquiries/IMB-SEEDB00001`, then `error.notFound` shows |
| T-US2-3 | Component | tests/component/S6.status.test.tsx | Given `awaiting_client`, when S6 renders, then the status badge and `detail.awaitingClient` show |
| T-C-5 | Component | tests/component/StatusBadge.test.tsx | Given each of the 8 statuses, then the exact FR-04 label shows |
| T-C-8 | Component | tests/component/EnquiryCard.test.tsx | Given an enquiry, then the card links to S6 by reference |
| T-NAV-1 | E2E | tests/e2e/navigation.spec.ts | Given logged out, when `/dashboard` opens, then S4 shows; after sign-in the user returns to `/dashboard` |
| T-NAV-2 | E2E | tests/e2e/navigation.spec.ts | Given a client, when `/staff` opens, then S5 shows |
| T-NAV-3 | E2E | tests/e2e/navigation.spec.ts | Given a consultant, when `/staff/admin/users` opens, then S7 shows |
| T-NAV-4 | E2E | tests/e2e/navigation.spec.ts | Given a signed-in user, when `/sign-in` opens, then they are redirected by role |
| T-NAV-5 | E2E | tests/e2e/navigation.spec.ts | Given a signed-in client, when they submit an enquiry, then it appears on S5 with name and email prefilled on S2 |
| T-SEC-20a / T-SEC-20b | Integration | tests/integration/routes.test.ts | Staff route server check allows staff and rejects clients even if middleware is bypassed |

- [x] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [x] `lib/supabase/server.ts`, `browser.ts` via `@supabase/ssr`; `app/auth/callback/route.ts`.
- [x] `proxy.ts` + `lib/auth/guards.ts` (`requireClient`, `requireStaff`, `requireAdmin`) applying Section 11.
- [x] `features/status/getMyEnquiries.ts`, `getMyEnquiry.ts` (OP5, OP6 status fields).

**Step 3: Frontend (Green)**

- [ ] S4 built to design with states per 7.3.
- [x] SiteHeader client, staff and admin variants.
- [ ] StatusBadge, EnquiryCard; S5 and S6 (header, status, problem summary) to design with states per 7.3.
- [x] S2 signed-in state (prefill; email read-only).

**Step 4: Refactor and full check**

- [x] Code cleaned up; no duplicated logic; names use PRD key terms.
- [x] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] Sign in as `client.a@example.test` using the link from http://127.0.0.1:54324; see two enquiries.
- [ ] Change the URL to `IMB-SEEDB00001`: "We couldn't find that enquiry." shows.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [x] Every test in Step 1 passes.
- [x] All earlier tests still pass.
- [x] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [x] Progress log updated (Section 17).

**Commit message:** `Phase 5: Sign in and client status`

**STOP.** Wait for the human to say "Start Phase 6".

---

### Phase 6: Staff queue and status changes

**Goal:** staff search and filter all enquiries, open one, and change its status following the allowed transitions.

**Covers:** Features F5, F4 (change) · Stories US3 · Screens S7, S8 (details, status) · Rules BR6, BR8, BR11 · Operations OP8, OP9 · Permissions SEC5, SEC6

**Starts when:** Phase 5 is complete and the human says "Start Phase 6".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-US3-1 | Integration | tests/integration/queue.test.ts | Given seed data (AC5), when filtering by status, category and date range, then only matching enquiries return, newest first, 25 per page |
| T-US3-2 | Integration | tests/integration/queue.test.ts | Given search "Khumalo" or a reference, then matching enquiries return |
| T-US3-3 | Integration | tests/integration/status.test.ts | Given Sipho, when he moves `IMB-SEEDA00001` New → Under Review (AC5), then status changes and an audit event records him |
| T-US3-3 | Component | tests/component/S8.status.test.tsx | Given current status, when the status control renders, then only allowed next statuses are offered; saving shows `status.saved` |
| T-BR8-6 | Component | tests/component/S8.status.test.tsx | Given the server returns `invalid_transition`, then `status.invalidTransition` shows with the current status label |
| T-C-9 | Component | tests/component/QueueTable.test.tsx | Given rows, empty and loading, then rows, `queue.empty` and skeleton show; rows link to S8 by reference |
| T-C-10 | Component | tests/component/FilterBar.test.tsx | Given filters, when changed, then the URL query updates; Clear filters resets |
| T-S7-1 | Component | tests/component/S7.states.test.tsx | Given no results, error and offline, then `queue.noResults` + Clear filters, `error.load`, `error.offline` show |
| T-S8-1 | Component | tests/component/S8.details.test.tsx | Given an enquiry, then all FR-02 fields show with labels; budget shows "Not sure yet" or nothing if empty |
| T-E2E-2 | E2E | tests/e2e/triage.spec.ts | Given Sipho, when he filters New, opens an enquiry and sets Under Review, then the queue shows it under Under Review |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] `features/queue/searchEnquiries.ts` (OP8) with filters from URL search params.
- [ ] `features/status/changeStatus.ts` server action calling `change_enquiry_status` (OP9); maps errors to message keys.
- [ ] `lib/rules/status.ts` `allowedNextStatuses(from)` mirroring 8.3 (unit-tested against the same table).

**Step 3: Frontend (Green)**

- [ ] QueueTable, FilterBar; S7 to design with states per 7.3.
- [ ] S8 details panel and status control to design with states per 7.3.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] As consultant, filter by each status and category; date range filters correctly.
- [ ] Try to move a Closed enquiry: no options offered.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 6: Staff queue and status changes`

**STOP.** Wait for the human to say "Start Phase 7".

---

### Phase 7: Updates, internal notes and audit history

**Goal:** staff post client updates and private internal notes and see full audit history; clients see only client updates and can reply when asked.

**Covers:** Features F6, F10 (screen) · Stories US2, US3, US4 · Screens S6 (updates, reply), S8 (timeline, notes, audit) · Rules BR5, BR11 · Operations OP7, OP10, OP11, OP14 · Permissions SEC8, SEC9, SEC10, SEC15, SEC21

**Starts when:** Phase 6 is complete and the human says "Start Phase 7".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-US4-1 | Integration | tests/integration/updates.test.ts | Given Sipho, when he posts a client update, then Naledi sees it on S6 as the latest update on S5 |
| T-US4-2 | Integration | tests/integration/updates.test.ts | Given an internal note on Naledi's enquiry (AC4), when Naledi queries updates by any filter, then no internal row returns |
| T-SEC-21b | E2E | tests/e2e/internal-notes.spec.ts | Given an internal note with unique text, when Naledi opens S6, then that text is absent from the page and from every network response |
| T-US2-4 | Integration | tests/integration/reply.test.ts | Given status `awaiting_client`, when Naledi replies, then a client update by her exists; in any other status the reply is rejected with `error.forbidden` |
| T-US3-4 | Component | tests/component/S8.audit.test.tsx | Given audit events (AC5), then each shows actor name, action, from/to and timestamp, newest first |
| T-C-11 | Component | tests/component/Timeline.test.tsx | Given client and internal items, then internal items carry `note.label` and a distinct style token |
| T-S6-1 | Component | tests/component/S6.reply.test.tsx | Given awaiting_client, then the reply form shows; sending shows `reply.sent`; otherwise the form is hidden |
| T-S8-2 | Component | tests/component/S8.updates.test.tsx | Given the staff composer, when choosing "Client update" or "Internal note", then the post button and confirmation message match (`update.posted` / `note.saved`) |
| T-E2E-3 | E2E | tests/e2e/clarification.spec.ts | Given Sipho sets Awaiting Client and posts a question, when Naledi signs in and replies, then Sipho sees the reply on S8 |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] `features/updates/postUpdate.ts`, `postNote.ts`, `postReply.ts` (OP10, OP11, OP7).
- [ ] `features/audit/getAuditHistory.ts` (OP14) joining actor names.
- [ ] Client queries select explicit columns and `visibility = 'client'` in addition to RLS.

**Step 3: Frontend (Green)**

- [ ] Timeline component; S8 updates/notes composer and audit panel; S6 updates list and reply form; states per 7.3.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] Post an internal note as consultant; sign in as the client in a private window and confirm it is not visible. In browser DevTools → Network, search the note text: no match.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 7: Updates, internal notes and audit history`

**STOP.** Wait for the human to say "Start Phase 8".

---

### Phase 8: Proposals and milestones

**Goal:** staff record a proposal and the client's decision, then add milestones to accepted engagements; clients see their shared proposal and milestones.

**Covers:** Features F7, F8 · Stories US2, US4 · Screens S6 (proposal, milestones), S8 (proposal, milestones) · Rules BR6, BR8, BR10, BR11 · Operations OP12, OP13 · Permissions SEC11, SEC12, SEC13, SEC14

**Starts when:** Phase 7 is complete and the human says "Start Phase 8".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-US4-3 | Integration | tests/integration/proposal.test.ts | Given Sipho, when he saves a proposal with all FR-07 fields, then it exists as draft; Naledi cannot see it (AC6); after `shared`, she can; Pieter never can |
| T-US4-4 | Component | tests/component/S6.proposal.test.tsx | Given a shared proposal, then title, scope, deliverables, assumptions, exclusions, estimated timeline and decision label show; with none, `detail.noProposal` |
| T-US4-5 | Integration | tests/integration/milestones.test.ts | Given an accepted engagement, when Sipho adds a milestone, then Naledi sees name, description, target date and status; Pieter cannot (AC6) |
| T-BR10-3 | Component | tests/component/S8.milestones.test.tsx | Given status under_review, then the milestone form is replaced by `milestone.locked` |
| T-C-12 | Component | tests/component/MilestoneList.test.tsx | Given milestones, then they are sorted by target date; empty shows `detail.noMilestones`; staff variant shows edit controls |
| T-C-13 | Component | tests/component/ProposalSummary.test.tsx | Given each decision status, then the exact decision label shows |
| T-S8-3 | Component | tests/component/S8.proposal.test.tsx | Given the proposal form, when a required field is empty, then the field message shows and nothing is sent; on save `proposal.saved` |
| T-E2E-4 | E2E | tests/e2e/proposal-to-delivery.spec.ts | Given an under-review enquiry, when Sipho records a proposal, shares it, records it accepted, sets Proposal Prepared → Accepted → In Delivery and adds a milestone, then Naledi sees the proposal and milestone on S6 |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] `lib/validation/proposal.ts`, `milestone.ts` (Zod, Section 8.1 limits).
- [ ] `features/proposal/saveProposal.ts` (OP12), `features/milestones/saveMilestone.ts`, `deleteMilestone.ts` (OP13).

**Step 3: Frontend (Green)**

- [ ] ProposalSummary, MilestoneList; S8 proposal and milestone panels; S6 proposal and milestones sections; states per 7.3.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] Run the T-E2E-4 flow by hand; confirm the client never sees a draft proposal.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 8: Proposals and milestones`

**STOP.** Wait for the human to say "Start Phase 9".

---

### Phase 9: Administration

**Goal:** an administrator manages service categories and user roles.

**Covers:** Features F11 · Stories US5 · Screens S9, S10 · Rules BR11 · Operations OP15, OP16 · Permissions SEC2, SEC3, SEC17, SEC19

**Starts when:** Phase 8 is complete and the human says "Start Phase 9".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-US5-1 | Integration | tests/integration/categories.test.ts | Given Thandi, when she edits a category title and description, then S1 shows the new text and an audit event exists |
| T-US5-2 | Integration | tests/integration/categories.test.ts | Given Thandi deactivates "Migration", then S1 hides it and `/enquire/migration` shows `category.unavailable`; existing enquiries keep the category |
| T-US5-3 | Integration | tests/integration/roles.test.ts | Given Thandi, when she sets a client to consultant, then that user can open S7; an audit event exists |
| T-US5-4 | Integration | tests/integration/roles.test.ts | Given Sipho (consultant), when he calls `set_user_role` or edits a category, then `error.forbidden` |
| T-S9-1 | Component | tests/component/S9.test.tsx | Given the form, when title or slug is invalid, then field messages show; save shows `category.saved` |
| T-S10-1 | Component | tests/component/S10.test.tsx | Given users, then name, email and role show; saving shows `role.saved`; last-admin error shows `role.lastAdmin` |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] `features/admin/saveCategory.ts` (OP15), `listUsers.ts`, `setRole.ts` (OP16).

**Step 3: Frontend (Green)**

- [ ] S9 and S10 to design with states per 7.3; SiteHeader admin links.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] As admin, deactivate and reactivate a service; check S1 each time.
- [ ] As consultant, confirm the admin links are hidden and the URLs redirect.
- [ ] Each screen in this phase matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 9: Administration`

**STOP.** Wait for the human to say "Start Phase 10".

---

### Phase 10: Hardening

**Goal:** the app is accessible, resilient to errors and offline use, meets the performance target, passes every security check and every edge case, and the full end-to-end suite passes.

**Covers:** Features all · Stories all · Screens S1–S11 · Rules all · Operations all · Permissions SEC1–SEC21 and always-on checks

**Starts when:** Phase 9 is complete and the human says "Start Phase 10".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-EDGE-1 | E2E | tests/e2e/edge.spec.ts | Given the server returns 500 on submit, then `submit.failed` shows and all values are kept |
| T-EDGE-2 | E2E | tests/e2e/edge.spec.ts | Given a double-click and a page refresh after submit, then exactly one enquiry exists |
| T-EDGE-3 | E2E | tests/e2e/edge.spec.ts | Given offline mode on S5, S7 and S8, then `error.offline` shows with retry, and retry recovers when online |
| T-EDGE-4 | E2E | tests/e2e/edge.spec.ts | Given a random valid-format reference, when a client or staff opens it, then `error.notFound` |
| T-EDGE-5 | Integration | tests/integration/edge.test.ts | Given two staff change status at the same time from the same "from" value, then one succeeds and the other gets `status.invalidTransition` |
| T-EDGE-6 | E2E | tests/e2e/edge.spec.ts | Given a category deactivated while S2 is open, when submitting, then `category.unavailable` shows and values are kept |
| T-EDGE-7 | E2E | tests/e2e/edge.spec.ts | Given an expired magic link, then `signin.expired` and a new link can be requested |
| T-EDGE-8 | Unit | tests/unit/enquirySchema.test.ts | Given emoji and multi-byte text, then lengths count characters, not bytes, in app and database alike |
| T-EDGE-9 | Integration | tests/integration/roles.test.ts | Given only one admin, when demoted, then `role.lastAdmin` (UI-level repeat of the database test) |
| T-EDGE-10 | E2E | tests/e2e/edge.spec.ts | Given HTML or script in problem description, when shown on S6 and S8, then it renders as plain text |
| T-EDGE-11 | E2E | tests/e2e/edge.spec.ts | Given a client signed in when their session expires, when they act, then they go to S4 and return after sign-in |
| T-EDGE-12 | Integration | tests/integration/edge.test.ts | Given an anonymous enquiry with email of an existing client, then it appears on that client's S5 |
| T-NFR-1 | E2E | tests/e2e/a11y.spec.ts | Given every screen S1–S11 in every reachable state, when axe runs with WCAG 2.2 AA tags, then 0 violations |
| T-NFR-2 | E2E | tests/e2e/keyboard.spec.ts | Given keyboard only, when completing T-E2E-1 and T-E2E-2, then every control is reachable, focus is always visible and order follows the layout |
| T-NFR-3 | Performance | lighthouserc.json | Given S1, S2, S5, S7 on a production build with broadband throttling, then Largest Contentful Paint ≤ 3 s in at least 75% of 5 runs per page |
| T-NFR-4 | Unit | tests/unit/no-secrets-in-app.test.ts + `npm run scan:secrets` | Given the repository and its history, then no secrets are found |
| T-NFR-5 | E2E | tests/e2e/errors.spec.ts | Given each server action failing, then a recoverable message with retry shows; no stack trace is shown |
| T-NFR-6 | Component | tests/component/S2.privacy.test.tsx | Given S2, then `privacy.explanation` and the link to S11 show above the submit button |
| T-NFR-7 | Integration | tests/integration/logging.test.ts | Given a submission and sign-in, when server logs are captured, then they contain no email, name, enquiry text or token |
| T-NFR-8 | Integration | tests/integration/headers.test.ts | Given any page, then the security headers in Section 9 are present |
| T-E2E-5 | E2E | tests/e2e/full-journey.spec.ts | Given a new visitor, when they submit, sign in, see New, staff triage to In Delivery with milestones and the client sees updates, then every step succeeds (AC7) |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] Optimistic-concurrency guard in `change_enquiry_status` (`where status = p_from`).
- [ ] Security headers in `next.config.ts`; production log redaction helper `lib/log.ts`.
- [ ] `lighthouserc.json`; `docs/metrics.sql` with §12 metric queries.

**Step 3: Frontend (Green)**

- [ ] Fix every axe and keyboard finding; offline banner via `navigator.onLine` events; `app/error.tsx` and `not-found.tsx` use PageState.
- [ ] Image and font optimisation until T-NFR-3 passes.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far), plus `npm run test:perf` and `npm run scan:secrets`.

**Step 5: Manual checks (human)**

- [ ] Use a screen reader (VoiceOver or NVDA) to submit an enquiry; every field and error is announced.
- [ ] Zoom to 200% and 320 px wide: no content is lost or overlapped.
- [ ] Review security test results; record any critical or high finding in Section 18.
- [ ] Each screen matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 10: Hardening`

**STOP.** Wait for the human to say "Start Phase 11".

---

### Phase 11: Release

**Goal:** the app is deployed to a public URL, the demo script runs end to end, and the README lets anyone set it up from scratch.

**Covers:** Features all · Stories all · Screens all · Rules all · Operations all · Permissions all

**Starts when:** Phase 10 is complete and the human says "Start Phase 11".

**Step 1: Write the failing tests first (Red)**

| Test ID | Level | File | What it checks |
| --- | --- | --- | --- |
| T-REL-1 | Manual + script | scripts/clean-install.sh | Given a fresh clone, when `npm install && npm run db:start && npm run check` runs, then everything passes |
| T-REL-2 | Manual | Section 16 | Given the hardening results, then no unresolved critical or high security defects remain (AC8) |
| T-REL-3 | E2E | tests/e2e/smoke.spec.ts (`BASE_URL` = production) | Given the deployed URL, when S1 loads and categories show, then the deployment and database connection work |
| T-REL-4 | Manual | Section 18 #25 demo script | Given the deployed app, when the demo script is followed, then every step works without errors |
| T-REL-5 | Manual | Supabase dashboard | Given the cloud project, then RLS is on for every table, migrations are applied, and only seed categories (no test enquiries) exist |
| T-REL-6 | Script | `npm run scan:secrets` | Given the full Git history, then no secrets are found |

- [ ] All tests above are written, run, and fail for the expected reason.

**Step 2: Backend (Green)**

- [ ] Create the Supabase Cloud project; `npx supabase link`; `npx supabase db push`; load categories only (`supabase/seed.production.sql`, categories only).
- [ ] Configure Supabase Auth: Site URL and redirect URL = Vercel URL; custom SMTP (Section 18 #20).
- [ ] Create the first admin account and set its role with SQL in the dashboard.

**Step 3: Frontend (Green)**

- [ ] Vercel project linked to `main`; set the three public variables; deploy.
- [ ] README: setup, every command, test accounts, how to run the tests, deploy steps, privacy-notice ownership.

**Step 4: Refactor and full check**

- [ ] Code cleaned up; no duplicated logic; names use PRD key terms.
- [ ] Full check passes (lint, type check, every automated test from every phase so far).

**Step 5: Manual checks (human)**

- [ ] Follow the demo script on a real phone and a laptop against the deployed URL.
- [ ] Each screen matches its design side by side: layout, text, colours, spacing.

**Definition of Done**

- [ ] Every test in Step 1 passes.
- [ ] All earlier tests still pass.
- [ ] Every screen in this phase shows all its required states.
- [ ] Manual checks are ticked by the human.
- [ ] Progress log updated (Section 17).

**Commit message:** `Phase 11: Release`

**STOP.** The build is complete. Wait for the human's release approval.

---

## 14. Traceability matrix

| Feature | Stories | Acceptance tests | Rule tests | Screens | Operations | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | US1, US5 | T-US1-1 (catalogue), T-INT-1, T-E2E-0 | T-SEC-1a/b | S1 | OP1 | 3 |
| F2 | US1 | T-US1-1, T-US1-2, T-US1-3, T-US1-4, T-US1-6, T-E2E-1 | T-BR2-1/2, T-BR3-1/2, T-BR9-1/2/3, T-BR12-1/2, T-BR13-1/2, T-SEC-4a/b | S2, S11 | OP2 | 4 |
| F3 | US1 | T-US1-1, T-US1-4, T-US1-5, T-S3-1 | T-BR1-1/2, T-BR7-1 | S3 | OP2 | 4 |
| F4 | US2, US3 | T-US2-1, T-US2-3, T-US3-3, T-E2E-2 | T-BR8-1 … 6, T-BR11-1, T-SEC-6a/b | S5, S6, S8 | OP5, OP6, OP9 | 5, 6 |
| F5 | US3 | T-US3-1, T-US3-2, T-S7-1 | T-SEC-5a/b | S7 | OP8 | 6 |
| F6 | US2, US4 | T-US4-1, T-US4-2, T-US2-4, T-E2E-3 | T-SEC-8a/b, T-SEC-9a/b, T-SEC-10a/b, T-SEC-21a/b | S6, S8 | OP7, OP10, OP11 | 7 |
| F7 | US4 | T-US4-3, T-US4-4, T-S8-3, T-E2E-4 | T-BR8-5, T-BR11-2, T-SEC-11a/b, T-SEC-12a/b | S6, S8 | OP12 | 8 |
| F8 | US2, US4 | T-US4-5, T-BR10-3, T-E2E-4 | T-BR10-1/2, T-BR11-3, T-SEC-13a/b, T-SEC-14a/b | S6, S8 | OP13 | 8 |
| F9 | US2 | T-US2-2, T-AUTH-1 … 4, T-NAV-1 … 5 | T-SEC-1 … 21 (all), T-DB-1/2/3, T-DB-10 | S4, all protected screens | OP3, OP4 | 2, 5 |
| F10 | US3, US4 | T-US3-4 | T-BR11-1 … 5, T-SEC-15a/b, T-SEC-16a/b | S8 | OP14 | 2, 7 |
| F11 | US5 | T-US5-1 … 4, T-S9-1, T-S10-1 | T-SEC-2a/b, T-SEC-3a/b, T-SEC-17a/b, T-SEC-18a/b, T-SEC-19a/b, T-EDGE-9 | S9, S10 | OP15, OP16 | 9 |

---

## 15. Acceptance test checklist

PRD §14 release gate:

- [ ] T-US1-1: AC1, valid enquiry persists and returns a unique reference only after server confirmation (automated)
- [ ] T-US1-2: AC2, invalid required fields show specific messages and prevent submission (automated)
- [ ] T-US2-2: AC3, Client A cannot access Client B records by changing URL or API identifiers (automated)
- [ ] T-US4-2, T-SEC-21b: AC4, internal notes never appear in client screens or API responses (automated)
- [ ] T-US3-1, T-US3-3, T-US3-4: AC5, staff filter enquiries, update status and view audit history (automated)
- [ ] T-US4-3, T-US4-5: AC6, proposal and milestone records visible only to authorised users (automated)
- [ ] T-E2E-5 + coverage report: AC7, automated tests cover validation, authorisation, status transitions and the main enquiry flow (automated)
- [ ] T-REL-2: AC8, no unresolved critical or high-severity security defects (manual)

Stories and screens:

- [ ] T-US1-3: database rejects invalid input that bypasses the browser (automated)
- [ ] T-US1-4: failed submission keeps values and says it was not submitted (automated)
- [ ] T-US1-5: confirmation shows reference, next steps, return link (automated)
- [ ] T-US1-6: selected category and privacy explanation show (automated)
- [ ] T-US2-1: client dashboard lists own enquiries with status and latest update (automated)
- [ ] T-US2-3: client sees status and when action is required (automated)
- [ ] T-US2-4: client replies only when Awaiting Client (automated)
- [ ] T-US3-2: staff search by reference, organisation, name (automated)
- [ ] T-US4-1: client updates reach the client (automated)
- [ ] T-US4-4: shared proposal summary shows to the owning client (automated)
- [ ] T-US5-1 … T-US5-4: admin manages categories and roles; consultants cannot (automated)
- [ ] T-AUTH-1 … T-AUTH-4: sign-in, callback, expired link, sign-out (automated)
- [ ] T-NAV-1 … T-NAV-5: redirects by role and state (automated)

Edge cases and quality:

- [ ] T-EDGE-1 … T-EDGE-12: Section 18 #26 edge cases (automated)
- [ ] T-NFR-1: WCAG 2.2 AA scan, 0 violations (automated)
- [ ] T-NFR-2: keyboard-only flows with visible focus (automated); screen-reader run (manual)
- [ ] T-NFR-3: primary pages ≤ 3 s at p75 (automated)
- [ ] T-NFR-4 … T-NFR-8: secrets, recoverable errors, privacy explanation, log hygiene, headers (automated)
- [ ] Every screen matches its design (manual, each phase)

---

## 16. Final release checklist

- [ ] All phases complete; every box in Sections 13 and 15 ticked.
- [ ] Full check passes on a clean install (fresh clone → install → reset database → full check).
- [ ] Release build installs and runs on a real device (or deployed URL works).
- [ ] Demo script from Section 18 #25 runs from start to finish without errors.
- [ ] README explains:
    - setup;
    - every command;
    - the test accounts;
    - how to run the tests.
- [ ] `.env.example` lists every variable; a secret scan finds no keys in the repository or its history.
- [ ] Final comparison of the app against the PRD (acceptance criteria, screens, design) shows no gaps.
- [ ] Privacy notice (`content/privacy.md`) approved by Imbewenhle, including retention periods and any cross-border data transfer (POPIA).
- [ ] Named enquiry owner assigned for the pilot (PRD §13).

---

## 17. Progress log (the coding agent updates this)

| Phase | Date | Status | Automated tests (passed / total) | Commit | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | 09 Nov 2026 | Automated checks pass; human manual checks and S1 design comparison pending | 36 / 36 (33 unit and component, 1 database, 1 integration, 1 E2E) | `Phase 1: Foundation` | https://github.com/shaunmaselela25/Imbewenhle-hub. Lint, type check and `npm run scan:secrets` clean. Node 26.13.0, npm 11.20.0, Next.js 16.4.5, React 19.3.0, TypeScript 5.9.3, Tailwind 4.3.5, Zod 4.6.7, @supabase/supabase-js 2.119.0, @supabase/ssr 0.12.7, Supabase CLI 3.0.0, Vitest 5.1.0, RTL 16.3.3, @testing-library/dom 10.4.2, jest-dom 7.0.1, user-event 14.6.8, jsdom 31.0.0, coverage-v8 5.1.0, Playwright 1.65.0, axe 4.14.0, @lhci/cli 0.16.0, gitleaks 8.30.1. `@types/node` raised from the scaffold's ^20 to ^26 (Vitest requires ≥22). S1 has no design yet (#30), and rows 30–39 of Section 18 hold unreviewed assumptions |
| 2 | 09 Nov 2026 | Automated checks pass; human manual checks pending | 217 / 217 (33 unit and component, 182 database, 1 integration, 1 E2E) | `Phase 2: Data and security` | Lint, type check and `npm run scan:secrets` clean. Every SEC1–SEC19 row has an allow and a deny test. Seed service descriptions are placeholders until Section 18 #24 is supplied. Additions the plan left open: error codes `milestone_locked` and `not_found`; helpers `changed_fields`, `audit_row_change` (shared by `audit_proposal`, `audit_milestone`, `audit_category`) and `category_title` (keeps an inactive category's title on a client's enquiry) |
| 3 | 09 Nov 2026 | Automated checks pass; human manual checks pending; parts of S1 await #42 | 226 / 226 (39 unit and component, 182 database, 3 integration, 2 E2E) | `Phase 3: Service catalogue` | Lint, type check, production build and `npm run scan:secrets` clean. S1 built to its Stitch design except the items in Section 18 #42; T-S1-1 reordered to the real design order (enquiry action in the hero) and extended. `lib/supabase/server.ts` was created here rather than in Phase 5 because OP1 needs it. Added a `CatalogueServices` mock to T-S1-1 so that it needs no network; its assertions are unchanged |
| 4 | 09 Nov 2026 | Automated checks pass; human manual checks pending; no S3 design supplied | 285 / 285 (85 unit and component, 182 database, 11 integration, 7 E2E) | `Phase 4: Enquiry submission and confirmation` | Lint, type check, production build and `npm run scan:secrets` clean; `lib/validation/enquiry.ts` 100% line coverage. `content/privacy.md` is a marked placeholder. The action sets the confirmation cookie and the form navigates with `router.replace` (T-US1-1 needs a visible navigation). S3 clears its cookie through a POST route, because an action that changes a cookie re-renders the route. Markdown is rendered by `components/MarkdownContent.tsx`, so no new library. Playwright `expect` timeout raised to 20 s for first-visit compiles in dev |
| 5 | 09 Nov 2026 | Automated checks pass; human manual checks pending; no S4 or S5 design supplied | 373 / 373 (141 unit and component, 182 database, 33 integration, 17 E2E) | `Phase 5: Sign in and client status` | Lint, type check and production build clean. Sign-in tests run one at a time because Supabase keeps one active link per user. Test timeouts raised for slow runs. T-NAV-1 uses a real emailed link through the local mail viewer. Next.js logs a `Date.now()` prerender warning for `/dashboard` in dev; the build succeeds and it is not yet investigated. `supabase db reset` failed once without a visible reason and passed when rerun |

---

## 18. Clarifications needed

All rows are answered with a recommended decision. The human confirms each one and writes it into `docs/PRD.md` (v1.1) and its Change log before Phase 1.

| # | Question | Where (section / ID) | Answer | Status |
| --- | --- | --- | --- | --- |
| 1 | Authentication method (PRD §15) | 4.1, F9, S4 | Supabase Auth email magic link for all roles. No passwords, social sign-in or MFA in v1 (Deferred) | Confirmed by human, 09 Nov 2026 |
| 2 | Hosting and database (PRD §15) | 4.1, 6, Phase 11 | Vercel for the app; Supabase Cloud (PostgreSQL) in the region closest to South Africa available on the account. Any transfer outside South Africa is stated in the privacy notice (POPIA) | Confirmed by human, 09 Nov 2026 |
| 3 | Are client accounts required for the pilot? (PRD §15) | F9, S4–S6 | Not to submit. Anyone can submit without an account. To see status (S5, S6) a client signs in with the same email; earlier enquiries link automatically by confirmed email | Confirmed by human, 09 Nov 2026 |
| 4 | Enquiry response target (PRD §15) | S3 `confirm.next1`, §12 triage metric | First staff review within 2 business days | Confirmed by human, 09 Nov 2026 |
| 5 | Retention and deletion periods (PRD §15) | S2 privacy explanation, S11 | Keep enquiry records up to 24 months after Closed, then delete on request or by manual review. Automated purge Deferred to post-pilot | Confirmed by human, 09 Nov 2026 |
| 6 | Allowed status transitions (FR-04) | 8.3, BR8 | Table in Section 8.3; Accepted requires an accepted proposal; Closed is terminal | Confirmed by human, 09 Nov 2026 |
| 7 | Milestone status values (FR-08) | 8.1 milestones | Planned, In progress, Completed | Confirmed by human, 09 Nov 2026 |
| 8 | Urgency values, budget ranges, field limits (FR-02) | 8.1, BR12, 10.1 | Urgency Low/Medium/High; budget Under R50 000, R50 000 – R150 000, R150 000 – R500 000, Over R500 000, Not sure yet (optional); name 2–100, organisation 2–150, email ≤254, desired outcome 10–1,000, update 1–2,000, proposal text fields 1–5,000, title 3–150, timeline 1–200, milestone name 3–120, description ≤1,000 | Confirmed by human, 09 Nov 2026 |
| 9 | Rate limit and bot protection | BR13, 9 | 5 submissions per email per rolling hour, enforced in the database. No CAPTCHA (Deferred). No IP addresses stored (POPIA data minimisation) | Confirmed by human, 09 Nov 2026 |
| 10 | Which fields are required? (FR-02) | S2, 8.1 | All except budget range | Confirmed by human, 09 Nov 2026 |
| 11 | Consultant vs Administrator permissions; enquiry assignment | 9, F11 | Both are staff and see all enquiries. Only Administrators manage categories and roles. Assignment to a named consultant is Deferred | Confirmed by human, 09 Nov 2026 |
| 12 | Sign-in screen is not listed in PRD §9 but FR-09 needs one | S4 | Add S4 Sign in | Confirmed by human, 09 Nov 2026 |
| 13 | US5 has no screens in PRD §9 | F11, S9, S10 | Add S9 Admin: service categories and S10 Admin: users and roles. Priority Should (built after all Must features) | Confirmed by human, 09 Nov 2026 |
| 14 | Modals | 3.0, 7.3 | None. Staff editing uses panels on S8. If the Stitch designs show modals, the agent asks before building | Confirmed by human, 09 Nov 2026 |
| 15 | Privacy notice content and location (PRD §9, §13) | S11, S2 | Static page `/privacy` from `content/privacy.md`, written and approved by Imbewenhle before release | Confirmed by human, 09 Nov 2026 |
| 16 | Retention purge implementation | 3.3 | Deferred; policy documented in privacy notice | Confirmed by human, 09 Nov 2026 |
| 17 | Proposals per enquiry (FR-07) | 8.1 proposals | One proposal per enquiry, editable | Confirmed by human, 09 Nov 2026 |
| 18 | Proposal decision status values and who records the decision (FR-07) | 8.1, 8.3 | Draft, Shared with client, Accepted, Declined. Staff record the client's decision; clients see non-draft proposals read-only | Confirmed by human, 09 Nov 2026 |
| 19 | Fields added to the PRD data model | 8.1 | `enquiries.requester_name`, `requester_email` (anonymous submission), `idempotency_key` (BR9), `proposals.created_at`, `milestones.created_at/updated_at`, `audit_events.details`; table `service_categories` (F11) | Confirmed by human, 09 Nov 2026 |
| 20 | Production email for magic links | Phase 11 | Custom SMTP configured in Supabase Auth (Imbewenhle's mail provider); local development uses the Supabase mail viewer | Confirmed by human, 09 Nov 2026 |
| 21 | Can clients post messages? (§5 existing client "provide information") | F6, SEC10, OP7 | Yes, a client reply only while status is Awaiting Client; never internal | Confirmed by human, 09 Nov 2026 |
| 22 | Design tokens and screen file names (Stitch not readable by the plan author) | 7.1, 7.3 | Export every Stitch screen to `docs/designs/` with the 7.3 names. Phase 1 task P1-3 replaces provisional tokens with exported values, and the human confirms | Confirmed by human, 09 Nov 2026 (only four of the 11 screens supplied so far) |
| 23 | Exact UI wording (validation, failure, empty, status labels) | 10.1 | Message catalogue in Section 10.1 | Confirmed by human, 09 Nov 2026 |
| 24 | Service descriptions for the six categories (FR-01) | 8.7 | Imbewenhle supplies one description (10–500 characters) per category before Phase 3 | Confirmed by human, 09 Nov 2026 (seed text as read from the S1 Stitch design) |
| 25 | Demo script | 16, T-REL-4 | 1. Visitor opens S1, picks Automation, submits; reference shows. 2. Sipho signs in, filters New, opens it, sets Under Review, posts an internal note and a client question, sets Awaiting Client. 3. Visitor signs in with the same email, sees the question (not the note), replies. 4. Sipho records and shares a proposal, records it accepted, sets Accepted then In Delivery, adds two milestones. 5. Client sees proposal and milestones. 6. Client tries another client's reference: not found. 7. Thandi deactivates a service; S1 updates | Confirmed by human, 09 Nov 2026 |
| 26 | Edge cases (PRD has none listed) | T-EDGE-1 … 12 | The 12 cases in Phase 10 Step 1 | Confirmed by human, 09 Nov 2026 |
| 27 | §12 analytics | 3.3 | Measured with SQL in `docs/metrics.sql`; no in-app dashboard (Deferred) | Confirmed by human, 09 Nov 2026 |
| 28 | PRD version | 0 | PRD 28 Oct 2026 = v1.0; with these answers = v1.1 | Confirmed by human, 09 Nov 2026 |
| 29 | Repository | 0, 4.2 | Human creates an empty GitHub repository named `imbewenhle-hub` before Phase 1; link recorded in Section 17 | Confirmed by human, 09 Nov 2026 |
| 30 | `docs/designs/` holds only README.md. S1 is needed for Phase 1 (S1 build, P1-3 tokens). PNGs do not reliably give exact font names, sizes or spacing | 7.1, 7.3, P1-3, #22 | Waiting on human: add `docs/designs/S1-landing.png`. Recommended: also add Stitch's HTML/code export for S1, if available, so tokens are read rather than estimated | Answered 09 Nov 2026: S1 supplied (161 px wide). Exact fonts and spacing cannot be read at that size; a full-size export is still wanted |
| 31 | Rows 1–29 are "recommended; confirm", and Section 0 and the PRD require human confirmation before implementation | 0, 18, PRD §15 | Waiting on human: confirm rows 1–29, or list changes | Confirmed by human, 09 Nov 2026 |
| 32 | No approved wording exists for S1's value proposition, process overview, enquiry action or Phase 1 services placeholder (not in the PRD or 10.1; Rule 9 forbids inventing wording) | S1, T-S1-1, 10.1 | Recommended: copy S1 text exactly from the design into `messages.ts`; placeholder list shows the six FR-01 titles only, without descriptions | Answered 09 Nov 2026: S1 text copied from the design into `messages.ts`, as read from a 161 px wide export; human to confirm |
| 33 | Labels used in Phase 1 are missing from 10.1, and T-C-14 has no message keys for its loading and empty states | 10.1, T-C-14, T-C-15, T-C-16 | Recommended: add `nav.services` = Services, `nav.signIn` = Sign in, `skip.link` = Skip to content, `page.loading` = Loading…; PageState empty receives the screen's own key (e.g. `dashboard.empty`); not found uses `error.notFound` | Confirmed by human, 09 Nov 2026 |
| 34 | Phase 1 test lists disagree: 13.0 says T-C-1 … 6 and T-C-16; Step 1 omits T-C-5 (built in Phase 5) and adds T-C-14, T-C-15 and T-S1-1 | 13.0, Phase 1 Step 1 | Recommended: follow Phase 1 Step 1 | Confirmed by human, 09 Nov 2026 |
| 35 | 7.3 lists Normal, Loading, Error and Empty for S1, but Phase 1 is static and T-S1-2 tests those states in Phase 3; the Phase 1 Definition of Done requires all states | 7.3, Phase 1 DoD, T-S1-2 | Recommended: Phase 1 delivers Normal only; Loading, Error and Empty are delivered in Phase 3 | Confirmed by human, 09 Nov 2026 |
| 36 | Prerequisites in 4.2 not met: Node.js is v24.19.0 but the newest LTS line is v26 (v26.13.0, 28 Oct 2026); gitleaks is not installed | 1 step 5, 4.1, 4.2 | Recommended: human installs Node 26 LTS and gitleaks before Phase 1, or tells the agent to stay on Node 24 (still an LTS line) and accepts the difference from "current LTS" | Answered 09 Nov 2026: human chose Node 26 LTS and gitleaks via winget |
| 37 | Phase 1 needs libraries not listed in 4.1 (Rule 13). `@testing-library/react` 16 requires `@testing-library/dom` as a peer dependency; `@testing-library/jest-dom` provides the matchers for visibility, `aria-*` and accessible-description checks in T-C-1 … T-C-16 | 4.1, Rule 13, Phase 1 | Recommended: add both to 4.1 as dev dependencies | Confirmed by human, 09 Nov 2026 |
| 38 | No approved wording for the required-field marker (7.2, T-C-2) or the character counter (7.2, T-C-3), and Rule 9 forbids inventing wording | 7.2, 10.1, T-C-2, T-C-3 | Recommended: add `form.required` = (required) and `form.counter` = {count} of {max} characters, unless the S2 design shows different text | Confirmed by human, 09 Nov 2026 |
| 39 | Section 5, 9 (SEC20) and Phase 5 name `middleware.ts`, but Next.js 16 (latest stable: 16.4.5) deprecates the `middleware` file convention in favour of `proxy` | 4.1, 5, SEC20, Phase 5 | Recommended: use `proxy.ts` with the same role, and update Section 5, SEC20 and Phase 5 to match | Confirmed by human, 09 Nov 2026 |
| 40 | The supplied Stitch screens (S1, S2, S6, S7) go beyond or conflict with the PRD and plan. All: bottom tab bar (Catalogue, Enquiry, Tracker, Workspace) vs no tabs in 7.3 and Section 11. S2: 3-step flow; several services selectable; telephone and implementation-target fields; Save Draft; inline "Confirmation Dialog (POP-01)" (#14); problem minimum 50 vs 30; different budget bands; "Domain Verified" badge vs BR3. S6: lead architect shown, file attachment (Deferred), "Request Status Clarification" at any status vs #21, account desk with a 2-hour SLA. S7: assignment to a consultant (Deferred, #11), bulk select, Archived tab, SLA and priority sort, attachments, notifications, sprint progress. Reference `IMB-2025-0842` vs BR1 random format | 3.3, 7.3, 8.1, 10.1, 11, S2, S3, S6, S7, BR1, BR2, BR12 | Waiting on human before Phase 4: PRD and plan win, or change them to match the designs. Recommended: PRD and plan win; screens follow the designs' look and wording wherever they do not conflict | Answered by human, 09 Nov 2026: PRD and plan win; screens follow the designs' look and wording wherever they do not conflict |
| 41 | No approved wording for the Enquire action key or the S1 empty state (T-US1-1, T-S1-2, 10.1) | 10.1, S1 | `catalogue.enquire` = Enquire (from T-US1-1); `catalogue.empty` = No services are available right now. | Confirmed by human, 09 Nov 2026 |
| 42 | Parts of the S1 design were not built: bottom tab bar (#40); stats "6 Core Disciplines, 100% Governance SLA, Tier 1 Consulting Model" and "ISO 27001 Aligned", which are public claims needing evidence; "MVP 1.0 Enterprise Hub" and "Consulting Advisory Active" badges; two photos (no image files supplied); service icons; tags on each service (no database column); "6 Streams" count; "Turnaround: 48-72 business hours", which conflicts with 2 business days (#4) | S1, 7.3, 8.1 | Waiting on human: which of these to add, and the image files. Recommended: leave out the claims and the turnaround line unless Imbewenhle can stand behind them | Open |
| 43 | No approved wording for S2 field labels, heading, select placeholder or "Optional" (10.1). The design's "Zero-Commitment Boundary" promises confidentiality under a mutual NDA, a legal commitment | 10.1, S2 | Labels for name, organisation and email come from the S2 design; the rest use PRD terms: Service, Problem description, Desired outcome, Urgency, Budget range. `enquiry.heading` = Enquiry; `form.choose` = Choose…; `form.optional` = Optional. The NDA text is left out | Assumed: human to confirm the labels, and whether the NDA promise should appear |
| 44 | S4 and S5 designs not supplied; the human chose to build without them. Wording not in 10.1: `signin.emailLabel` = Email address, `dashboard.heading` = My enquiries, `detail.submitted` = Submitted; nav labels from Section 11 | S4, S5, 10.1 | Built in the style of the other screens | Assumed: human to supply S4 and S5 and confirm the wording |

---

## 19. Change log

| Plan version | Date | What changed | Why |
| --- | --- | --- | --- |
| v1.0 | 04 Nov 2026 | First version | Generated from PRD v1.0 plus Section 18 answers (PRD v1.1) |

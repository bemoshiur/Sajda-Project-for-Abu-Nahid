# Phase 0: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A running Next.js 15 + Payload CMS v3 app connected to Neon Postgres, with Tailwind v4, the five brand fonts, extracted design tokens, TypeScript strict, and a health check — committed and pushed, ready for Vercel.

**Architecture:** Single Next.js App Router app. Payload v3 runs in-process via `@payloadcms/next`; Postgres adapter targets Neon; Vercel Blob plugin for uploads. All app code under `src/`. Payload config and collections live in `src/payload/`. This phase produces the skeleton only — full collections and pages come in later phases.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Payload v3, `@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob`, `@payloadcms/richtext-lexical`, Tailwind CSS v4, `next/font`, pnpm.

## Global Constraints

- Package manager: **pnpm** (available: v10.33.3). Node v25.9.0.
- Database: **Neon Postgres 18.4**, connection string in `.env` as `DATABASE_URL` (pooled URL with `sslmode=require`).
- All secrets in `.env` (gitignored); every secret also documented in `.env.example` with a placeholder value.
- TypeScript **strict** mode; no `any` in committed code without justification.
- Brand palette (exact): primary `#0188FF`, navy `#181433` / `#181E4B`, coral `#DF6951`, deep blue `#004179`.
- Brand fonts: Playfair Display, Volkhov, Poppins, Inter, Manrope (via `next/font/google`).
- Repo: `github.com/bemoshiur/Sajda-Project-for-Abu-Nahid`, branch `main`. Commit frequently with the `Co-Authored-By: Claude Opus 4.8 (1M context)` trailer.
- Do NOT commit `design-source/`, `.remember/`, `SAJDA.fig/`, `.env`, `node_modules/`.

---

## File Structure (created in this phase)

```
package.json                     pnpm scripts + deps
tsconfig.json                    strict TS, @/* path alias
next.config.mjs                  Next + withPayload wrapper
postcss.config.mjs               Tailwind v4 postcss
.env.example                     documented env vars
.env                             real secrets (gitignored)
src/
  payload.config.ts              Payload config (db, storage, collections, globals)
  payload/
    collections/Users.ts         minimal staff auth collection
    collections/Media.ts         uploads collection (Blob)
  app/
    (frontend)/
      layout.tsx                 root frontend layout (fonts, tokens)
      page.tsx                   minimal landing placeholder
    (payload)/                   Payload-generated admin/api routes
    globals.css                  Tailwind + design tokens
    api/health/route.ts          health check (verifies DB connectivity)
  lib/
    fonts.ts                     next/font definitions
```

---

### Task 1: Scaffold the Next.js + Payload app into the repo

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `src/payload.config.ts`, `src/app/(payload)/*`, and the rest of the Payload blank template.

**Interfaces:**
- Produces: a working `pnpm dev` server, `src/payload.config.ts` exporting a Payload config, `@/*` alias → `src/*`.

- [ ] **Step 1:** From the repo root, scaffold the Payload blank template into a temp dir (avoids the non-empty-dir refusal), then move app files to root:

```bash
cd /Users/smmoshiurrahman/Downloads/Projects/SajdaNAHIDProject
npx create-payload-app@latest .sajda-scaffold -t blank --db postgres --no-deps
# move generated app files (not node_modules) into repo root, preserving our docs/.gitignore/README
rsync -a --exclude node_modules --exclude .git --exclude .gitignore --exclude README.md .sajda-scaffold/ ./
rm -rf .sajda-scaffold
```

- [ ] **Step 2:** Install dependencies with pnpm and add the storage + richtext packages:

```bash
pnpm install
pnpm add @payloadcms/storage-vercel-blob
```

- [ ] **Step 3:** Ensure `tsconfig.json` has `"strict": true` and `"paths": { "@/*": ["./src/*"] }`. Verify `next.config.mjs` wraps config with `withPayload`.

- [ ] **Step 4 (verify):** Type-check succeeds:

```bash
pnpm exec tsc --noEmit
```
Expected: no errors (template is clean).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js 15 + Payload v3 (blank, postgres)"
```

---

### Task 2: Wire environment + Neon connection

**Files:**
- Create: `.env`, `.env.example`

**Interfaces:**
- Produces: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN` (placeholder), `STRIPE_*` (placeholder), `RESEND_API_KEY` (placeholder) available to the app.

- [ ] **Step 1:** Write `.env.example` documenting every variable with placeholder values (no real secrets).

- [ ] **Step 2:** Write `.env` with the real Neon `DATABASE_URL`, a generated `PAYLOAD_SECRET` (`openssl rand -hex 32`), and `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`. Leave Blob/Stripe/Resend blank for now.

- [ ] **Step 3 (verify):** Confirm `.env` is gitignored:

```bash
git check-ignore .env   # must print ".env"
```

---

### Task 3: Configure Payload (db, storage, collections, admin disabled-as-delivered)

**Files:**
- Modify: `src/payload.config.ts`
- Create: `src/payload/collections/Users.ts`, `src/payload/collections/Media.ts`

**Interfaces:**
- Consumes: `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`.
- Produces: Payload config with `postgresAdapter({ pool: { connectionString: DATABASE_URL } })`, `vercelBlobStorage` plugin (guarded — only enabled when token present), `Users` (auth) and `Media` (upload) collections, lexical richtext.

- [ ] **Step 1:** Write `Users.ts` — auth collection with `role` select (superadmin/admin/manager/staff), `name`, `isActive`. `admin.useAsTitle: 'email'`.

- [ ] **Step 2:** Write `Media.ts` — upload collection; public read for now (access refined in Phase 1).

- [ ] **Step 3:** Update `payload.config.ts`: register both collections, set `db: postgresAdapter(...)`, add `vercelBlobStorage` plugin conditionally on `process.env.BLOB_READ_WRITE_TOKEN`, keep `editor: lexicalEditor()`.

- [ ] **Step 4 (verify):** Start dev and confirm Payload boots + pushes schema to Neon:

```bash
pnpm dev   # background; watch for "Starting Payload..." then "✓ Ready"
```
Then verify tables were created:
```bash
psql "$DATABASE_URL" -c "\dt" | grep -E "users|media"
```
Expected: `users` and `media` tables exist.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: configure Payload with Neon adapter, Users + Media collections, Blob storage"
```

---

### Task 4: Design tokens + fonts + Tailwind v4

**Files:**
- Create: `src/lib/fonts.ts`
- Modify: `src/app/globals.css`, `src/app/(frontend)/layout.tsx`

**Interfaces:**
- Produces: CSS variables `--color-primary`, `--color-navy`, `--color-navy-2`, `--color-coral`, `--color-deep-blue`, plus neutral scale; font CSS variables `--font-playfair`, `--font-volkhov`, `--font-poppins`, `--font-inter`, `--font-manrope` applied on `<body>`.

- [ ] **Step 1:** `fonts.ts` — export the five `next/font/google` families, each with a `variable`.

- [ ] **Step 2:** `globals.css` — `@import "tailwindcss";` then a `@theme` block mapping the brand palette + fonts to Tailwind tokens; base body styles.

- [ ] **Step 3:** `layout.tsx` — apply the font variables to `<html>`/`<body>`; set default font.

- [ ] **Step 4 (verify):** Build the CSS and confirm tokens resolve:

```bash
pnpm exec tsc --noEmit && pnpm build 2>&1 | tail -5
```
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: brand design tokens, fonts, Tailwind v4 setup"
```

---

### Task 5: Health check + placeholder landing

**Files:**
- Create: `src/app/api/health/route.ts`
- Modify: `src/app/(frontend)/page.tsx`

**Interfaces:**
- Consumes: Payload Local API (`getPayload({ config })`).
- Produces: `GET /api/health` → `{ status, db, time }`; a minimal branded landing placeholder.

- [ ] **Step 1:** `route.ts` — import config, `getPayload`, run a trivial query (count users), return JSON `{ status: 'ok', db: 'connected', users: <n> }`; on error return 500 with message.

- [ ] **Step 2:** `page.tsx` — minimal Sajda-branded hero placeholder using the tokens (verifies fonts/colors render).

- [ ] **Step 3 (verify):** With dev running, hit the endpoint:

```bash
curl -s localhost:3000/api/health
```
Expected: `{"status":"ok","db":"connected",...}`.

- [ ] **Step 4: Commit + push**

```bash
git add -A && git commit -m "feat: health check endpoint + branded landing placeholder"
git push
```

---

### Task 6: Seed the first admin user + smoke test

**Files:**
- Create: `src/payload/seed/seedAdmin.ts`, `scripts/seed.ts` (or a `pnpm` script)

**Interfaces:**
- Consumes: Payload Local API.
- Produces: one `superadmin` user for login during later phases.

- [ ] **Step 1:** Write a seed script that upserts a superadmin user (email/password from env or defaults documented in `.env.example`).

- [ ] **Step 2 (verify):** Run it and confirm the user exists:

```bash
pnpm seed
psql "$DATABASE_URL" -c "SELECT email, role FROM users;"
```
Expected: the superadmin row.

- [ ] **Step 3: Commit + push**

```bash
git add -A && git commit -m "feat: admin seed script" && git push
```

---

## Deployment note (deferred within this phase)
Vercel deploy requires an interactive `vercel login` / token not available in this session. Task 5/6 leave the app production-buildable (`pnpm build` passes). Actual Vercel project creation + env upload + Stripe webhook URL is done once a Vercel token is provided or by the user via the dashboard; a `vercel.json` and deploy checklist are added at the end of Phase 7.

---

## Roadmap — subsequent phase plans (authored when reached)
Each phase gets its own `docs/superpowers/plans/2026-07-15-phase-N-*.md`, grounded in the code that exists by then:
1. **Phase 1 — Data layer:** all collections (packages, departures, bookings, payments, invoices, enquiries, suppliers, reviews, posts, customers) + globals (settings) + access control + seed content.
2. **Phase 2 — Design system + shared UI:** tokens refined from Figma extraction, nav, footer, buttons, cards, form controls.
3. **Phase 3 — Public site:** 7 pixel-matched pages + enquiry + reviews + SEO.
4. **Phase 4 — Customer auth + portal.**
5. **Phase 5 — Booking + Stripe + invoice PDF + email + currency/FX.**
6. **Phase 6 — Custom admin (9 pixel-matched screens).**
7. **Phase 7 — Hardening + deploy.**

## Self-Review
- **Spec coverage (Phase 0 slice):** scaffold ✓, Neon ✓, Blob (guarded) ✓, tokens/fonts ✓, TS strict ✓, health/DB verify ✓, admin seed ✓, repo/push ✓. Full-spec coverage tracked across the roadmap above.
- **Placeholders:** none — commands and file responsibilities are concrete; scaffolding is verify-by-running (not TDD-shaped), which the skill permits for setup tasks.
- **Consistency:** `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN` names are used identically across tasks; `@/*` alias consistent.

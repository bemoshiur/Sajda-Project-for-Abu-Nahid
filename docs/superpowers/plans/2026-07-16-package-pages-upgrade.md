# Package Pages Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Package listing (rich filter sidebar + detailed cards) and Package detail (Information/Tour Plan/Location tabs + "Book This Tour" form) to match the Figma, and add a site-wide BDT⇄USD currency toggle — without breaking the existing Stripe booking flow.

**Architecture:** New Packages fields (`badge`, `tier`, `specs`, `ratingCount`) drive the cards. A cookie-backed `CurrencyProvider` + `<Price>` client component renders currency-aware prices everywhere on the storefront. The listing fetches published packages server-side and hands them to a client `<PackageExplorer>` that filters in-memory. The detail page uses a client `<PackageTabs>` and a `<BookThisTour>` guest form that creates an enquiry.

**Tech Stack:** Next.js 16 App Router, Payload v3, Tailwind v4, React 19 (useActionState/useState), no new deps.

## Global Constraints
- Currency: BDT is the stored base; USD derived via `settings.usdRate`. Default display BDT.
- No new npm packages. Native `<input type="range">` for the budget slider; keyless Google Maps `<iframe>` embed for Location.
- Reuse existing components: `Container`, `Button`, `SectionHeading`, `Testimonials`, `RichText`, design tokens (primary `#0188ff`, navy, coral, muted, line, surface; fonts font-display/sans/body/ui).
- Prices on the storefront render via `<Price amountBdt={n} />`; invoices/PDF/admin stay `formatBDT`.
- After any Payload collection change: `pnpm generate:types`.
- Work on branch `feat/package-pages-upgrade`; ship via PR → CI → merge to `main`.

---

## Task 1: Packages data model + reseed

**Files:** Modify `src/collections/Packages.ts`; modify `src/payload/seed/seedCatalog.ts`.

- [ ] **Add fields** to `Packages.fields` (after `featured`):
  - `badge` select `{ none, top_package, best_seller, popular }` default `none`, admin sidebar.
  - `tier` select `{ economy, standard, premium }` default `standard`.
  - `ratingCount` number, min 0, default 0.
  - `specs` array `{ label: text, value: text }` (admin description "Card spec rows").
- [ ] **Reseed:** in `seedCatalog.ts`, add `badge`/`tier`/`ratingCount`/`specs` to each of the 6 packages — tours get Hotel Class/Flight Type/Visa/Transport specs; Hajj/Umrah get Makkah Hotel/Madinah Hotel/Room Sharing/Distance to Haram. Since seed is idempotent (upsert by slug), update the existing docs.
- [ ] **Run:** `pnpm generate:types && pnpm seed` — verify no errors; `pnpm typecheck` passes.
- [ ] **Commit:** `feat(packages): add badge/tier/specs/ratingCount fields + reseed`

## Task 2: Currency toggle

**Files:** Create `src/components/currency/CurrencyProvider.tsx`, `Price.tsx`, `CurrencyToggle.tsx`; modify `src/app/(frontend)/layout.tsx` (wrap with provider, read cookie + usdRate) and `src/components/layout/SiteHeader.tsx` (add toggle).

- [ ] `CurrencyProvider` ('use client'): React context holding `{ currency: 'BDT'|'USD', usdRate, setCurrency }`. `setCurrency` writes `document.cookie = 'currency=…;path=/;max-age=31536000'`. Init from a `initial` prop.
- [ ] `Price` ('use client'): `({ amountBdt, className, per }) ` → uses `useCurrency()`; renders `formatBDT` or `formatUSD(bdtToUsd(amountBdt, usdRate))`; optional ` / per person` suffix.
- [ ] `CurrencyToggle` ('use client'): two-segment pill `৳ BDT | $ USD` calling `setCurrency`.
- [ ] `(frontend)/layout.tsx`: server-read `cookies().get('currency')` + `getSettings().usdRate`; wrap `{children}` in `<CurrencyProvider initial={{currency, usdRate}}>`. (Header/footer stay outside or inside — put provider around the whole body content so header toggle + prices share context.)
- [ ] `SiteHeader`: render `<CurrencyToggle />` next to Sign in (desktop) and in the mobile menu.
- [ ] **Verify:** `pnpm typecheck` + `pnpm build`; dev — toggle flips prices and persists on reload.
- [ ] **Commit:** `feat(currency): BDT/USD toggle with cookie-backed provider`

## Task 3: Package card redesign

**Files:** Modify `src/components/ui/PackageCard.tsx`. Consumes: `Package` type (with new fields), `<Price>`, `packageImage`, `isIllustration`.

- [ ] Rebuild the card: badge pill (top-left, color by `badge`), image, title, a 4-row spec block from `pkg.specs` (label left muted / value right navy), a star row (filled to `Math.round(ratingAvg)`) + `({ratingCount})`, a footer with duration + optional `nextDate` prop (travel date) and `<Price amountBdt={pkg.basePrice} per="person" />`, and a full-width "View Packages" style link/button to `/packages/[slug]`.
- [ ] Accept an optional `nextDate?: string` prop for the upcoming departure date.
- [ ] **Verify:** `pnpm typecheck`.
- [ ] **Commit:** `feat(packages): redesign package card (badge, specs, rating, per-person price)`

## Task 4: Listing hero + filter + explorer

**Files:** Modify `src/app/(frontend)/packages/page.tsx`; create `src/components/packages/PackageExplorer.tsx`; modify `src/lib/data.ts` (add `getPackagesWithNextDeparture` returning `{ pkg, nextDate }[]`, and reuse for the widget). Consumes: `PackageCard`, `Testimonials`, `Container`.

- [ ] `data.ts`: `getPackagesWithNextDeparture(opts)` → published packages + each package's earliest open departure date (single query per, or a batched departures query keyed by package id).
- [ ] `PackageExplorer` ('use client'): props `{ items: {pkg, nextDate}[] }`. State: search, destination, budget `[min,max]`, tier, durations Set, services Set. Left sidebar ("Plan Your Journey") with all controls (Search Package input, Destination select from distinct destinations, budget range slider, All/Economy/Standard/Premium tabs, Duration pills 7/10/15/21+, Included Services checkboxes, Search + Reset). Filter in-memory: title/destination contains search; destination match; `basePrice` within budget; tier match; `duration.days` in selected buckets; services match against `included[].item` text. Right: responsive grid of `<PackageCard pkg nextDate/>`; empty state. Mobile: sidebar becomes a collapsible "Filters" panel.
- [ ] `packages/page.tsx`: image hero band (category-aware title) + `<PackageExplorer items={…}/>` + `<Testimonials reviews={…}/>`. `dynamic = 'force-dynamic'`.
- [ ] **Verify:** `pnpm typecheck` + `pnpm build`; dev — each filter narrows results; Reset clears.
- [ ] **Commit:** `feat(packages): filterable listing with hero + sidebar (Plan Your Journey)`

## Task 5: Detail tabs + map + Book This Tour

**Files:** Modify `src/app/(frontend)/packages/[slug]/page.tsx`; create `src/components/packages/PackageTabs.tsx`, `src/components/packages/BookThisTour.tsx`, `src/app/actions/booking-request.ts`. Consumes: `RichText`, `<Price>`, `getDeparturesForPackage`.

- [ ] `booking-request.ts` ('use server'): `submitBookingRequest(prev, formData)` — Zod validate `{ name, email, confirmEmail, phone, joinDate, tickets, packageId }`; require `email === confirmEmail`; create an `enquiry` (source `package_page`, `travelMonth`=joinDate, `travelers`=tickets, `package`, message summarizing). Honeypot `company`. Returns `{ ok, error?, message? }`.
- [ ] `PackageTabs` ('use client'): tabs Information / Tour Plan / Location. Information = overview `<RichText>` + highlights chips + included (Check) / excluded (X). Tour Plan = itinerary days (title, description, accommodation chip derived from `tier` → premium "5 Star", standard "4 Star", economy "3 Star", + "Breakfast" chip). Location = `<iframe src={`https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`}>`.
- [ ] `BookThisTour` ('use client'): sticky card; `useActionState(submitBookingRequest)`; fields Name, Email, Confirm Email, Phone, Join date (date), Number of tickets (number); success panel; below it a `<Button href={`/book/${slug}`}>Book & pay online</Button>` and `<Price amountBdt={basePrice} per="person"/>`.
- [ ] `packages/[slug]/page.tsx`: hero (title over image) + `<PackageTabs pkg/>` (left) + `<BookThisTour ...>` (right sticky) + departures list. Keep `generateMetadata`.
- [ ] **Verify:** `pnpm typecheck` + `pnpm build`; dev — tabs switch, map renders, Book This Tour creates an enquiry (mismatched confirm email is rejected).
- [ ] **Commit:** `feat(packages): tabbed detail (info/plan/location) + Book This Tour form`

## Task 6: Verify + PR

- [ ] `pnpm typecheck && pnpm lint && pnpm build` — all green.
- [ ] Browser smoke test: `/packages` (filters + currency toggle), `/packages/[slug]` (tabs + map + book form), enquiry lands in `/admin/enquiries`. Screenshots.
- [ ] Push branch; open PR into `main` (`gh pr create`); wait for CI green; merge (admin) → Vercel production.

## Self-review
- **Spec coverage:** data model ✓(T1), currency toggle ✓(T2), card ✓(T3), listing hero+filter+testimonials ✓(T4), detail tabs+map+Book This Tour+pay-online ✓(T5), verify+PR ✓(T6). Guest-request + pay-online both in T5. Client-side filter in T4.
- **Placeholders:** none — each task names exact files, fields, props, and behaviors.
- **Consistency:** `<Price amountBdt>` used identically in T2/T3/T5; `specs {label,value}` consistent T1↔T3; `nextDate` prop consistent T3↔T4; `submitBookingRequest` signature consistent T5.

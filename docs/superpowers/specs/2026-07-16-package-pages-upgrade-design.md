# Package Listing & Detail Upgrade — Design Spec

**Date:** 2026-07-16
**Branch:** `feat/package-pages-upgrade`
**Status:** Approved

## Goal

Upgrade the Package **listing** and **detail** pages to match the Figma design:
a rich filter sidebar + detailed cards on the listing, a tabbed detail page
(Information / Tour Plan / Location + map) with a "Book This Tour" form, and a
site-wide BDT ⇄ USD currency toggle. Keep the existing paid-booking (Stripe) flow.

## Decisions (confirmed)
- **Currency:** BDT default + a BDT ⇄ USD toggle (USD converted via `settings.usdRate`).
- **"Book This Tour" form:** guest booking-request (creates an enquiry, no login) **plus**
  a "Book & pay online" button that routes logged-in customers to the existing `/book/[slug]` Stripe flow.
- Filtering is **client-side / instant** (in-memory over the published catalog).

## Data model — Packages additions
- `badge`: select — `none` | `top_package` | `best_seller` | `popular`.
- `tier`: select — `economy` | `standard` | `premium` (powers the level filter).
- `specs`: array of `{ label: text, value: text }` — the 4-row card spec block
  (tour: Hotel Class / Flight Type / Visa / Transport; Hajj/Umrah: Makkah Hotel /
  Madinah Hotel / Room Sharing / Distance to Haram).
- `ratingCount`: number — review count shown beside the star rating.

Re-seed the 6 packages with realistic `badge`/`tier`/`specs`/`ratingCount`.
`ratingAvg` already exists; travel dates come from the earliest open departure.
The Location map is a keyless Google Maps embed derived from `destination`.

## Currency toggle
- `CurrencyProvider` (client context) seeded from a `currency` cookie (default `BDT`).
- `<Price amountBdt />` client component formats using the active currency + `usdRate`
  (passed down from settings via a provider prop).
- `<CurrencyToggle />` in the site header flips BDT/USD and persists the cookie.
- All storefront prices (cards, detail, book page) use `<Price>`; server-only spots
  (invoices/PDF/admin) stay BDT.

## Package listing (`/packages`)
- Image **hero** band (category-aware) with the page title.
- `<PackageExplorer packages usdRate />` client component:
  - **Filter sidebar** ("Plan Your Journey"): search text, destination `<select>`
    (distinct destinations), **budget range** slider (min/max from catalog),
    All/Economy/Standard/Premium tabs, Duration pills (7/10/15/21+ days),
    Included Services checkboxes (Visa/Flight, Hotel/Transport, Guide/Ziyarah →
    match against `included[]`), **Search** + **Reset**.
  - Results grid of `<PackageCard>`; empty state when filters match nothing.
  - Filtering is in-memory; "Search" applies, "Reset" clears.
- Testimonials strip (reuse `Testimonials`) below.
- Server page fetches published packages (+ next departure date per package) and settings.

## Package card
Badge · image · title · 4-row spec block (from `specs`) · star rating + `ratingCount` ·
duration + next travel date · **`<Price>` / per person** · "View Packages" button →
`/packages/[slug]`.

## Package detail (`/packages/[slug]`)
- Hero: title over the package image.
- `<PackageTabs>` client tabs:
  - **Information:** overview (RichText) + highlights + included / excluded.
  - **Tour Plan:** day-by-day itinerary; each day shows title, description,
    "5 Star Accommodation" and "Breakfast" chips (from itinerary data + package tier).
  - **Location:** Google Maps `<iframe>` embed built from `destination`.
- Sticky **"Book This Tour"** card:
  - Guest form: Name, Email, Confirm Email, Phone, Join date, Number of tickets →
    server action creates an **enquiry** (source `package_page`, travelMonth/date +
    travelers), with a success state. Confirm-Email must match Email.
  - **"Book & pay online"** button → `/book/[slug]` (existing Stripe flow).
  - Price shown via `<Price>`; upcoming departures listed.

## Files
- Modify: `src/collections/Packages.ts`; seed (`src/payload/seed/seedCatalog.ts`);
  `src/app/(frontend)/packages/page.tsx`; `src/app/(frontend)/packages/[slug]/page.tsx`;
  `src/components/ui/PackageCard.tsx`; `src/components/layout/SiteHeader.tsx` (toggle).
- Add: `src/components/currency/CurrencyProvider.tsx`, `Price.tsx`, `CurrencyToggle.tsx`;
  `src/components/packages/PackageExplorer.tsx`, `PackageTabs.tsx`, `BookThisTour.tsx`;
  `src/app/actions/booking-request.ts` (guest enquiry action).
- `src/lib/data.ts`: helper for distinct destinations + next-departure map if needed.

## Non-functional
- Fully responsive (sidebar collapses on mobile to a filter drawer/accordion).
- Accessible (labelled inputs, slider keyboard support, tab roles).
- No new heavy deps (native range input; no map API key).

## Verification
- `pnpm typecheck && pnpm lint && pnpm build` green.
- Browser: listing filters (each dimension) + currency toggle + detail tabs + map +
  "Book This Tour" → enquiry appears in `/admin/enquiries`. Screenshots.
- Ship via PR → CI → merge to `main` (Vercel production).

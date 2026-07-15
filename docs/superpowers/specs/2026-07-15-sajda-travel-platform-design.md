# Sajda Travel & Tours — Platform Design Spec

**Date:** 2026-07-15
**Project:** Sajda Travel & Tours Limited — Tour, Hajj & Umrah booking platform
**Repo:** https://github.com/bemoshiur/Sajda-Project-for-Abu-Nahid
**Status:** Approved (design), planning implementation

---

## 1. Goal & scope

Build a production-ready travel-booking platform in a single Next.js app with three surfaces, all pixel-matched to the provided Figma (`SAJDA.fig`, 16 designed screens):

1. **Public website** (7 screens): Landing, Packages (listing), Package detail, About us, Blog, Contact us, Book Now.
2. **Customer portal**: register/login, online booking + payment, booking tracking, invoices (PDF), enquiries, reviews, profile.
3. **Custom admin** (9 screens): Dashboard Home, Orders, Products, Inventory, Customers, Suppliers, Reports & Analytics, Users & Roles, Settings.

The admin is a **fully custom, pixel-matched** UI. Payload CMS v3 is used as a **headless backend** (data, auth, access control, file uploads) — its built-in admin panel is not the delivered admin.

### Domain vocabulary mapping (confirmed)
- **Products** = travel packages
- **Orders** = bookings
- **Inventory** = departures / seat availability
- **Suppliers** = vendors (hotels, airlines, transport, visa)

### Currency (confirmed)
- Prices are **displayed in BDT (৳)** by default.
- A **currency/FX layer** localizes display based on a configurable USD rate (and other currencies). Stored amounts use a canonical currency (BDT) with an FX conversion utility; Stripe charges in a configurable presentment currency.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript, strict) |
| Backend/CMS | Payload CMS v3 (headless) — `payload`, `@payloadcms/next`, `@payloadcms/richtext-lexical` |
| Database | Neon Postgres via `@payloadcms/db-postgres` |
| File storage | Vercel Blob via `@payloadcms/storage-vercel-blob` |
| Payments | Stripe (Checkout Session + webhook fulfillment), `stripe` + `@stripe/stripe-js` |
| Invoices | `@react-pdf/renderer` → PDF → Vercel Blob |
| Email | Resend (`resend`); no-op fallback when key absent |
| Charts | Recharts |
| Styling | Tailwind CSS v4 + design tokens; `next/font` (Playfair Display, Volkhov, Poppins, Inter, Manrope); Radix UI primitives for a11y |
| Validation | Zod (form + API input) |
| Testing | Vitest (unit), Playwright (E2E) |
| Hosting | Vercel + Neon + Vercel Blob; GitHub CI |

## 3. Architecture

Single Next.js app. Payload runs in-process (Local API for server components/actions; REST for client where needed).

### Route groups (`src/app/`)
```
(frontend)/            public site
  page.tsx                       Landing
  packages/page.tsx              Listing (filter by category tour/hajj/umrah)
  packages/[slug]/page.tsx       Package detail
  about/page.tsx
  blog/page.tsx  blog/[slug]/page.tsx
  contact/page.tsx
  book/[slug]/page.tsx           Book Now (start booking)
(auth)/                customer auth
  login  register  forgot-password  reset-password
(customer)/dashboard/  customer portal (guarded)
  page.tsx (overview)  bookings/  bookings/[id]/  invoices/  enquiries/  reviews/  profile/
(admin)/admin/         custom admin (guarded, staff only)
  page.tsx (Dashboard Home)  orders/  products/  inventory/  customers/
  suppliers/  reports/  users/  settings/
(payload)/             Payload generated routes (api, admin fallback)
api/                   route handlers: stripe/webhook, checkout, invoices/[id]/pdf, revalidate
```

### Data access
- Server components & server actions use Payload **Local API** (`getPayload({ config })`).
- Client mutations (forms) call **server actions** or thin route handlers; inputs validated with Zod.
- Stripe fulfillment is webhook-driven (idempotent).

## 4. Data model (Payload)

### Auth collections
- **users** (staff): email+password (auth), `name`, `role` (superadmin|admin|manager|staff), `avatar`, `phone`, `isActive`. Backs Users & Roles + admin login.
- **customers** (storefront): email+password (auth), `name`, `phone`, `address` (line1/city/country/postcode), `passportNumber`, `passportExpiry`, `dateOfBirth`, `avatar`.

### Domain collections
- **packages** (Products): `title`, `slug`, `category` (tour|hajj|umrah), `shortDescription`, `overview` (richText), `heroImage`, `gallery[]`, `basePrice` (BDT), `duration` (days/nights), `destination`, `startLocation`, `hotelInfo`, `flightInfo`, `foodInfo`, `transportInfo`, `included[]`, `excluded[]`, `itinerary[]` (day/title/description/image), `highlights[]`, `status` (draft|published), `featured`, `ratingAvg` (derived), `tags[]`, `seo`.
- **departures** (Inventory): `package` (rel), `departureDate`, `returnDate`, `price`, `seatsTotal`, `seatsBooked`, `status` (open|full|closed|cancelled). Derived `seatsAvailable`.
- **bookings** (Orders): `bookingNumber` (auto), `customer` (rel), `package` (rel), `departure` (rel), `travelers[]` (name/passportNumber/type), `travelersCount`, `subtotal`/`discount`/`total`, `currency`, `status` (pending|confirmed|paid|cancelled|completed|refunded), `paymentStatus` (unpaid|paid|partial|refunded), `passportCopies[]` (private media), `notes`, `source` (web|admin), `createdBy`.
- **payments**: `booking` (rel), `amount`, `currency`, `provider` (stripe), `stripeSessionId`, `stripePaymentIntentId`, `status` (created|succeeded|failed|refunded), `receiptUrl`, `paidAt`, `raw` (json).
- **invoices**: `invoiceNumber` (settings prefix + sequence), `booking` (rel), `customer` (rel), `lineItems[]` (description/qty/unitPrice/total), `subtotal`/`discount`/`tax`/`total`, `currency`, `issueDate`, `dueDate`, `status` (draft|sent|paid|void), `pdfUrl`.
- **enquiries** (Call List/Leads): `name`, `phone`, `email`, `package` (rel, optional), `interestedCategory`, `travelMonth`, `travelers`, `message`, `callNote`, `status` (new|contacted|interested|confirmed|cancelled), `assignedTo` (rel users), `source` (hero_widget|contact_form|package_page).
- **suppliers**: `name`, `type` (hotel|airline|transport|visa|other), `contactPerson`, `phone`, `email`, `address`, `services[]`, `rating`, `status` (active|inactive), `linkedPackages[]`, `notes`.
- **reviews**: `authorName`, `customer` (rel, optional), `rating` (1–5), `title`, `body`, `image`, `package` (rel, optional), `status` (pending|approved|rejected), `featured`.
- **posts** (Blog): `title`, `slug`, `excerpt`, `coverImage`, `body` (richText), `author`, `category`, `tags[]`, `publishedAt`, `status`, `readTime`, `seo`.
- **media**: uploads → Vercel Blob. Passport copies stored with access control (owner + staff only).

### Globals
- **settings**: `companyName`, `logo`, `favicon`, `phones[]`, `emails[]`, `whatsapp`, `address`, `googleMapEmbed`, `socialLinks`, `invoicePrefix`, `invoiceFooterNote`, `baseCurrency` (BDT), `usdRate`, `heroStats`, `businessHours`, `seoDefaults`.

## 5. Key flows

### Enquiry
Hero "Plan Your Journey" widget + contact form + package-detail CTA → validated (Zod) → create `enquiry` → appears in admin Orders/Call List → optional email acknowledgement.

### Booking + payment (Stripe)
1. Book Now / package CTA → require customer login (redirect to `(auth)/login` with return URL).
2. Booking form: choose `departure`, travelers, upload passport copies → server action creates `booking` (status `pending`, `paymentStatus` unpaid).
3. Checkout: server creates **Stripe Checkout Session** for the total (presentment currency configurable) → redirect to Stripe.
4. Webhook `checkout.session.completed` (idempotent): mark booking `paid`, create `payment`, generate `invoice` + PDF → Blob, decrement `departure.seatsBooked`, send confirmation email.
5. Redirect to `/dashboard/bookings/[id]` (success) or handle cancel/fail.

### Reviews
Customer/visitor submits (rating/title/body/image) → `pending` → admin approves → published on site (featured ones on landing testimonials).

## 6. Auth & access control
- Payload auth (HTTP-only cookie/JWT), two collections.
- Next.js middleware guards `(customer)` (any customer) and `(admin)` (users with staff+ role).
- Payload access rules: customers read/update only their own `bookings`/`invoices`/`enquiries`/`reviews`; `media` passport copies restricted; staff scoped by role. Public read for published `packages`/`posts`/approved `reviews`.

## 7. Design system & pixel-matching
- Palette: primary `#0188FF`, navy `#181433`/`#181E4B`, coral `#DF6951`, deep blue `#004179`, plus neutrals extracted from Figma.
- Fonts via `next/font`: Playfair Display, Volkhov, Poppins, Inter, Manrope.
- Extract exact spacing/typography/layout per screen from Figma nodes (`work/nodes_slim_*.json`) and rendered references; build a shared token layer + component kit; recreate all 16 screens.
- Placeholder Figma copy ("Xpro", lorem ipsum) is ignored; real copy from BRD/seed content.
- Fully responsive (Figma includes mobile frames).

## 8. Non-functional
- SEO: per-page metadata, `sitemap.xml`, `robots.txt`, JSON-LD for packages, OG images.
- A11y: semantic HTML, focus states, keyboard nav, contrast (Radix primitives).
- Security: Zod validation, rate-limiting + honeypot on public forms, Stripe webhook signature verification, private media, env-based secrets, CSRF-safe server actions.
- Reliability: idempotent webhooks, loading/error/empty states, optimistic UI where safe.
- Seed script with real Sajda packages, departures, reviews, blog posts, settings, and an admin user.
- Tests: Vitest (access control, currency/FX, invoice numbering, utils) + Playwright (enquiry submit, booking→Stripe test payment→invoice, admin CRUD, review moderation).

## 9. Deployment
- Vercel project linked to the GitHub repo; Neon `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SERVER_URL`.
- Stripe webhook endpoint configured for `checkout.session.completed`, `payment_intent.payment_failed`, refunds.
- GitHub Actions: typecheck + lint + test on PR.

## 10. Build order (phased, each shippable)
0. **Foundation** — scaffold Next 15 + Payload v3 + Neon + Tailwind + fonts + design tokens; git → GitHub; Vercel skeleton deploy; env wiring.
1. **Data layer** — all collections/globals + access control + Blob + seed script.
2. **Design system + shared UI** — tokens, nav, footer, buttons, cards, form controls, section primitives (from Figma landing).
3. **Public site** — 7 pages pixel-matched; enquiry form + hero widget; reviews display; SEO.
4. **Customer auth + portal** — register/login/forgot/reset; dashboard overview, bookings, invoices, enquiries, reviews, profile.
5. **Booking + payment** — booking flow + Stripe Checkout + webhook fulfillment + invoice PDF + emails + FX/currency layer.
6. **Custom admin** — 9 pixel-matched screens wired to Payload (charts on Dashboard Home + Reports).
7. **Hardening** — responsive/a11y QA, tests, performance, production deploy + Stripe live webhook.

## 11. Assumptions & risks
- Stripe merchant availability in Bangladesh is limited; presentment currency is configurable and FX layer decouples display (BDT) from charge currency. Revisit gateway if go-live requires local settlement.
- Figma admin content is template-derived; layouts are matched, data is real.
- `claude_design` MCP import not required — full design bundle is available locally.

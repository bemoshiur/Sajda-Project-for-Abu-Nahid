# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-07-16

Initial production release — a full-stack Tour, Hajj & Umrah booking platform.

### Added

**Public website**
- Landing page with hero + "Plan Your Journey" enquiry widget, services,
  package categories, featured packages, why-choose, testimonials, blog, and CTA.
- Package listing with category filter (Tour / Hajj / Umrah).
- Package detail with overview, itinerary, included/excluded, departures, and enquiry.
- About, Blog (list + post), and Contact (form + map) pages.

**Customer portal (`/dashboard`)**
- Registration, login, logout (Payload-backed auth).
- Overview with KPIs, bookings, invoices (PDF download), and profile editing.

**Booking & payments**
- Booking flow with server-computed totals; Stripe Checkout with a graceful
  "payment on request" fallback when Stripe is not configured.
- Stripe webhook fulfillment (idempotent): booking paid → payment, invoice, and
  seat decrement.
- Branded invoice PDF generation.
- BDT base currency with a configurable USD FX layer.

**Custom admin (`/admin`)**
- Staff login and role-aware dashboard (KPIs, revenue chart, recent activity).
- Screens: Orders, Enquiries, Products, Inventory, Customers, Suppliers,
  Reviews (approve/reject/feature), Users & Roles, Reports, Settings.
- Payload CMS retained at `/cms` for deep content editing.

**Backend & platform**
- Next.js 16 (App Router) + Payload CMS v3 (headless) + Neon Postgres.
- 11 collections + settings with role-based access control and field-level locks.
- Vercel Blob storage adapter, seed scripts, and health check endpoint.

### Security
- Fail-fast on missing/weak `PAYLOAD_SECRET` / `DATABASE_URL`.
- Field-level locks prevent privilege escalation, price tampering, and review
  self-approval; private media collection for passport documents.
- No information disclosure on the health endpoint; seed fails closed.

[1.0.0]: https://github.com/bemoshiur/Sajda-Project-for-Abu-Nahid/releases/tag/v1.0.0

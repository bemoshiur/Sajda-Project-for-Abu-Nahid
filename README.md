# Sajda Travel & Tours Limited

Production travel-booking platform for **Tour, Hajj & Umrah** packages — public website, customer portal (online booking + payment), and a fully custom admin dashboard.

Built to the approved design spec: [`docs/superpowers/specs/2026-07-15-sajda-travel-platform-design.md`](docs/superpowers/specs/2026-07-15-sajda-travel-platform-design.md).

## Stack
- **Next.js 15** (App Router, React 19, TypeScript)
- **Payload CMS v3** — headless backend (data, auth, access control, uploads)
- **Neon Postgres**
- **Vercel Blob** — file storage
- **Stripe** — online payments
- **Tailwind CSS v4** + Recharts + Radix UI

## Surfaces
- **Public site** (`/`) — Landing, Packages, Package detail, About, Blog, Contact, Book Now
- **Customer portal** (`/dashboard`) — bookings, invoices, enquiries, reviews, profile
- **Admin** (`/admin`) — Dashboard, Orders, Products, Inventory, Customers, Suppliers, Reports & Analytics, Users & Roles, Settings

## Development
```bash
pnpm install
cp .env.example .env   # fill in secrets
pnpm dev
```

## Environment
See `.env.example` for required variables (Neon `DATABASE_URL`, `PAYLOAD_SECRET`, Vercel Blob, Stripe keys, Resend).

---
_Sajda Travel & Tours Limited — BRD by AL Tamam Global Solutions._

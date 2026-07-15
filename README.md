<div align="center">

# Sajda Travel & Tours Limited

**Production Tour, Hajj & Umrah booking platform** — public website, customer portal
with online booking & payment, and a fully custom admin dashboard.

[![CI](https://github.com/bemoshiur/Sajda-Project-for-Abu-Nahid/actions/workflows/ci.yml/badge.svg)](https://github.com/bemoshiur/Sajda-Project-for-Abu-Nahid/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Payload](https://img.shields.io/badge/Payload-3.86-000)](https://payloadcms.com)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

🌐 **Live:** https://sajda-project-for-abu-nahid.vercel.app

</div>

---

## Stack

- **Next.js 16** (App Router, React 19, TypeScript strict)
- **Payload CMS v3** — headless backend (data, auth, access control, uploads)
- **Neon Postgres** · **Vercel Blob** (storage)
- **Stripe** — online payments · **@react-pdf/renderer** — invoices
- **Tailwind CSS v4** · **Recharts** · **Lucide**

## Surfaces

| Area | Path | Highlights |
|---|---|---|
| Public site | `/` | Landing, Packages + detail, About, Blog, Contact, Book Now |
| Customer portal | `/dashboard` | Bookings, invoices (PDF), profile — login `/login` |
| Custom admin | `/admin` | Dashboard, Orders, Enquiries, Products, Inventory, Customers, Suppliers, Reviews, Users & Roles, Reports, Settings — login `/admin/login` |
| CMS | `/cms` | Payload admin for deep content editing |

## Getting started

```bash
pnpm install
cp .env.example .env      # fill in the values (see DEPLOYMENT.md)
pnpm dev                  # http://localhost:3000
pnpm seed                 # optional: seed baseline content
```

Requires Node ≥ 24 (see `.nvmrc`) and pnpm ≥ 9.

## Project structure

```
src/
  app/
    (frontend)/    public marketing site + booking
    (auth)/        customer login / register
    (customer)/    customer portal (guarded)
    (admin)/       custom admin panel (guarded)
    (payload)/     Payload CMS (/cms) + REST/GraphQL API
    actions/       server actions (auth, booking, enquiries, admin)
    api/           health, stripe webhook, invoice PDF
  collections/     Payload collections (data model)
  globals/         Payload globals (settings)
  access/          role-based access-control helpers
  components/      UI kit, layout, home, dashboard, admin, pdf
  lib/             data access, currency/FX, images, stripe, fulfillment
  payload.config.ts
docs/              design spec + implementation plans
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | develop / build / serve |
| `pnpm typecheck` · `pnpm lint` | quality gates (run by CI) |
| `pnpm generate:types` · `pnpm generate:importmap` | after Payload collection changes |
| `pnpm seed` | seed baseline content |

## Deployment

Hosted on **Vercel** (auto-deploys from `main`). See **[DEPLOYMENT.md](DEPLOYMENT.md)**
for the required environment variables and Stripe webhook setup.

## Contributing

Branching model, commit conventions, and workflow are in **[CONTRIBUTING.md](CONTRIBUTING.md)**.
Release history is in **[CHANGELOG.md](CHANGELOG.md)**.

---

<div align="center">
<sub>© 2026 Sajda Travel & Tours Limited — All rights reserved. BRD by AL Tamam Global Solutions.</sub>
</div>

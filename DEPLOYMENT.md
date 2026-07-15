# Deploying Sajda to Vercel

The GitHub repo is already connected to Vercel (auto-deploys on push to `main`).
The **only** remaining step is setting environment variables in the Vercel dashboard —
without them the app returns 500 ("missing secret key").

## 1. Set environment variables

Vercel → Project → **Settings → Environment Variables** (Production + Preview).

### Required (site will not boot without these)
> ⚠️ Do **not** commit these values. Set them only in the Vercel dashboard / your local `.env`.

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon **pooled** connection string (the one with `-pooler` in the host). Copy it from the Neon dashboard → Connect, or from your local `.env` (`DATABASE_URL_POOLED`). Serverless needs the pooled endpoint. |
| `PAYLOAD_SECRET` | A 32+ char random string. Generate with `openssl rand -hex 32`, or reuse the value already in your local `.env`. Keep it identical across deploys. |
| `NEXT_PUBLIC_SERVER_URL` | `https://sajda-project-for-abu-nahid.vercel.app` |

The Neon database already contains the full schema + seeded content (packages,
reviews, blog, settings, the super-admin) — no migration or seeding needed on Vercel.
The exact secret values are in your local `.env` (gitignored) — copy them from there.

### Optional (features degrade gracefully without them)
| Key | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token — enables media/passport uploads. Create a Blob store in Vercel → Storage; the token is added automatically. Without it, uploads are disabled but the site renders. |
| `STRIPE_SECRET_KEY` | Stripe secret key — enables online checkout. Without it, bookings are saved as "payment on request". |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (see step 3) |
| `STRIPE_CURRENCY` | `usd` (default) or `bdt` — currency Stripe charges in |
| `USD_TO_BDT_RATE` | FX rate for BDT↔USD display (default 120) |
| `RESEND_API_KEY` | Resend key for transactional email (optional) |

## 2. Redeploy
After adding the variables, trigger a redeploy (Deployments → ⋯ → Redeploy, or push a commit).

## 3. Stripe webhook (only if using Stripe)
Stripe → Developers → Webhooks → Add endpoint:
- URL: `https://sajda-project-for-abu-nahid.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`, then redeploy.

## Surfaces once live
- Public site: `/`
- Customer portal: `/dashboard` (register at `/register`)
- Custom admin: `/admin` (login at `/admin/login`)
- Payload CMS (full content editing): `/cms`

## Admin login
- Email: `admin@sajda.com`
- Password: the value of `SEED_ADMIN_PASSWORD` from local `.env` (rotate for production via `/cms`).

## Notes
- Local dev uses the Neon **direct** endpoint (no `-pooler`) for reliable schema push;
  production uses the **pooled** endpoint. Both point at the same database.
- Schema changes: run `pnpm generate:types && pnpm generate:importmap` locally, and let
  Payload dev-push apply them to Neon, before deploying.

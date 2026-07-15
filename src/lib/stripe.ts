import 'server-only'
import Stripe from 'stripe'

let cached: Stripe | null | undefined

/** Stripe client, or null when STRIPE_SECRET_KEY isn't configured. */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached
  const key = process.env.STRIPE_SECRET_KEY
  cached = key ? new Stripe(key) : null
  return cached
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

/**
 * Convert a canonical BDT amount to the Stripe presentment currency + minor units.
 * Default charges in USD (converted via usdRate); set STRIPE_CURRENCY=bdt to charge BDT.
 */
export function toStripeAmount(bdt: number, usdRate: number): { amount: number; currency: string } {
  const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase()
  if (currency === 'bdt') {
    return { amount: Math.round(bdt * 100), currency: 'bdt' }
  }
  const usd = usdRate > 0 ? bdt / usdRate : bdt
  return { amount: Math.max(50, Math.round(usd * 100)), currency: 'usd' }
}

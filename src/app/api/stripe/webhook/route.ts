import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getStripe } from '@/lib/stripe'
import { markBookingPaid } from '@/lib/fulfillment'

export const dynamic = 'force-dynamic'

/** Stripe fulfillment webhook. Verifies the signature and marks bookings paid. */
export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
  }

  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig ?? '', secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      const payload = await getPayload({ config: await config })
      await markBookingPaid(payload, bookingId, {
        paymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      }).catch((err) => console.error('[stripe webhook] fulfillment failed:', err))
    }
  }

  return NextResponse.json({ received: true })
}

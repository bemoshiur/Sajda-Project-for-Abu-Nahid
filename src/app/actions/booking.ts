'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentCustomer } from '@/lib/auth'
import { getStripe, toStripeAmount } from '@/lib/stripe'

const schema = z.object({
  packageId: z.coerce.number(),
  departureId: z.string().optional(),
  travelersCount: z.coerce.number().int().min(1).max(20),
  notes: z.string().optional(),
})

export type BookingState = { error?: string }

/**
 * Create a booking for the signed-in customer and either send them to Stripe
 * Checkout (when configured) or record it as a payment-on-request booking.
 * Totals are always computed server-side from the package/departure price.
 */
export async function createBookingAndCheckout(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/login')

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: 'Please complete the booking form.' }
  const { packageId, departureId, travelersCount, notes } = parsed.data

  const payload = await getPayload({ config: await config })

  const pkg = await payload.findByID({ collection: 'packages', id: packageId }).catch(() => null)
  if (!pkg || pkg.status !== 'published') return { error: 'This package is not available.' }

  let unitPrice = pkg.basePrice
  let departureRef: number | undefined
  if (departureId) {
    const dep = await payload.findByID({ collection: 'departures', id: departureId, depth: 0 }).catch(() => null)
    const depPkgId =
      dep && typeof dep.package === 'object' && dep.package
        ? Number((dep.package as { id: number }).id)
        : Number(dep?.package)
    // Fail closed: the departure must belong to this package and be open,
    // so a mismatched departureId can never be used to manipulate the price.
    if (!dep || depPkgId !== Number(pkg.id) || dep.status !== 'open') {
      return { error: 'The selected departure is not available for this package.' }
    }
    unitPrice = dep.price
    departureRef = Number(dep.id)
  }
  const total = unitPrice * travelersCount

  const booking = await payload.create({
    collection: 'bookings',
    data: {
      customer: customer.id,
      package: pkg.id,
      departure: departureRef,
      travelersCount,
      subtotal: total,
      total,
      currency: 'BDT',
      status: 'pending',
      paymentStatus: 'unpaid',
      notes,
      source: 'web',
    },
  })

  const stripe = getStripe()
  if (stripe) {
    const settings = await payload.findGlobal({ slug: 'settings' }).catch(() => null)
    const usdRate = settings?.usdRate ?? 120
    const { amount, currency } = toStripeAmount(total, usdRate)
    const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: pkg.title,
              description: `${travelersCount} traveler(s) · ${booking.bookingNumber}`,
            },
          },
        },
      ],
      metadata: { bookingId: String(booking.id), customerId: String(customer.id) },
      success_url: `${origin}/dashboard/bookings/${booking.id}?success=1`,
      cancel_url: `${origin}/dashboard/bookings/${booking.id}?canceled=1`,
    })

    await payload.create({
      collection: 'payments',
      data: {
        booking: booking.id,
        amount: total,
        currency: 'BDT',
        provider: 'stripe',
        stripeSessionId: session.id,
        status: 'created',
      },
    })

    if (session.url) redirect(session.url)
  }

  redirect(`/dashboard/bookings/${booking.id}?requested=1`)
}

/** Re-create a Stripe Checkout session for an existing unpaid booking. */
export async function retryBookingCheckout(bookingId: string): Promise<void> {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/login')

  const payload = await getPayload({ config: await config })
  const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 1 }).catch(() => null)
  const ownerId =
    booking && typeof booking.customer === 'object' && booking.customer
      ? Number((booking.customer as { id: number }).id)
      : Number(booking?.customer)

  if (!booking || ownerId !== Number(customer.id) || booking.paymentStatus === 'paid') {
    redirect(`/dashboard/bookings/${bookingId}`)
  }

  const stripe = getStripe()
  if (!stripe) redirect(`/dashboard/bookings/${bookingId}`)

  const pkgTitle =
    booking.package && typeof booking.package === 'object' && 'title' in booking.package
      ? String(booking.package.title)
      : 'Sajda Package'
  const settings = await payload.findGlobal({ slug: 'settings' }).catch(() => null)
  const { amount, currency } = toStripeAmount(booking.total ?? 0, settings?.usdRate ?? 120)
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const session = await stripe!.checkout.sessions.create({
    mode: 'payment',
    customer_email: customer.email,
    line_items: [
      { quantity: 1, price_data: { currency, unit_amount: amount, product_data: { name: pkgTitle } } },
    ],
    metadata: { bookingId: String(booking.id), customerId: String(customer.id) },
    success_url: `${origin}/dashboard/bookings/${booking.id}?success=1`,
    cancel_url: `${origin}/dashboard/bookings/${booking.id}?canceled=1`,
  })
  if (session.url) redirect(session.url)
  redirect(`/dashboard/bookings/${booking.id}`)
}

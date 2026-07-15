import type { Payload } from 'payload'
import { generateInvoiceNumber } from './numbering'

function relId(v: unknown): number | undefined {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && 'id' in v) return Number((v as { id: number | string }).id)
  return v ? Number(v) : undefined
}

/**
 * Idempotently mark a booking as paid: update booking + payment, generate an
 * invoice, and decrement departure seats. Safe to call more than once.
 */
export async function markBookingPaid(
  payload: Payload,
  bookingId: number | string,
  opts?: { paymentIntentId?: string; receiptUrl?: string },
): Promise<void> {
  const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 1 }).catch(() => null)
  if (!booking || booking.paymentStatus === 'paid') return

  const amount = booking.total ?? 0
  const customerId = relId(booking.customer)
  const pkgTitle =
    booking.package && typeof booking.package === 'object' && 'title' in booking.package
      ? String(booking.package.title)
      : 'Package'

  await payload.update({
    collection: 'bookings',
    id: bookingId,
    data: { status: 'paid', paymentStatus: 'paid' },
  })

  const payments = await payload.find({
    collection: 'payments',
    where: { booking: { equals: bookingId } },
    sort: '-createdAt',
    limit: 1,
  })
  const payment = payments.docs[0]
  if (payment) {
    await payload.update({
      collection: 'payments',
      id: payment.id,
      data: {
        status: 'succeeded',
        paidAt: new Date().toISOString(),
        stripePaymentIntentId: opts?.paymentIntentId,
        receiptUrl: opts?.receiptUrl,
      },
    })
  }

  if (customerId) {
    const settings = await payload.findGlobal({ slug: 'settings' }).catch(() => null)
    await payload.create({
      collection: 'invoices',
      data: {
        invoiceNumber: generateInvoiceNumber(settings?.invoicePrefix || 'SAJ'),
        booking: Number(bookingId),
        customer: customerId,
        lineItems: [
          {
            description: `${pkgTitle} (${booking.travelersCount ?? 1} traveler(s))`,
            qty: 1,
            unitPrice: amount,
            total: amount,
          },
        ],
        subtotal: amount,
        total: amount,
        currency: 'BDT',
        issueDate: new Date().toISOString(),
        status: 'paid',
      },
    })
  }

  const depId = relId(booking.departure)
  if (depId) {
    const dep = await payload.findByID({ collection: 'departures', id: depId }).catch(() => null)
    if (dep) {
      const booked = (dep.seatsBooked ?? 0) + (booking.travelersCount ?? 1)
      await payload.update({
        collection: 'departures',
        id: depId,
        data: { seatsBooked: booked, status: booked >= (dep.seatsTotal ?? 0) ? 'full' : 'open' },
      })
    }
  }
}

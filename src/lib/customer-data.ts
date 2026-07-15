import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Booking, Invoice } from '@/payload-types'

export async function getCustomerBookings(customerId: number | string): Promise<Booking[]> {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'bookings',
    where: { customer: { equals: customerId } },
    sort: '-createdAt',
    depth: 1,
    limit: 100,
  })
  return res.docs
}

export async function getCustomerInvoices(customerId: number | string): Promise<Invoice[]> {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'invoices',
    where: { customer: { equals: customerId } },
    sort: '-issueDate',
    depth: 1,
    limit: 100,
  })
  return res.docs
}

export async function getBookingForCustomer(
  bookingId: string,
  customerId: number | string,
): Promise<Booking | null> {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'bookings',
    where: { and: [{ id: { equals: bookingId } }, { customer: { equals: customerId } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

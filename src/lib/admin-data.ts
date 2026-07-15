import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CollectionSlug, Where } from 'payload'

export async function adminClient() {
  return getPayload({ config: await config })
}

export type AdminStats = {
  enquiries: number
  newEnquiries: number
  packages: number
  customers: number
  bookings: number
  invoices: number
  reviews: number
  pendingReviews: number
  revenue: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const payload = await adminClient()
  const count = (collection: CollectionSlug, where?: Where) =>
    payload.count({ collection, where }).then((r) => r.totalDocs)

  const [enquiries, newEnquiries, packages, customers, bookings, invoices, reviews, pendingReviews, paid] =
    await Promise.all([
      count('enquiries'),
      count('enquiries', { status: { equals: 'new' } }),
      count('packages'),
      count('customers'),
      count('bookings'),
      count('invoices'),
      count('reviews'),
      count('reviews', { status: { equals: 'pending' } }),
      payload.find({ collection: 'invoices', where: { status: { equals: 'paid' } }, limit: 1000, depth: 0 }),
    ])

  const revenue = paid.docs.reduce((s, i) => s + (i.total ?? 0), 0)
  return { enquiries, newEnquiries, packages, customers, bookings, invoices, reviews, pendingReviews, revenue }
}

/** Bookings + revenue for the last 6 months, oldest first (for the dashboard chart). */
export async function getRevenueSeries(): Promise<{ month: string; bookings: number; revenue: number }[]> {
  const payload = await adminClient()
  const now = new Date()
  const months: { month: string; key: string; bookings: number; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      bookings: 0,
      revenue: 0,
    })
  }
  const since = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()
  const bookings = await payload.find({
    collection: 'bookings',
    where: { createdAt: { greater_than_equal: since } },
    limit: 2000,
    depth: 0,
  })
  for (const b of bookings.docs) {
    const d = new Date(b.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const bucket = months.find((m) => m.key === key)
    if (bucket) {
      bucket.bookings += 1
      if (b.paymentStatus === 'paid') bucket.revenue += b.total ?? 0
    }
  }
  return months.map(({ month, bookings, revenue }) => ({ month, bookings, revenue }))
}

export async function getRecent<T = unknown>(
  collection: CollectionSlug,
  opts?: { limit?: number; sort?: string; depth?: number; where?: Where },
): Promise<T[]> {
  const payload = await adminClient()
  const res = await payload.find({
    collection,
    limit: opts?.limit ?? 8,
    sort: opts?.sort ?? '-createdAt',
    depth: opts?.depth ?? 1,
    where: opts?.where,
  })
  return res.docs as T[]
}

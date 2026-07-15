'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentStaff } from '@/lib/auth'
import { markBookingPaid } from '@/lib/fulfillment'
import type { Enquiry, Booking } from '@/payload-types'

async function requireStaff() {
  const staff = await getCurrentStaff()
  if (!staff) throw new Error('Unauthorized')
  return staff
}

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  await requireStaff()
  const payload = await getPayload({ config: await config })
  await payload.update({ collection: 'enquiries', id, data: { status: status as NonNullable<Enquiry['status']> }, overrideAccess: true })
  revalidatePath('/admin/enquiries')
  revalidatePath('/admin')
}

export async function moderateReview(id: string, status: 'approved' | 'rejected'): Promise<void> {
  await requireStaff()
  const payload = await getPayload({ config: await config })
  await payload.update({ collection: 'reviews', id, data: { status }, overrideAccess: true })
  revalidatePath('/admin/reviews')
  revalidatePath('/admin')
}

export async function toggleReviewFeatured(id: string, featured: boolean): Promise<void> {
  await requireStaff()
  const payload = await getPayload({ config: await config })
  await payload.update({ collection: 'reviews', id, data: { featured }, overrideAccess: true })
  revalidatePath('/admin/reviews')
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  await requireStaff()
  const payload = await getPayload({ config: await config })
  await payload.update({ collection: 'bookings', id, data: { status: status as NonNullable<Booking['status']> }, overrideAccess: true })
  revalidatePath('/admin/orders')
}

/** Manually mark a booking as paid (generates invoice, decrements seats). */
export async function adminMarkBookingPaid(id: string): Promise<void> {
  await requireStaff()
  const payload = await getPayload({ config: await config })
  await markBookingPaid(payload, id)
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

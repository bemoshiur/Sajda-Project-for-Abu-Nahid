'use server'

import { z } from 'zod'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@/payload.config'

const schema = z
  .object({
    name: z.string().min(2, 'Please enter your name'),
    email: z.string().email('Enter a valid email'),
    confirmEmail: z.string().email('Confirm your email'),
    phone: z.string().min(6, 'Enter a valid phone number'),
    joinDate: z.string().optional(),
    tickets: z.coerce.number().int().min(1).max(50),
    packageId: z.string(),
  })
  .refine((d) => d.email === d.confirmEmail, {
    message: 'Emails do not match',
    path: ['confirmEmail'],
  })

export type BookingRequestState = { ok: boolean; error?: string; message?: string }

/**
 * Guest "Book This Tour" request from the package detail page. Creates an
 * enquiry (lead) — no login required. The paid flow is `/book/[slug]`.
 */
export async function submitBookingRequest(
  _prev: BookingRequestState,
  formData: FormData,
): Promise<BookingRequestState> {
  if (formData.get('company')) return { ok: true, message: 'Thanks!' } // honeypot

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }
  const d = parsed.data

  try {
    const payload = await getPayload({ config: await config })
    const data: RequiredDataFromCollectionSlug<'enquiries'> = {
      name: d.name,
      phone: d.phone,
      email: d.email,
      status: 'new',
      travelMonth: d.joinDate || undefined,
      travelers: d.tickets,
      source: 'package_page',
      package: Number(d.packageId),
      message: `Booking request for ${d.tickets} traveler(s)${d.joinDate ? `, join date ${d.joinDate}` : ''}.`,
    }
    await payload.create({ collection: 'enquiries', data })
    return { ok: true, message: "Thank you! We've received your request and will contact you shortly." }
  } catch {
    return { ok: false, error: 'Something went wrong. Please try again or call us.' }
  }
}

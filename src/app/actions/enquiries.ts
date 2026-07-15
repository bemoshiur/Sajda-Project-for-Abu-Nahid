'use server'

import { z } from 'zod'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@/payload.config'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  interestedCategory: z.enum(['tour', 'hajj', 'umrah', 'other']).optional(),
  travelMonth: z.string().optional(),
  travelers: z.coerce.number().int().positive().optional(),
  message: z.string().optional(),
  packageId: z.string().optional(),
  source: z.enum(['hero_widget', 'contact_form', 'package_page']).default('contact_form'),
})

export type EnquiryState = { ok: boolean; error?: string; message?: string }

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }
  const d = parsed.data

  // Honeypot: bots fill hidden "company" field.
  if (formData.get('company')) return { ok: true, message: 'Thanks!' }

  try {
    const payload = await getPayload({ config: await config })
    const data: RequiredDataFromCollectionSlug<'enquiries'> = {
      name: d.name,
      phone: d.phone,
      status: 'new',
      email: d.email || undefined,
      interestedCategory: d.interestedCategory,
      travelMonth: d.travelMonth,
      travelers: d.travelers,
      message: d.message,
      source: d.source,
      ...(d.packageId ? { package: Number(d.packageId) } : {}),
    }
    await payload.create({ collection: 'enquiries', data })
    return { ok: true, message: "Thank you! We'll contact you shortly." }
  } catch {
    return { ok: false, error: 'Something went wrong. Please try again or call us.' }
  }
}

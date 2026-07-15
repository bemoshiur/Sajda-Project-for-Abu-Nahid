'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentCustomer } from '@/lib/auth'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().optional(),
  line1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  passportNumber: z.string().optional(),
})

export type ProfileState = { ok?: boolean; error?: string; message?: string }

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const customer = await getCurrentCustomer()
  if (!customer) return { error: 'You are not signed in.' }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  const d = parsed.data

  try {
    const payload = await getPayload({ config: await config })
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: {
        name: d.name,
        phone: d.phone,
        passportNumber: d.passportNumber,
        address: { line1: d.line1, city: d.city, country: d.country, postcode: d.postcode },
      },
    })
    revalidatePath('/dashboard/profile')
    return { ok: true, message: 'Profile updated.' }
  } catch {
    return { error: 'Could not update your profile. Please try again.' }
  }
}

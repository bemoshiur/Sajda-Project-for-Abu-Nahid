import 'server-only'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Customer, User } from '@/payload-types'

export type AuthUser =
  | (User & { collection: 'users' })
  | (Customer & { collection: 'customers' })
  | null

/** Resolve the currently authenticated principal (staff or customer), or null. */
export async function getAuth(): Promise<{
  payload: Awaited<ReturnType<typeof getPayload>>
  user: AuthUser
}> {
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  return { payload, user: (user as AuthUser) ?? null }
}

export function isStaffUser(user: AuthUser): user is User & { collection: 'users' } {
  return !!user && user.collection === 'users'
}

export function isCustomerUser(user: AuthUser): user is Customer & { collection: 'customers' } {
  return !!user && user.collection === 'customers'
}

export async function getCurrentCustomer(): Promise<(Customer & { collection: 'customers' }) | null> {
  const { user } = await getAuth()
  return isCustomerUser(user) ? user : null
}

export async function getCurrentStaff(): Promise<(User & { collection: 'users' }) | null> {
  const { user } = await getAuth()
  return isStaffUser(user) ? user : null
}

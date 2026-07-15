'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@/payload.config'

const COOKIE = 'payload-token'

async function setAuthCookie(token: string, exp?: number) {
  const c = await cookies()
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: exp ? new Date(exp * 1000) : undefined,
  })
}

export type AuthState = { error?: string }

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function loginCustomer(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: 'Enter a valid email and password.' }

  const payload = await getPayload({ config: await config })
  try {
    const res = await payload.login({ collection: 'customers', data: parsed.data })
    if (!res.token) return { error: 'Invalid email or password.' }
    await setAuthCookie(res.token, res.exp)
  } catch {
    return { error: 'Invalid email or password.' }
  }
  redirect('/dashboard')
}

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function registerCustomer(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' }

  const payload = await getPayload({ config: await config })
  try {
    await payload.create({
      collection: 'customers',
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        password: parsed.data.password,
      },
    })
    const res = await payload.login({
      collection: 'customers',
      data: { email: parsed.data.email, password: parsed.data.password },
    })
    if (res.token) await setAuthCookie(res.token, res.exp)
  } catch {
    return { error: 'Could not create the account. This email may already be registered.' }
  }
  redirect('/dashboard')
}

export async function loginStaff(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: 'Enter a valid email and password.' }

  const payload = await getPayload({ config: await config })
  try {
    const res = await payload.login({ collection: 'users', data: parsed.data })
    if (!res.token) return { error: 'Invalid email or password.' }
    if (res.user && res.user.isActive === false) return { error: 'This staff account is disabled.' }
    await setAuthCookie(res.token, res.exp)
  } catch {
    return { error: 'Invalid email or password.' }
  }
  redirect('/admin')
}

export async function logout() {
  const c = await cookies()
  c.delete(COOKIE)
  redirect('/')
}

export async function logoutStaff() {
  const c = await cookies()
  c.delete(COOKIE)
  redirect('/admin/login')
}

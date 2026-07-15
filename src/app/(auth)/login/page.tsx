import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/AuthForms'
import { getCurrentCustomer } from '@/lib/auth'

export const metadata: Metadata = { title: 'Sign in' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await getCurrentCustomer()) redirect('/dashboard')
  return <LoginForm />
}

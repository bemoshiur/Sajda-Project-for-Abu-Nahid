import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/AuthForms'
import { getCurrentCustomer } from '@/lib/auth'

export const metadata: Metadata = { title: 'Create account' }
export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  if (await getCurrentCustomer()) redirect('/dashboard')
  return <RegisterForm />
}

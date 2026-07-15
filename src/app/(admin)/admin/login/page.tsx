import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { StaffLoginForm } from '@/components/admin/StaffLoginForm'
import { getCurrentStaff } from '@/lib/auth'

export const metadata: Metadata = { title: 'Staff Login' }
export const dynamic = 'force-dynamic'

export default async function StaffLoginPage() {
  if (await getCurrentStaff()) redirect('/admin')
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <StaffLoginForm />
    </div>
  )
}

import React from 'react'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { getCurrentStaff } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff()
  if (!staff) redirect('/admin/login')

  return (
    <AdminShell staffName={staff.name ?? staff.email} role={staff.role}>
      {children}
    </AdminShell>
  )
}

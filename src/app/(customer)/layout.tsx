import React from 'react'
import { redirect } from 'next/navigation'
import { fontVariables } from '@/lib/fonts'
import { CustomerShell } from '@/components/dashboard/CustomerShell'
import { getCurrentCustomer } from '@/lib/auth'
import '../(frontend)/globals.css'

export const dynamic = 'force-dynamic'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/login')

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <CustomerShell customerName={customer.name ?? customer.email}>{children}</CustomerShell>
      </body>
    </html>
  )
}

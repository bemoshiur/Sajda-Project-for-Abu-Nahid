import React from 'react'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { fontVariables } from '@/lib/fonts'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CurrencyProvider } from '@/components/currency/CurrencyProvider'
import { getSettings } from '@/lib/data'
import type { DisplayCurrency } from '@/lib/currency'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Sajda Travel & Tours — Tour, Hajj & Umrah Packages',
    template: '%s · Sajda Travel & Tours',
  },
  description:
    'Book your Tour, Hajj or Umrah pilgrimage with trusted services and packages. Sajda Travel & Tours Limited.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const currency: DisplayCurrency = cookieStore.get('currency')?.value === 'USD' ? 'USD' : 'BDT'
  const settings = await getSettings().catch(() => null)
  const usdRate = settings?.usdRate ?? 120

  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-screen flex-col bg-white">
        <CurrencyProvider initial={{ currency, usdRate }}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CurrencyProvider>
      </body>
    </html>
  )
}

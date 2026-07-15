import React from 'react'
import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Sajda Travel & Tours — Tour, Hajj & Umrah Packages',
    template: '%s · Sajda Travel & Tours',
  },
  description:
    'Book your Tour, Hajj or Umrah pilgrimage with trusted services and packages. Sajda Travel & Tours Limited.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

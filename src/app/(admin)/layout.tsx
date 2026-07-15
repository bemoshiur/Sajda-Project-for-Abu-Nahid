import React from 'react'
import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import '../(frontend)/globals.css'

export const metadata: Metadata = { title: 'Sajda Admin' }

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-surface">{children}</body>
    </html>
  )
}

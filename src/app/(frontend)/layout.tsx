import React from 'react'
import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
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
      <body>{children}</body>
    </html>
  )
}

import React from 'react'
import Image from 'next/image'
import { fontVariables } from '@/lib/fonts'
import { Logo } from '@/components/ui/Logo'
import { BRAND } from '@/lib/images'
import '../(frontend)/globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-navy lg:flex lg:flex-col lg:justify-between lg:p-12">
            <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <Logo dark />
            <div className="relative z-10 flex flex-col items-center">
              <Image
                src={BRAND.kaaba}
                alt=""
                width={420}
                height={500}
                className="h-auto w-3/4 object-contain"
              />
              <p className="mt-6 max-w-sm text-center font-display text-2xl font-bold text-white">
                Your Tour, Hajj &amp; Umrah journey begins here.
              </p>
            </div>
            <p className="relative z-10 font-body text-sm text-white/50">
              © Sajda Travel &amp; Tours Limited 2026
            </p>
          </div>
          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <Logo />
              </div>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

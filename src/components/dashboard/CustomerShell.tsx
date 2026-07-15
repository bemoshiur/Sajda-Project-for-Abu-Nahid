'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Menu, X, Home } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: Briefcase },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export function CustomerShell({
  customerName,
  children,
}: {
  customerName: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium transition',
              active ? 'bg-primary text-white' : 'text-ink/70 hover:bg-surface-2',
            )}
          >
            <item.icon className="h-4.5 w-4.5" /> {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white p-5 lg:flex">
        <Logo />
        <div className="mt-8 flex flex-1 flex-col">
          {nav}
          <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-ink/70 hover:bg-surface-2">
              <Home className="h-4.5 w-4.5" /> Back to site
            </Link>
            <form action={logout}>
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-coral hover:bg-coral/10">
                <LogOut className="h-4.5 w-4.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2">
          <Menu className="h-6 w-6 text-navy" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white p-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2">
                <X className="h-6 w-6 text-navy" />
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col">
              {nav}
              <form action={logout} className="mt-auto border-t border-line pt-4">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-coral hover:bg-coral/10">
                  <LogOut className="h-4.5 w-4.5" /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="hidden items-center justify-between border-b border-line bg-white px-8 py-4 lg:flex">
          <h1 className="font-display text-xl font-bold text-navy">My Dashboard</h1>
          <span className="font-body text-sm text-muted">
            Welcome, <span className="font-semibold text-navy">{customerName}</span>
          </span>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

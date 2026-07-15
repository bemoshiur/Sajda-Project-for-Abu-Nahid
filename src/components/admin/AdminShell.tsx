'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, PhoneCall, Package, Boxes, Users2, Truck,
  Star, BarChart3, UserCog, Settings, ExternalLink, LogOut, Menu, X,
} from 'lucide-react'
import { logoutStaff } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Enquiries', href: '/admin/enquiries', icon: PhoneCall },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Customers', href: '/admin/customers', icon: Users2 },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Users & Roles', href: '/admin/users', icon: UserCog },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminShell({
  staffName,
  role,
  children,
}: {
  staffName: string
  role?: string | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-white">
          S
        </span>
        <div className="leading-none">
          <p className="font-display text-base font-bold text-white">Sajda</p>
          <p className="font-ui text-[10px] tracking-widest text-white/50 uppercase">Admin</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition',
              isActive(item.href) ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
            )}
          >
            <item.icon className="h-4.5 w-4.5" /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-0.5 border-t border-white/10 px-3 py-3">
        <a
          href="/cms"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4.5 w-4.5" /> Open CMS
        </a>
        <form action={logoutStaff}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-coral hover:bg-coral/10">
            <LogOut className="h-4.5 w-4.5" /> Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-navy lg:block">{sidebar}</aside>

      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <span className="font-display text-lg font-bold text-navy">Sajda Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2">
          <Menu className="h-6 w-6 text-navy" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 rounded-lg p-1 text-white/70">
              <X className="h-6 w-6" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-line bg-white/90 px-8 py-4 backdrop-blur lg:flex">
          <AdminBreadcrumb pathname={pathname} />
          <div className="flex items-center gap-3">
            <span className="text-right leading-tight">
              <span className="block font-sans text-sm font-semibold text-navy">{staffName}</span>
              <span className="block font-ui text-xs text-muted-2 capitalize">{role ?? 'staff'}</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-sans text-sm font-bold text-white">
              {staffName.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

function AdminBreadcrumb({ pathname }: { pathname: string }) {
  const seg = pathname.split('/').filter(Boolean)
  const label = seg.length <= 1 ? 'Dashboard' : seg[1].replace(/-/g, ' ')
  return <h1 className="font-display text-xl font-bold text-navy capitalize">{label}</h1>
}

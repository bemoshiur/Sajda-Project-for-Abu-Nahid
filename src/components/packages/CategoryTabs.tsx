'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const TABS: { label: string; href: string; key?: string }[] = [
  { label: 'All', href: '/packages' },
  { label: 'Tour', href: '/packages?category=tour', key: 'tour' },
  { label: 'Hajj', href: '/packages?category=hajj', key: 'hajj' },
  { label: 'Umrah', href: '/packages?category=umrah', key: 'umrah' },
]

export function CategoryTabs({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {TABS.map((tab) => {
        const isActive = (tab.key ?? undefined) === (active ?? undefined)
        return (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex items-center rounded-full px-5 py-2 font-sans text-sm font-semibold transition-colors',
              isActive
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'border border-line text-ink hover:border-primary hover:text-primary',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

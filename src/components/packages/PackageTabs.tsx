'use client'

import { useState, type ReactNode } from 'react'
import { Info, ListChecks, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, typeof Info> = { information: Info, plan: ListChecks, location: MapPin }

export function PackageTabs({
  tabs,
}: {
  tabs: { key: string; label: string; content: ReactNode }[]
}) {
  const [active, setActive] = useState(tabs[0]?.key)
  const current = tabs.find((t) => t.key === active) ?? tabs[0]

  return (
    <div>
      <div className="flex gap-1 rounded-2xl border border-line bg-white p-1">
        {tabs.map((t) => {
          const Icon = ICONS[t.key] ?? Info
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-sans text-sm font-semibold transition',
                active === t.key ? 'bg-primary text-white' : 'text-muted hover:text-navy',
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>
      <div className="mt-6">{current?.content}</div>
    </div>
  )
}

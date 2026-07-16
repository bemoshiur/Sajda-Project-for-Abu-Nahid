'use client'

import { useCurrency } from './CurrencyProvider'
import type { DisplayCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

const OPTIONS: { value: DisplayCurrency; label: string }[] = [
  { value: 'BDT', label: '৳ BDT' },
  { value: 'USD', label: '$ USD' },
]

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency()
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-white p-0.5',
        className,
      )}
      role="group"
      aria-label="Display currency"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setCurrency(o.value)}
          aria-pressed={currency === o.value}
          className={cn(
            'rounded-full px-2.5 py-1 font-ui text-xs font-semibold transition',
            currency === o.value ? 'bg-primary text-white' : 'text-muted hover:text-navy',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

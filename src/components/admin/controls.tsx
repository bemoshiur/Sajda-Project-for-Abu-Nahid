'use client'

import { useTransition } from 'react'
import { Check, X, Star } from 'lucide-react'
import { moderateReview, toggleReviewFeatured } from '@/app/actions/admin'
import { cn } from '@/lib/utils'

/** Inline status dropdown that calls a server action on change. */
export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string
  value: string
  options: { value: string; label: string }[]
  action: (id: string, status: string) => Promise<void>
}) {
  const [pending, start] = useTransition()
  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value
        start(() => action(id, v))
      }}
      className={cn(
        'rounded-lg border border-line bg-white px-2.5 py-1.5 font-ui text-xs font-semibold text-navy capitalize focus:border-primary focus:outline-none',
        pending && 'opacity-50',
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function ReviewActions({ id, featured }: { id: string; featured?: boolean | null }) {
  const [pending, start] = useTransition()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => start(() => moderateReview(id, 'approved'))}
        disabled={pending}
        title="Approve"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={() => start(() => moderateReview(id, 'rejected'))}
        disabled={pending}
        title="Reject"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50"
      >
        <X className="h-4 w-4" />
      </button>
      <button
        onClick={() => start(() => toggleReviewFeatured(id, !featured))}
        disabled={pending}
        title={featured ? 'Unfeature' : 'Feature'}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-lg disabled:opacity-50',
          featured ? 'bg-amber-100 text-amber-600' : 'bg-surface-2 text-muted-2 hover:bg-surface',
        )}
      >
        <Star className={cn('h-4 w-4', featured && 'fill-current')} />
      </button>
    </div>
  )
}

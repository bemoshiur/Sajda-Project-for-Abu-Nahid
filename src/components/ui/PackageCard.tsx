'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, CalendarDays, Star, ArrowRight } from 'lucide-react'
import type { Package } from '@/payload-types'
import { Price } from '@/components/currency/Price'
import { packageImage, isIllustration } from '@/lib/images'
import { cn } from '@/lib/utils'

const CATEGORY_LABEL: Record<string, string> = { tour: 'Tour', hajj: 'Hajj', umrah: 'Umrah' }

const BADGE: Record<string, { label: string; cls: string }> = {
  top_package: { label: 'Top Package', cls: 'bg-navy text-white' },
  best_seller: { label: 'Best Seller', cls: 'bg-coral text-white' },
  popular: { label: 'Popular', cls: 'bg-primary text-white' },
}

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export function PackageCard({ pkg, nextDate }: { pkg: Package; nextDate?: string | null }) {
  const img = packageImage(pkg)
  const illustration = isIllustration(pkg.category)
  const badge = pkg.badge && pkg.badge !== 'none' ? BADGE[pkg.badge] : null
  const specs = (pkg.specs ?? []).slice(0, 4)
  const rating = Math.round(pkg.ratingAvg ?? 5)
  const days = pkg.duration?.days
  const nights = pkg.duration?.nights

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10">
      <div className={cn('relative h-48 overflow-hidden', illustration ? 'bg-primary-50' : 'bg-surface-2')}>
        <Image
          src={img}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn('transition duration-500 group-hover:scale-105', illustration ? 'object-contain p-4' : 'object-cover')}
        />
        {badge ? (
          <span className={cn('absolute top-3 left-3 rounded-full px-3 py-1 font-ui text-xs font-semibold shadow-sm', badge.cls)}>
            {badge.label}
          </span>
        ) : null}
        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 font-ui text-xs font-semibold text-navy backdrop-blur">
          {CATEGORY_LABEL[pkg.category] ?? pkg.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg leading-snug font-bold text-navy">{pkg.title}</h3>

        {specs.length ? (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5">
            {specs.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 border-b border-line/70 pb-1.5 last:border-0">
                <dt className="font-ui text-xs text-muted-2">{s.label}</dt>
                <dd className="font-sans text-xs font-semibold text-navy">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex items-center gap-2">
          <span className="flex text-coral">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn('h-3.5 w-3.5', i < rating ? 'fill-current' : 'text-line')} />
            ))}
          </span>
          <span className="font-ui text-xs text-muted-2">
            {(pkg.ratingAvg ?? 5).toFixed(1)}
            {pkg.ratingCount ? ` (${pkg.ratingCount})` : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-xs text-muted">
          {days ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" /> {days}D{nights ? `/${nights}N` : ''}
            </span>
          ) : null}
          {nextDate ? (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-primary" /> {fmtDate(nextDate)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
          <div>
            <span className="font-ui text-[10px] text-muted-2 uppercase">From</span>
            <p className="font-sans text-lg font-bold text-navy">
              <Price amountBdt={pkg.basePrice} per="person" />
            </p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            View <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

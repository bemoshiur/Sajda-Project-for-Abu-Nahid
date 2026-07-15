import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import type { Package } from '@/payload-types'
import { formatBDT } from '@/lib/currency'
import { packageImage, isIllustration } from '@/lib/images'
import { cn } from '@/lib/utils'

const CATEGORY_LABEL: Record<string, string> = { tour: 'Tour', hajj: 'Hajj', umrah: 'Umrah' }

export function PackageCard({ pkg }: { pkg: Package }) {
  const img = packageImage(pkg)
  const illustration = isIllustration(pkg.category)
  const nights = pkg.duration?.nights
  const days = pkg.duration?.days

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
    >
      <div className={cn('relative h-52 overflow-hidden', illustration ? 'bg-primary-50' : 'bg-surface-2')}>
        <Image
          src={img}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn(
            'transition duration-500 group-hover:scale-105',
            illustration ? 'object-contain p-4' : 'object-cover',
          )}
        />
        <span className="absolute top-3 left-3 rounded-full bg-navy/85 px-3 py-1 font-ui text-xs font-semibold text-white backdrop-blur">
          {CATEGORY_LABEL[pkg.category] ?? pkg.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold text-navy">{pkg.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-sm text-muted">
          {pkg.destination ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> {pkg.destination}
            </span>
          ) : null}
          {days ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> {days}D{nights ? `/${nights}N` : ''}
            </span>
          ) : null}
        </div>
        {pkg.shortDescription ? (
          <p className="line-clamp-2 font-body text-sm text-muted">{pkg.shortDescription}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <div>
            <span className="font-ui text-xs text-muted-2">From</span>
            <p className="font-sans text-lg font-bold text-navy">{formatBDT(pkg.basePrice)}</p>
          </div>
          <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary">
            View <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

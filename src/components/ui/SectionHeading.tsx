import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/** Eyebrow + display title used across marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  light = false,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
  light?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-ui text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          'font-display text-3xl leading-tight font-bold sm:text-4xl',
          light ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('max-w-2xl font-body text-base', light ? 'text-white/70' : 'text-muted')}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

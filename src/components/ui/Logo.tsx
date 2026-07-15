import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/images'

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5', className)} aria-label="Sajda Travel & Tours — home">
      <Image
        src={BRAND.logo}
        alt=""
        width={48}
        height={48}
        className="h-11 w-11 object-contain"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-lg font-bold tracking-tight', dark ? 'text-white' : 'text-navy')}>
          Sajda
        </span>
        <span className={cn('font-ui text-[10px] font-medium tracking-[0.2em] uppercase', dark ? 'text-white/60' : 'text-muted')}>
          Travel &amp; Tours
        </span>
      </span>
    </Link>
  )
}

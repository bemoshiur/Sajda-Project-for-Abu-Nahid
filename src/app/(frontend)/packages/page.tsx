import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { PackageExplorer } from '@/components/packages/PackageExplorer'
import { Testimonials } from '@/components/home/Testimonials'
import { getPackagesWithNextDeparture, getReviews } from '@/lib/data'
import { BRAND } from '@/lib/images'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Packages' }

const VALID_CATEGORIES = ['tour', 'hajj', 'umrah'] as const
type Category = (typeof VALID_CATEGORIES)[number]

const HERO_TITLE: Record<Category, string> = {
  tour: 'Tour Packages',
  hajj: 'Hajj Packages',
  umrah: 'Umrah Packages',
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: rawCategory } = await searchParams
  const category =
    rawCategory && (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
      ? (rawCategory as Category)
      : undefined

  const [items, reviews] = await Promise.all([
    getPackagesWithNextDeparture({ category }),
    getReviews({ limit: 6 }),
  ])

  const title = category ? HERO_TITLE[category] : 'Tour, Hajj & Umrah Packages'

  return (
    <>
      <section className="relative h-56 overflow-hidden sm:h-64">
        <Image src={BRAND.europe} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-navy/50" />
        <Container className="relative flex h-full flex-col items-center justify-center text-center">
          <span className="mb-2 font-ui text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
            Travel with us
          </span>
          <h1 className="font-display text-3xl font-bold text-white sm:text-5xl">{title}</h1>
        </Container>
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <PackageExplorer items={items} />
        </Container>
      </section>

      <Testimonials reviews={reviews} />
    </>
  )
}

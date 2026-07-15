import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { PackageCard } from '@/components/ui/PackageCard'
import { CategoryTabs } from '@/components/packages/CategoryTabs'
import { getPackages } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Packages',
}

const VALID_CATEGORIES = ['tour', 'hajj', 'umrah'] as const

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: rawCategory } = await searchParams
  const category =
    rawCategory && (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
      ? rawCategory
      : undefined

  const packages = await getPackages({ category, limit: 50 })

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-primary-50/60 via-white to-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-32 -left-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <Container className="relative py-14">
          <SectionHeading
            eyebrow="Our Packages"
            title="Tour, Hajj & Umrah Packages"
            description="Explore our full range of thoughtfully designed journeys — from curated tours across Bangladesh and beyond to complete Hajj and Umrah arrangements, with visa, flights, hotels and guidance all handled with care."
          />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container className="flex flex-col gap-10">
          <CategoryTabs active={category} />

          {packages.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-line bg-surface px-8 py-16 text-center">
              <h3 className="font-display text-xl font-bold text-navy">No packages found</h3>
              <p className="font-body text-sm text-muted">
                We could not find any packages in this category right now. Get in touch and our team
                will help you plan a custom journey tailored to you.
              </p>
              <Button href="/contact" variant="primary" size="md" className="mt-2">
                Contact Us
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

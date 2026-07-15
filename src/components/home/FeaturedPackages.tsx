import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { PackageCard } from '@/components/ui/PackageCard'
import type { Package } from '@/payload-types'

export function FeaturedPackages({ packages }: { packages: Package[] }) {
  if (!packages.length) return null
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            eyebrow="Featured Packages"
            title="Popular Journeys, Ready to Book"
            description="Hand-picked packages our travelers love most."
          />
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          <Button href="/packages" variant="outline" size="lg" className="mt-4">
            View All Packages
          </Button>
        </div>
      </Container>
    </section>
  )
}

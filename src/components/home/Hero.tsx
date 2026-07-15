import Image from 'next/image'
import { Star, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { PlanJourneyWidget } from './PlanJourneyWidget'
import { BRAND } from '@/lib/images'

export function Hero({
  packages,
  clientsLabel,
}: {
  packages: { id: number | string; title: string }[]
  clientsLabel: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-white to-white">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <Container className="relative py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 font-ui text-xs font-medium text-muted">
              <ShieldCheck className="h-4 w-4 text-primary" /> {clientsLabel}
            </span>
            <h1 className="font-display text-4xl leading-[1.1] font-bold text-navy sm:text-5xl lg:text-6xl">
              Your Tour, Hajj &amp; Umrah <span className="text-primary">Journey</span> begins here
            </h1>
            <p className="max-w-md font-body text-base text-muted">
              Book your Tour, Hajj or Umrah pilgrimage with trusted services and thoughtfully
              designed packages — visa, flights, hotels and guidance, all handled with care.
            </p>
            <div className="flex items-center gap-2 font-ui text-sm text-muted">
              <span className="flex text-coral">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              Rated 4.9 by pilgrims &amp; travelers
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <Image
              src={BRAND.kaaba}
              alt="The Holy Kaaba, Makkah"
              width={720}
              height={860}
              priority
              className="h-auto w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-8 lg:mt-4">
          <PlanJourneyWidget packages={packages} />
        </div>
      </Container>
    </section>
  )
}

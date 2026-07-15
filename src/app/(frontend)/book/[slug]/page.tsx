import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, MapPin, LogIn } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { BookingForm } from '@/components/booking/BookingForm'
import { getPackageBySlug, getDeparturesForPackage } from '@/lib/data'
import { getCurrentCustomer } from '@/lib/auth'
import { isStripeConfigured } from '@/lib/stripe'
import { packageImage, isIllustration } from '@/lib/images'
import { formatBDT } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  const [customer, departures] = await Promise.all([
    getCurrentCustomer(),
    getDeparturesForPackage(pkg.id),
  ])

  const img = packageImage(pkg)
  const illustration = isIllustration(pkg.category)

  return (
    <Container className="py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Summary */}
        <div className="order-2 lg:order-1">
          <span className="font-ui text-xs font-semibold tracking-wide text-primary uppercase">
            Complete your booking
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">{pkg.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 font-body text-sm text-muted">
            {pkg.destination ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> {pkg.destination}
              </span>
            ) : null}
            {pkg.duration?.days ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> {pkg.duration.days} days
                {pkg.duration.nights ? ` / ${pkg.duration.nights} nights` : ''}
              </span>
            ) : null}
          </div>
          <div className={`mt-6 overflow-hidden rounded-3xl ${illustration ? 'bg-primary-50' : ''}`}>
            <div className="relative h-64 w-full sm:h-80">
              <Image
                src={img}
                alt={pkg.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={illustration ? 'object-contain p-6' : 'object-cover'}
              />
            </div>
          </div>
          {pkg.shortDescription ? (
            <p className="mt-6 font-body text-base text-muted">{pkg.shortDescription}</p>
          ) : null}
        </div>

        {/* Booking panel */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-24 rounded-3xl border border-line bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-ui text-sm text-muted">Starting from</span>
              <span className="font-display text-2xl font-bold text-navy">{formatBDT(pkg.basePrice)}</span>
            </div>

            {customer ? (
              <BookingForm
                packageId={pkg.id}
                basePrice={pkg.basePrice}
                departures={departures.map((d) => ({
                  id: d.id,
                  label: fmtDate(d.departureDate),
                  price: d.price,
                  seatsAvailable: d.seatsAvailable ?? 0,
                }))}
                stripeEnabled={isStripeConfigured()}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-2 px-5 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LogIn className="h-6 w-6" />
                </span>
                <p className="font-sans text-sm font-semibold text-navy">Sign in to book</p>
                <p className="font-body text-sm text-muted">
                  Please sign in or create an account to complete your booking.
                </p>
                <div className="flex w-full flex-col gap-2">
                  <Button href="/login" className="w-full">
                    Sign in
                  </Button>
                  <Link href="/register" className="font-sans text-sm font-semibold text-primary hover:underline">
                    Create an account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

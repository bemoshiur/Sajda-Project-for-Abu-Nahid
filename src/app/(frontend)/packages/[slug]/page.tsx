import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Clock,
  Check,
  X,
  Hotel,
  Plane,
  Utensils,
  Bus,
  CalendarDays,
  Users,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { PackageEnquiry } from '@/components/packages/PackageEnquiry'
import { getPackageBySlug, getDeparturesForPackage } from '@/lib/data'
import { packageImage, isIllustration } from '@/lib/images'
import { formatBDT } from '@/lib/currency'
import { cn } from '@/lib/utils'
import type { Package } from '@/payload-types'

export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<string, string> = { tour: 'Tour', hajj: 'Hajj', umrah: 'Umrah' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return { title: 'Package not found' }
  const title = pkg.title
  const description =
    pkg.shortDescription ?? `${CATEGORY_LABEL[pkg.category] ?? pkg.category} package with Sajda Travel & Tours.`
  return {
    title,
    description,
    openGraph: { title, description, images: [packageImage(pkg)] },
  }
}

function formatDepartureDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  const departures = await getDeparturesForPackage(pkg.id)

  const img = packageImage(pkg)
  const illustration = isIllustration(pkg.category)
  const days = pkg.duration?.days
  const nights = pkg.duration?.nights
  const highlights = (pkg.highlights ?? []).filter((h) => h.label)
  const included = (pkg.included ?? []).filter((i) => i.item)
  const excluded = (pkg.excluded ?? []).filter((i) => i.item)
  const itinerary = (pkg.itinerary ?? []).filter((i) => i.title || i.description)

  const infoItems = buildInfoItems(pkg)

  return (
    <>
      {/* Hero band */}
      <section className="bg-gradient-to-b from-primary-50/60 via-white to-white">
        <Container className="py-10 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-3xl border border-line',
                illustration ? 'bg-primary-50' : 'bg-surface-2',
              )}
            >
              <Image
                src={img}
                alt={pkg.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={illustration ? 'object-contain p-6' : 'object-cover'}
              />
            </div>

            <div className="flex flex-col gap-5">
              <span className="inline-flex w-fit items-center rounded-full bg-navy/85 px-3 py-1 font-ui text-xs font-semibold text-white uppercase">
                {CATEGORY_LABEL[pkg.category] ?? pkg.category}
              </span>
              <h1 className="font-display text-3xl leading-tight font-bold text-navy sm:text-4xl lg:text-5xl">
                {pkg.title}
              </h1>
              {pkg.shortDescription ? (
                <p className="max-w-xl font-body text-base text-muted">{pkg.shortDescription}</p>
              ) : null}

              <div className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-muted">
                {pkg.destination ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> {pkg.destination}
                  </span>
                ) : null}
                {days ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> {days} Days
                    {nights ? ` / ${nights} Nights` : ''}
                  </span>
                ) : null}
                {pkg.startLocation ? (
                  <span className="flex items-center gap-1.5">
                    <Plane className="h-4 w-4 text-primary" /> From {pkg.startLocation}
                  </span>
                ) : null}
              </div>

              <div className="flex items-end gap-2 border-t border-line pt-5">
                <span className="font-ui text-sm text-muted-2">From</span>
                <span className="font-display text-3xl font-bold text-navy">
                  {formatBDT(pkg.basePrice)}
                </span>
                <span className="pb-1 font-ui text-xs text-muted-2">/ person</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main two-column */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* LEFT */}
            <div className="flex min-w-0 flex-col gap-12">
              {/* Overview */}
              {pkg.overview ? (
                <div>
                  <SectionTitle>Overview</SectionTitle>
                  <RichText data={pkg.overview} className="mt-4" />
                </div>
              ) : null}

              {/* Highlights */}
              {highlights.length ? (
                <div>
                  <SectionTitle>Highlights</SectionTitle>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {highlights.map((h) => (
                      <span
                        key={h.id ?? h.label}
                        className="inline-flex items-center rounded-full border border-line bg-primary-50 px-3.5 py-1.5 font-ui text-sm font-medium text-navy"
                      >
                        {h.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Info grid */}
              {infoItems.length ? (
                <div>
                  <SectionTitle>What&apos;s Arranged</SectionTitle>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {infoItems.map(({ key, label, value, Icon }) => (
                      <div
                        key={key}
                        className="flex gap-3 rounded-2xl border border-line bg-white p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-sans text-sm font-semibold text-navy">{label}</p>
                          <p className="font-body text-sm text-muted">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Itinerary */}
              {itinerary.length ? (
                <div>
                  <SectionTitle>Itinerary</SectionTitle>
                  <ol className="mt-6 flex flex-col gap-6 border-l border-line pl-6">
                    {itinerary.map((step, i) => (
                      <li key={step.id ?? i} className="relative">
                        <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary font-ui text-[11px] font-bold text-white ring-4 ring-white">
                          {step.day ?? i + 1}
                        </span>
                        <p className="font-sans text-base font-semibold text-navy">
                          {step.day ? `Day ${step.day}: ` : ''}
                          {step.title}
                        </p>
                        {step.description ? (
                          <p className="mt-1 font-body text-sm leading-relaxed text-muted">
                            {step.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/* Included / Excluded */}
              {included.length || excluded.length ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  {included.length ? (
                    <div>
                      <SectionTitle>What&apos;s Included</SectionTitle>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {included.map((i) => (
                          <li
                            key={i.id ?? i.item}
                            className="flex items-start gap-2.5 font-body text-sm text-ink/80"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span>{i.item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {excluded.length ? (
                    <div>
                      <SectionTitle>Not Included</SectionTitle>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {excluded.map((i) => (
                          <li
                            key={i.id ?? i.item}
                            className="flex items-start gap-2.5 font-body text-sm text-ink/80"
                          >
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                            <span>{i.item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* RIGHT — sticky sidebar */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-6 shadow-sm">
                <div>
                  <span className="font-ui text-xs text-muted-2">From</span>
                  <p className="font-display text-3xl font-bold text-navy">
                    {formatBDT(pkg.basePrice)}
                  </p>
                  <p className="font-ui text-xs text-muted-2">per person</p>
                </div>

                <Button href={`/book/${pkg.slug}`} size="lg" className="w-full">
                  Book Now
                </Button>

                {/* Departures */}
                <div className="border-t border-line pt-5">
                  <p className="flex items-center gap-2 font-sans text-sm font-semibold text-navy">
                    <CalendarDays className="h-4 w-4 text-primary" /> Upcoming Departures
                  </p>
                  {departures.length ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {departures.map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="font-sans text-sm font-semibold text-navy">
                              {formatDepartureDate(d.departureDate)}
                            </p>
                            <p className="flex items-center gap-1 font-body text-xs text-muted">
                              <Users className="h-3.5 w-3.5" />
                              {typeof d.seatsAvailable === 'number'
                                ? `${d.seatsAvailable} seats left`
                                : 'Seats available'}
                            </p>
                          </div>
                          <span className="shrink-0 font-sans text-sm font-bold text-primary">
                            {formatBDT(d.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 font-body text-sm text-muted">
                      No fixed departures yet — enquire for available dates.
                    </p>
                  )}
                </div>

                {/* Enquiry form */}
                <div className="border-t border-line pt-5">
                  <PackageEnquiry packageId={String(pkg.id)} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}

type InfoItem = {
  key: string
  label: string
  value: string
  Icon: typeof Hotel
}

function buildInfoItems(pkg: Package): InfoItem[] {
  const info = pkg.info ?? {}
  const items: InfoItem[] = []
  if (info.hotelInfo)
    items.push({ key: 'hotel', label: 'Accommodation', value: info.hotelInfo, Icon: Hotel })
  if (info.flightInfo)
    items.push({ key: 'flight', label: 'Flights', value: info.flightInfo, Icon: Plane })
  if (info.foodInfo)
    items.push({ key: 'food', label: 'Meals', value: info.foodInfo, Icon: Utensils })
  if (info.transportInfo)
    items.push({ key: 'transport', label: 'Transport', value: info.transportInfo, Icon: Bus })
  return items
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-bold text-navy">{children}</h2>
}

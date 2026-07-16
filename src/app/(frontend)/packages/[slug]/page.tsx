import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  MapPin, Clock, Check, X, Hotel, Plane, Utensils, Bus, CalendarDays, Users, Star, Coffee,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'
import { PackageTabs } from '@/components/packages/PackageTabs'
import { BookThisTour } from '@/components/packages/BookThisTour'
import { Price } from '@/components/currency/Price'
import { getPackageBySlug, getDeparturesForPackage } from '@/lib/data'
import { packageImage, isIllustration } from '@/lib/images'
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
  return { title, description, openGraph: { title, description, images: [packageImage(pkg)] } }
}

function fmtDate(v: string): string {
  return new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
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
  const accomStar = pkg.tier === 'premium' ? 5 : pkg.tier === 'economy' ? 3 : 4

  const tabs = [
    {
      key: 'information',
      label: 'Information',
      content: (
        <div className="flex flex-col gap-10">
          {pkg.overview ? (
            <div>
              <SectionTitle>Overview</SectionTitle>
              <RichText data={pkg.overview} className="mt-4" />
            </div>
          ) : null}
          {highlights.length ? (
            <div>
              <SectionTitle>Highlights</SectionTitle>
              <div className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <span key={h.id ?? h.label} className="inline-flex items-center rounded-full border border-line bg-primary-50 px-3.5 py-1.5 font-ui text-sm font-medium text-navy">
                    {h.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {infoItems.length ? (
            <div>
              <SectionTitle>What&apos;s Arranged</SectionTitle>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {infoItems.map(({ key, label, value, Icon }) => (
                  <div key={key} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
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
          {included.length || excluded.length ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {included.length ? (
                <div>
                  <SectionTitle>What&apos;s Included</SectionTitle>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {included.map((i) => (
                      <li key={i.id ?? i.item} className="flex items-start gap-2.5 font-body text-sm text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> <span>{i.item}</span>
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
                      <li key={i.id ?? i.item} className="flex items-start gap-2.5 font-body text-sm text-ink/80">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> <span>{i.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Tour Plan',
      content: itinerary.length ? (
        <ol className="flex flex-col gap-6 border-l border-line pl-6">
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
                <p className="mt-1 font-body text-sm leading-relaxed text-muted">{step.description}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-ui text-xs font-medium text-primary-dark">
                  <Star className="h-3 w-3 fill-current" /> {accomStar} Star Accommodation
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 font-ui text-xs font-medium text-muted">
                  <Coffee className="h-3 w-3" /> Breakfast
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="font-body text-sm text-muted">Detailed day-by-day plan available on request.</p>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      content: pkg.destination ? (
        <div className="overflow-hidden rounded-2xl border border-line">
          <iframe
            title={`Map of ${pkg.destination}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(pkg.destination)}&output=embed`}
            className="h-96 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <p className="font-body text-sm text-muted">Location details available on request.</p>
      ),
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy to-navy-2 pt-12 pb-24">
        <Container>
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 font-ui text-xs font-semibold tracking-wide text-white uppercase">
              {CATEGORY_LABEL[pkg.category] ?? pkg.category}
            </span>
            <h1 className="max-w-3xl font-display text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-white/70">
              {pkg.destination ? (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {pkg.destination}</span>
              ) : null}
              {days ? (
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {days} Days{nights ? ` / ${nights} Nights` : ''}</span>
              ) : null}
              {pkg.startLocation ? (
                <span className="flex items-center gap-1.5"><Plane className="h-4 w-4 text-primary" /> From {pkg.startLocation}</span>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <Container className="-mt-16">
        <div className={cn('relative h-64 overflow-hidden rounded-3xl border border-line shadow-xl sm:h-80', illustration ? 'bg-primary-50' : 'bg-surface-2')}>
          <Image src={img} alt={pkg.title} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className={illustration ? 'object-contain p-6' : 'object-cover'} />
        </div>
      </Container>

      {/* Main two-column */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="min-w-0">
              <PackageTabs tabs={tabs} />
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <BookThisTour packageId={String(pkg.id)} slug={slug} basePrice={pkg.basePrice} />

              <div className="mt-6 rounded-3xl border border-line bg-white p-6">
                <p className="flex items-center gap-2 font-sans text-sm font-semibold text-navy">
                  <CalendarDays className="h-4 w-4 text-primary" /> Upcoming Departures
                </p>
                {departures.length ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {departures.map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="font-sans text-sm font-semibold text-navy">{fmtDate(d.departureDate)}</p>
                          <p className="flex items-center gap-1 font-body text-xs text-muted">
                            <Users className="h-3.5 w-3.5" />
                            {typeof d.seatsAvailable === 'number' ? `${d.seatsAvailable} seats left` : 'Seats available'}
                          </p>
                        </div>
                        <span className="shrink-0 font-sans text-sm font-bold text-primary">
                          <Price amountBdt={d.price} />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 font-body text-sm text-muted">No fixed departures yet — enquire for dates.</p>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}

type InfoItem = { key: string; label: string; value: string; Icon: typeof Hotel }

function buildInfoItems(pkg: Package): InfoItem[] {
  const info = pkg.info ?? {}
  const items: InfoItem[] = []
  if (info.hotelInfo) items.push({ key: 'hotel', label: 'Accommodation', value: info.hotelInfo, Icon: Hotel })
  if (info.flightInfo) items.push({ key: 'flight', label: 'Flights', value: info.flightInfo, Icon: Plane })
  if (info.foodInfo) items.push({ key: 'food', label: 'Meals', value: info.foodInfo, Icon: Utensils })
  if (info.transportInfo) items.push({ key: 'transport', label: 'Transport', value: info.transportInfo, Icon: Bus })
  return items
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-bold text-navy">{children}</h2>
}

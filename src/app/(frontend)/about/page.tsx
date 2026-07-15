import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShieldCheck,
  HeartHandshake,
  Compass,
  Headset,
  ArrowRight,
  Star,
  Users,
  Layers,
  Clock,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { getSettings } from '@/lib/data'
import { BRAND } from '@/lib/images'

export const metadata: Metadata = { title: 'About Us' }
export const dynamic = 'force-dynamic'

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    body: 'Honest pricing, clear itineraries and no hidden charges. What we promise at booking is exactly what you receive on your journey.',
  },
  {
    icon: HeartHandshake,
    title: 'Genuine Care',
    body: 'Every pilgrim and traveler is treated like family — from the first enquiry to a safe, blessed return home.',
  },
  {
    icon: Compass,
    title: 'Expert Guidance',
    body: 'Experienced guides and consultants walk you through visa, rituals and logistics so nothing feels overwhelming.',
  },
  {
    icon: Headset,
    title: 'Support That Never Sleeps',
    body: 'A dedicated team stays reachable around the clock, at home and abroad, whenever you need a helping hand.',
  },
]

const SERVICES = [
  {
    key: 'tour',
    tag: 'Tour Packages',
    title: 'Travel & Holidays',
    body: 'Thoughtfully planned tours across Bangladesh and beyond — flights, hotels and sightseeing arranged end to end.',
    image: BRAND.europe,
    illustration: false,
  },
  {
    key: 'hajj',
    tag: 'Hajj Packages',
    title: 'The Sacred Hajj',
    body: 'Complete Hajj arrangements with premium accommodation near the Haram, guided rituals and full logistical support.',
    image: BRAND.kaaba,
    illustration: true,
  },
  {
    key: 'umrah',
    tag: 'Umrah Packages',
    title: 'Blessed Umrah',
    body: 'Year-round Umrah journeys for individuals, couples and families, with visa, flights and hotels handled with care.',
    image: BRAND.madinah,
    illustration: true,
  },
]

export default async function AboutPage() {
  const settings = await getSettings().catch(() => null)
  const companyName = settings?.companyName ?? 'Sajda Travel & Tours Limited'
  const clientsCount = settings?.heroStats?.clientsCount
  const phone = settings?.phones?.[0]?.phone
  const email = settings?.emails?.[0]?.email

  const stats = [
    {
      icon: Users,
      value: clientsCount ? `${clientsCount}+` : '40+',
      label: 'Happy Clients',
    },
    { icon: Layers, value: '3', label: 'Core Services' },
    { icon: ShieldCheck, value: 'Years', label: 'Of Trust & Care' },
    { icon: Clock, value: '24/7', label: 'Traveler Support' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-white to-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <Container className="relative py-14 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <span className="font-ui text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                About Sajda
              </span>
              <h1 className="font-display text-4xl leading-[1.1] font-bold text-navy sm:text-5xl">
                Your trusted partner for Tour, <span className="text-primary">Hajj &amp; Umrah</span>
              </h1>
              <p className="max-w-md font-body text-base text-muted">
                {companyName} is a Bangladesh-based travel agency devoted to making every journey
                smooth, meaningful and worry-free. From holiday tours to the sacred rites of Hajj
                and Umrah, we handle visa, flights, hotels and on-ground guidance so you can travel
                with a calm heart.
              </p>
              <div className="flex items-center gap-2 font-ui text-sm text-muted">
                <span className="flex text-coral">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                Rated 4.9 by pilgrims &amp; travelers
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/packages" variant="primary" size="lg">
                  Browse Packages
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Talk to Us
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 rounded-[2rem] bg-primary-50" />
              <Image
                src={BRAND.madinah}
                alt="Masjid an-Nabawi, Madinah"
                width={640}
                height={720}
                priority
                className="relative h-auto w-full object-contain p-6"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="bg-surface py-14 sm:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-white p-8 text-center"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="font-display text-3xl font-bold text-navy">{s.value}</p>
                <p className="font-ui text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission / Why Choose Sajda */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why Choose Sajda"
            title="Guided by Trust, Driven by Care"
            description="Our mission is simple: to make every tour and pilgrimage safe, affordable and spiritually fulfilling. These values shape everything we do."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 transition hover:border-primary/40 hover:shadow-lg hover:shadow-navy/5"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-navy">{v.title}</h3>
                <p className="font-body text-sm text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Services */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What We Offer"
            title="Three Trusted Services, One Team"
            description="Whether your heart calls you to a new destination or to the House of Allah, we have a package crafted for the journey."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.key}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:shadow-xl hover:shadow-navy/10"
              >
                <div
                  className={`relative h-48 overflow-hidden ${s.illustration ? 'bg-primary-50' : ''}`}
                >
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={`transition duration-500 group-hover:scale-105 ${
                      s.illustration ? 'object-contain p-6' : 'object-cover'
                    }`}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="font-ui text-xs font-semibold tracking-wide text-primary uppercase">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-xl font-bold text-navy">{s.title}</h3>
                  <p className="font-body text-sm text-muted">{s.body}</p>
                  <Link
                    href={`/packages?category=${s.key}`}
                    className="mt-2 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary"
                  >
                    View {s.tag}{' '}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to begin your journey with us?
              </h2>
              <p className="max-w-xl font-body text-white/70">
                Reach out to the {companyName} team and let us craft the right package for you —
                from a relaxing holiday to a lifetime pilgrimage.
                {phone ? ` Call us at ${phone}` : ''}
                {phone && email ? ' or email ' : email ? ' Email us at ' : ''}
                {email ?? ''}
                {phone || email ? '.' : ''}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/contact" variant="white" size="lg">
                  Contact Us
                </Button>
                <Button href="/packages" variant="primary" size="lg">
                  Browse Packages
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

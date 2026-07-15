import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BRAND } from '@/lib/images'

const CATEGORIES = [
  {
    key: 'tour',
    title: 'Explore Bangladesh & Beyond',
    tag: 'Tour Packages',
    body: "Curated travel across Bangladesh's most breathtaking destinations — mangroves, hills, sea and more.",
    image: BRAND.europe,
    illustration: false,
  },
  {
    key: 'hajj',
    title: 'The Sacred Fifth Pillar',
    tag: 'Hajj Packages',
    body: 'Complete Hajj arrangements with premium accommodation, guided rituals and dedicated support.',
    image: BRAND.kaaba,
    illustration: true,
  },
  {
    key: 'umrah',
    title: 'A Blessed Spiritual Journey',
    tag: 'Umrah Packages',
    body: 'Year-round Umrah packages for individuals, couples and families with full logistical support.',
    image: BRAND.madinah,
    illustration: true,
  },
]

export function Categories() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Choose Your Journey"
          title="Three Distinct Paths, One Trusted Partner"
          description="Select the journey that calls to your heart."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/packages?category=${c.key}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:shadow-xl hover:shadow-navy/10"
            >
              <div className={`relative h-56 overflow-hidden ${c.illustration ? 'bg-primary-50' : ''}`}>
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className={`transition duration-500 group-hover:scale-105 ${c.illustration ? 'object-contain p-6' : 'object-cover'}`}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="font-ui text-xs font-semibold tracking-wide text-primary uppercase">
                  {c.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-navy">{c.title}</h3>
                <p className="font-body text-sm text-muted">{c.body}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary">
                  View Packages <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

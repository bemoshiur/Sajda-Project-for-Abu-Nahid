import { Star, Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Review } from '@/payload-types'

export function Testimonials({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Clients Say About Us"
          description="Real experiences from pilgrims and travelers who journeyed with Sajda."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure
              key={r.id}
              className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <blockquote className="flex-1 font-body text-sm leading-relaxed text-ink/80">
                “{r.body}”
              </blockquote>
              <div className="flex text-coral">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-sans text-sm font-bold text-white">
                  {r.authorName.charAt(0)}
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-navy">{r.authorName}</p>
                  {r.title ? <p className="font-body text-xs text-muted">{r.title}</p> : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}

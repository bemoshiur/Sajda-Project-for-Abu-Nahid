import { Compass, Plane, Sparkles, HeartPulse } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

const SERVICES = [
  { icon: Compass, title: 'Guided Tours', body: 'Explore beautiful destinations with trusted guides and a smooth travel experience.' },
  { icon: Plane, title: 'Best Flight Options', body: 'Get the best flight options for a comfortable and reliable travel experience.' },
  { icon: Sparkles, title: 'Hajj & Umrah', body: 'Perform Hajj and Umrah with comfort, care and complete confidence.' },
  { icon: HeartPulse, title: 'Medical Insurance', body: 'Enjoy worry-free travel with proper health and medical protection.' },
]

export function Services() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="We Offer the Best Services"
          description="Everything you need for a smooth, meaningful journey — handled by an experienced team."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 transition hover:border-primary/40 hover:shadow-lg hover:shadow-navy/5"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold text-navy">{s.title}</h3>
              <p className="font-body text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

import Image from 'next/image'
import { MapPinned, ShieldCheck, CalendarCheck, Headset } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BRAND } from '@/lib/images'

const REASONS = [
  { icon: MapPinned, title: 'Choose Destination', body: 'Choose your destination and begin a smooth journey with confidence.' },
  { icon: ShieldCheck, title: 'Plan with Trust', body: 'Transparent packages and honest guidance every step of the way.' },
  { icon: CalendarCheck, title: 'Check Availability', body: 'Confirm package availability before you commit to your journey.' },
  { icon: Headset, title: 'Travel with Peace', body: 'Dedicated support so you can focus on the experience, not the logistics.' },
]

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-[2rem] bg-primary-50" />
            <Image
              src={BRAND.madinah}
              alt="Masjid an-Nabawi, Madinah"
              width={640}
              height={720}
              className="relative h-auto w-full object-contain p-4"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Choose Sajda"
              title="Plan with Trust, Travel with Peace"
              description="From visa to ziyarah, we handle every detail so your journey stays smooth and meaningful."
              align="left"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {REASONS.map((r) => (
                <div key={r.title} className="flex gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-navy">{r.title}</h3>
                    <p className="mt-1 font-body text-sm text-muted">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

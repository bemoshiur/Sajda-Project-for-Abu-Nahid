import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from '@/components/contact/ContactForm'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Sajda Travel & Tours — call, email, WhatsApp or visit us to plan your Tour, Hajj or Umrah journey.',
}

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-ui text-xs font-semibold tracking-wide text-muted-2 uppercase">
          {label}
        </span>
        <div className="flex flex-col gap-0.5 font-body text-sm text-navy">{children}</div>
      </div>
    </div>
  )
}

export default async function ContactPage() {
  const settings = await getSettings().catch(() => null)

  const phones = (settings?.phones ?? [])
    .map((p) => p.phone)
    .filter((p): p is string => Boolean(p))
  const emails = (settings?.emails ?? [])
    .map((e) => e.email)
    .filter((e): e is string => Boolean(e))
  const whatsapp = settings?.whatsapp
  const address = settings?.address
  const businessHours = settings?.businessHours
  const mapEmbed = settings?.googleMapEmbed

  return (
    <section className="bg-gradient-to-b from-primary-50/50 via-white to-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact Sajda Travel & Tours"
          description="Have a question about a package or ready to plan your journey? Reach out and our team will get back to you shortly."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* LEFT — contact info */}
          <div className="flex flex-col gap-4">
            {phones.length ? (
              <InfoCard icon={<Phone className="h-5 w-5" />} label="Call us">
                {phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="font-sans font-semibold text-navy transition-colors hover:text-primary"
                  >
                    {phone}
                  </a>
                ))}
              </InfoCard>
            ) : null}

            {emails.length ? (
              <InfoCard icon={<Mail className="h-5 w-5" />} label="Email us">
                {emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="break-all font-sans font-semibold text-navy transition-colors hover:text-primary"
                  >
                    {email}
                  </a>
                ))}
              </InfoCard>
            ) : null}

            {whatsapp ? (
              <InfoCard icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-navy transition-colors hover:text-primary"
                >
                  {whatsapp}
                </a>
              </InfoCard>
            ) : null}

            {address ? (
              <InfoCard icon={<MapPin className="h-5 w-5" />} label="Visit us">
                <p className="whitespace-pre-line text-muted">{address}</p>
              </InfoCard>
            ) : null}

            {businessHours ? (
              <InfoCard icon={<Clock className="h-5 w-5" />} label="Business hours">
                <p className="whitespace-pre-line text-muted">{businessHours}</p>
              </InfoCard>
            ) : null}

            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                title="Sajda Travel & Tours location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full rounded-2xl border-0"
              />
            ) : null}
          </div>

          {/* RIGHT — enquiry form */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm shadow-navy/5 sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="font-display text-2xl font-bold text-navy">Send us a message</h2>
              <p className="font-body text-sm text-muted">
                Fill in the form and we&apos;ll get back to you as soon as we can.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

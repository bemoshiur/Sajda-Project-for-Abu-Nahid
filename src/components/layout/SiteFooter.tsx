import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons'
import { NewsletterForm } from './NewsletterForm'
import { getSettings } from '@/lib/data'

export async function SiteFooter() {
  const settings = await getSettings().catch(() => null)
  const phone = settings?.phones?.[0]?.phone
  const email = settings?.emails?.[0]?.email
  const social = settings?.socialLinks

  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div className="flex flex-col gap-5">
          <Logo dark />
          <p className="max-w-xs font-body text-sm text-white/60">
            Book your Tour, Hajj or Umrah pilgrimage with trusted services &amp; packages.
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            {phone ? (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {phone}
              </span>
            ) : null}
            {email ? (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> {email}
              </span>
            ) : null}
            {settings?.address ? (
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.address}
              </span>
            ) : null}
          </div>
          <div className="flex gap-3">
            {social?.facebook ? (
              <SocialIcon href={social.facebook}>
                <FacebookIcon className="h-4 w-4" />
              </SocialIcon>
            ) : null}
            {social?.instagram ? (
              <SocialIcon href={social.instagram}>
                <InstagramIcon className="h-4 w-4" />
              </SocialIcon>
            ) : null}
            {social?.youtube ? (
              <SocialIcon href={social.youtube}>
                <YoutubeIcon className="h-4 w-4" />
              </SocialIcon>
            ) : null}
          </div>
        </div>

        <FooterCol
          title="Company"
          links={[
            { label: 'Tour Package', href: '/packages?category=tour' },
            { label: 'Hajj Package', href: '/packages?category=hajj' },
            { label: 'Umrah Package', href: '/packages?category=umrah' },
            { label: 'Blog', href: '/blog' },
          ]}
        />
        <FooterCol
          title="Explore"
          links={[
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Sign in', href: '/login' },
            { label: 'My Dashboard', href: '/dashboard' },
          ]}
        />

        <div className="flex flex-col gap-4">
          <h4 className="font-sans text-sm font-semibold tracking-wide text-white">
            Join Our Newsletter
          </h4>
          <NewsletterForm />
          <p className="font-body text-xs text-white/45">
            * We&apos;ll send you weekly updates for better tour packages.
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <span>Copyright © {settings?.companyName ?? 'Sajda'} 2026. All Rights Reserved.</span>
          <span>Tour · Hajj · Umrah</span>
        </Container>
      </div>
    </footer>
  )
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-primary"
    >
      {children}
    </a>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-sans text-sm font-semibold tracking-wide text-white">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="font-body text-sm text-white/60 transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

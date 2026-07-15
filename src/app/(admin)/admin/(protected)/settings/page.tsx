import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel } from '@/components/dashboard/ui'
import type { Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

const CMS_SETTINGS_URL = '/cms/globals/settings'

function EditInCms() {
  return (
    <a
      href={CMS_SETTINGS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary/90"
    >
      <ExternalLink className="h-4 w-4" />
      Edit in CMS
    </a>
  )
}

function isEmptyValue(v: ReactNode): boolean {
  return v === null || v === undefined || v === ''
}

function DefRow({ label, value }: { label: string; value: ReactNode }) {
  const empty = isEmptyValue(value)
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr] sm:items-baseline sm:gap-4">
      <dt className="font-ui text-xs font-medium tracking-wide text-muted-2 uppercase">{label}</dt>
      <dd className={empty ? 'font-body text-sm text-muted-2' : 'font-body text-sm text-navy'}>
        {empty ? '—' : value}
      </dd>
    </div>
  )
}

function ExternalLinkValue({ href }: { href?: string | null }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
    >
      <span className="break-all">{href}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  )
}

export default async function SettingsPage() {
  const payload = await adminClient()
  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting

  const phones = (settings.phones ?? [])
    .map((p) => p?.phone)
    .filter((v): v is string => Boolean(v))
  const emails = (settings.emails ?? [])
    .map((e) => e?.email)
    .filter((v): v is string => Boolean(v))
  const social = settings.socialLinks ?? {}
  const socialEntries: { label: string; href?: string | null }[] = [
    { label: 'Facebook', href: social.facebook },
    { label: 'Instagram', href: social.instagram },
    { label: 'YouTube', href: social.youtube },
    { label: 'Twitter / X', href: social.twitter },
    { label: 'LinkedIn', href: social.linkedin },
  ]
  const hasSocial = socialEntries.some((s) => Boolean(s.href))

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Company" action={<EditInCms />}>
        <dl className="divide-y divide-line">
          <DefRow label="Company name" value={settings.companyName} />
          <DefRow label="Tagline" value={settings.tagline} />
          <DefRow
            label="Address"
            value={settings.address ? <span className="whitespace-pre-line">{settings.address}</span> : null}
          />
          <DefRow
            label="Business hours"
            value={
              settings.businessHours ? (
                <span className="whitespace-pre-line">{settings.businessHours}</span>
              ) : null
            }
          />
        </dl>
      </Panel>

      <Panel title="Contact" action={<EditInCms />}>
        <dl className="divide-y divide-line">
          <DefRow
            label="Phones"
            value={
              phones.length ? (
                <div className="flex flex-col gap-1">
                  {phones.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              ) : null
            }
          />
          <DefRow
            label="Emails"
            value={
              emails.length ? (
                <div className="flex flex-col gap-1">
                  {emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="font-semibold text-primary hover:underline">
                      {e}
                    </a>
                  ))}
                </div>
              ) : null
            }
          />
          <DefRow label="WhatsApp" value={settings.whatsapp} />
          <DefRow
            label="Social links"
            value={
              hasSocial ? (
                <div className="flex flex-col gap-2">
                  {socialEntries
                    .filter((s) => Boolean(s.href))
                    .map((s) => (
                      <div key={s.label} className="flex flex-wrap items-baseline gap-2">
                        <span className="font-ui text-xs font-medium tracking-wide text-muted-2 uppercase">
                          {s.label}
                        </span>
                        <ExternalLinkValue href={s.href} />
                      </div>
                    ))}
                </div>
              ) : null
            }
          />
        </dl>
      </Panel>

      <Panel title="Invoicing & Currency" action={<EditInCms />}>
        <dl className="divide-y divide-line">
          <DefRow label="Invoice prefix" value={settings.invoicePrefix} />
          <DefRow label="Base currency" value={settings.baseCurrency} />
          <DefRow
            label="USD rate"
            value={
              typeof settings.usdRate === 'number'
                ? `1 USD = ${settings.usdRate} BDT`
                : null
            }
          />
          <DefRow
            label="Invoice footer note"
            value={
              settings.invoiceFooterNote ? (
                <span className="whitespace-pre-line">{settings.invoiceFooterNote}</span>
              ) : null
            }
          />
        </dl>
      </Panel>
    </div>
  )
}

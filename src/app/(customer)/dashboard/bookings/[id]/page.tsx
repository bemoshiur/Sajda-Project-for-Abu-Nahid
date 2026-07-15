import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, XCircle, Download, ArrowLeft, Users, CalendarDays } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getCurrentCustomer } from '@/lib/auth'
import { getBookingForCustomer } from '@/lib/customer-data'
import { Panel, StatusBadge } from '@/components/dashboard/ui'
import { isStripeConfigured } from '@/lib/stripe'
import { retryBookingCheckout } from '@/app/actions/booking'
import { formatBDT } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}
function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : 'Package'
}

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; canceled?: string; requested?: string }>
}) {
  const customer = await getCurrentCustomer()
  if (!customer) return null
  const [{ id }, sp] = await Promise.all([params, searchParams])

  const booking = await getBookingForCustomer(id, customer.id)
  if (!booking) notFound()

  const payload = await getPayload({ config: await config })
  const invRes = await payload.find({
    collection: 'invoices',
    where: { booking: { equals: booking.id } },
    limit: 1,
  })
  const invoice = invRes.docs[0]

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard/bookings" className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </Link>

      {sp.success ? (
        <Banner tone="success" icon={CheckCircle2} title="Payment successful" body="Your booking is confirmed. Thank you for travelling with Sajda." />
      ) : null}
      {sp.requested ? (
        <Banner tone="info" icon={Clock} title="Booking requested" body="We've received your request. Our team will contact you shortly to confirm and arrange payment." />
      ) : null}
      {sp.canceled ? (
        <Banner tone="warn" icon={XCircle} title="Payment canceled" body="Your booking is saved as pending. You can complete payment anytime." />
      ) : null}

      <Panel title={pkgTitle(booking.package)}>
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Cell label="Booking #" value={booking.bookingNumber ?? '—'} />
          <Cell label="Travelers" value={String(booking.travelersCount ?? 1)} icon={Users} />
          <Cell label="Booked on" value={fmtDate(booking.createdAt)} icon={CalendarDays} />
          <Cell label="Total" value={formatBDT(booking.total ?? 0)} />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-6 py-4">
          <span className="font-ui text-sm text-muted">Status</span>
          <StatusBadge status={booking.status} />
          <span className="font-ui text-sm text-muted">Payment</span>
          <StatusBadge status={booking.paymentStatus} />
        </div>
        {booking.notes ? (
          <div className="border-t border-line px-6 py-4">
            <p className="font-ui text-xs tracking-wide text-muted-2 uppercase">Notes</p>
            <p className="mt-1 font-body text-sm text-navy">{booking.notes}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-line px-6 py-4">
          {invoice ? (
            <a
              href={`/api/invoices/${invoice.id}/pdf`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 font-sans text-sm font-semibold text-navy hover:border-primary hover:text-primary"
            >
              <Download className="h-4 w-4" /> Download invoice
            </a>
          ) : null}
          {booking.paymentStatus !== 'paid' && isStripeConfigured() ? (
            <form action={retryBookingCheckout.bind(null, String(booking.id))}>
              <button className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 font-sans text-sm font-semibold text-white hover:bg-primary-dark">
                Complete payment
              </button>
            </form>
          ) : null}
        </div>
      </Panel>
    </div>
  )
}

function Cell({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Users }) {
  return (
    <div className="bg-white px-6 py-4">
      <p className="font-ui text-xs tracking-wide text-muted-2 uppercase">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 font-sans text-sm font-semibold text-navy">
        {Icon ? <Icon className="h-4 w-4 text-primary" /> : null} {value}
      </p>
    </div>
  )
}

function Banner({ tone, icon: Icon, title, body }: { tone: 'success' | 'info' | 'warn'; icon: typeof CheckCircle2; title: string; body: string }) {
  const tones = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
  }
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${tones[tone]}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-sans text-sm font-semibold">{title}</p>
        <p className="font-body text-sm opacity-90">{body}</p>
      </div>
    </div>
  )
}

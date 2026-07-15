import Link from 'next/link'
import { PhoneCall, ShoppingBag, Users2, Wallet, Package, Star, ArrowRight } from 'lucide-react'
import { getAdminStats, getRevenueSeries, getRecent } from '@/lib/admin-data'
import { StatCard, Panel, StatusBadge } from '@/components/dashboard/ui'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { formatBDT } from '@/lib/currency'
import type { Booking, Enquiry } from '@/payload-types'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—'
}
function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : '—'
}

export default async function AdminDashboard() {
  const [stats, series, enquiries, bookings] = await Promise.all([
    getAdminStats(),
    getRevenueSeries(),
    getRecent<Enquiry>('enquiries', { limit: 6 }),
    getRecent<Booking>('bookings', { limit: 6, depth: 1 }),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatBDT(stats.revenue)} icon={Wallet} accent="green" />
        <StatCard label="Bookings" value={stats.bookings} icon={ShoppingBag} accent="primary" />
        <StatCard label="Enquiries" value={stats.enquiries} icon={PhoneCall} accent="coral" />
        <StatCard label="Customers" value={stats.customers} icon={Users2} accent="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Revenue (last 6 months)">
          <div className="p-5">
            <RevenueChart data={series} />
          </div>
        </Panel>
        <Panel title="At a glance">
          <div className="grid grid-cols-2 gap-px bg-line">
            <MiniStat label="New Enquiries" value={stats.newEnquiries} icon={PhoneCall} href="/admin/enquiries" />
            <MiniStat label="Pending Reviews" value={stats.pendingReviews} icon={Star} href="/admin/reviews" />
            <MiniStat label="Packages" value={stats.packages} icon={Package} href="/admin/products" />
            <MiniStat label="Invoices" value={stats.invoices} icon={Wallet} href="/admin/orders" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent Enquiries"
          action={<Link href="/admin/enquiries" className="font-sans text-sm font-semibold text-primary hover:underline">View all</Link>}
        >
          <div className="divide-y divide-line">
            {enquiries.length === 0 ? (
              <p className="px-6 py-8 text-center font-body text-sm text-muted">No enquiries yet.</p>
            ) : (
              enquiries.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <div>
                    <p className="font-sans text-sm font-semibold text-navy">{e.name}</p>
                    <p className="font-ui text-xs text-muted-2">{e.phone} · {fmtDate(e.createdAt)}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Recent Orders"
          action={<Link href="/admin/orders" className="font-sans text-sm font-semibold text-primary hover:underline">View all</Link>}
        >
          <div className="divide-y divide-line">
            {bookings.length === 0 ? (
              <p className="px-6 py-8 text-center font-body text-sm text-muted">No orders yet.</p>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <div>
                    <p className="font-sans text-sm font-semibold text-navy">{pkgTitle(b.package)}</p>
                    <p className="font-ui text-xs text-muted-2">{b.bookingNumber} · {formatBDT(b.total ?? 0)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function MiniStat({ label, value, icon: Icon, href }: { label: string; value: number; icon: typeof PhoneCall; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between bg-white px-5 py-4 transition hover:bg-surface">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <p className="font-display text-xl font-bold text-navy">{value}</p>
          <p className="font-ui text-xs text-muted-2">{label}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-2" />
    </Link>
  )
}

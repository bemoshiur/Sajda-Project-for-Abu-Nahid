import Link from 'next/link'
import { Briefcase, FileText, Plane, Wallet, Compass } from 'lucide-react'
import { getCurrentCustomer } from '@/lib/auth'
import { getCustomerBookings, getCustomerInvoices } from '@/lib/customer-data'
import { StatCard, StatusBadge, Panel, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/Button'
import { formatBDT } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : 'Package'
}

export default async function DashboardOverview() {
  const customer = await getCurrentCustomer()
  if (!customer) return null

  const [bookings, invoices] = await Promise.all([
    getCustomerBookings(customer.id),
    getCustomerInvoices(customer.id),
  ])

  const upcoming = bookings.filter((b) => ['confirmed', 'paid'].includes(b.status ?? '')).length
  const totalSpent = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total ?? 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={bookings.length} icon={Briefcase} accent="primary" />
        <StatCard label="Upcoming Trips" value={upcoming} icon={Plane} accent="navy" />
        <StatCard label="Invoices" value={invoices.length} icon={FileText} accent="coral" />
        <StatCard label="Total Paid" value={formatBDT(totalSpent)} icon={Wallet} accent="green" />
      </div>

      <Panel
        title="Recent Bookings"
        action={
          <Link href="/dashboard/bookings" className="font-sans text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        }
      >
        {bookings.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No bookings yet"
              body="Browse our Tour, Hajj and Umrah packages and book your first journey."
              icon={Compass}
              action={
                <Button href="/packages" size="sm" className="mt-2">
                  Browse Packages
                </Button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-line">
            {bookings.slice(0, 5).map((b) => (
              <Link
                key={b.id}
                href={`/dashboard/bookings/${b.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-surface"
              >
                <div>
                  <p className="font-sans text-sm font-semibold text-navy">{pkgTitle(b.package)}</p>
                  <p className="font-ui text-xs text-muted-2">{b.bookingNumber}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden font-sans text-sm font-semibold text-navy sm:block">
                    {formatBDT(b.total ?? 0)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

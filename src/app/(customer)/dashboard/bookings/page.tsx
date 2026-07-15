import Link from 'next/link'
import { Compass } from 'lucide-react'
import { getCurrentCustomer } from '@/lib/auth'
import { getCustomerBookings } from '@/lib/customer-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/Button'
import { formatBDT } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : 'Package'
}
function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

export default async function BookingsPage() {
  const customer = await getCurrentCustomer()
  if (!customer) return null
  const bookings = await getCustomerBookings(customer.id)

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        body="When you book a Tour, Hajj or Umrah package, it will appear here."
        icon={Compass}
        action={
          <Button href="/packages" size="sm" className="mt-2">
            Browse Packages
          </Button>
        }
      />
    )
  }

  return (
    <Panel title="My Bookings">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
              <th className="px-6 py-3 font-medium">Booking</th>
              <th className="px-6 py-3 font-medium">Package</th>
              <th className="px-6 py-3 font-medium">Booked</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {bookings.map((b) => (
              <tr key={b.id} className="transition hover:bg-surface">
                <td className="px-6 py-4">
                  <Link href={`/dashboard/bookings/${b.id}`} className="font-sans text-sm font-semibold text-primary hover:underline">
                    {b.bookingNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 font-body text-sm text-navy">{pkgTitle(b.package)}</td>
                <td className="px-6 py-4 font-body text-sm text-muted">{fmtDate(b.createdAt)}</td>
                <td className="px-6 py-4 font-sans text-sm font-semibold text-navy">{formatBDT(b.total ?? 0)}</td>
                <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

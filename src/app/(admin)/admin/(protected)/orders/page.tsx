import { ShoppingBag } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { StatusSelect } from '@/components/admin/controls'
import { updateBookingStatus, adminMarkBookingPaid } from '@/app/actions/admin'
import { formatBDT } from '@/lib/currency'
import type { Booking } from '@/payload-types'

export const dynamic = 'force-dynamic'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'refunded', label: 'Refunded' },
]

function customerName(c: unknown): string {
  return c && typeof c === 'object' && 'name' in c ? String((c as { name: string }).name) : '—'
}
function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : '—'
}

export default async function OrdersPage() {
  const payload = await adminClient()
  const res = await payload.find({ collection: 'bookings', limit: 100, sort: '-createdAt', depth: 1 })
  const bookings = res.docs as Booking[]

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Orders">
        {bookings.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No orders yet"
              body="Bookings placed by customers will appear here."
              icon={ShoppingBag}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Booking #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Travelers</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-body text-sm font-semibold text-navy">{b.bookingNumber ?? '—'}</td>
                    <td className="px-6 py-4 font-body text-sm">{customerName(b.customer)}</td>
                    <td className="px-6 py-4 font-body text-sm">{pkgTitle(b.package)}</td>
                    <td className="px-6 py-4 font-body text-sm">{b.travelersCount ?? 0}</td>
                    <td className="px-6 py-4 font-body text-sm">{formatBDT(b.total ?? 0)}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={b.paymentStatus} />
                        {b.paymentStatus !== 'paid' ? (
                          <form action={adminMarkBookingPaid.bind(null, String(b.id))}>
                            <button
                              type="submit"
                              className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 font-ui text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                            >
                              Mark paid
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <StatusSelect
                        id={String(b.id)}
                        value={b.status}
                        options={STATUS_OPTIONS}
                        action={updateBookingStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

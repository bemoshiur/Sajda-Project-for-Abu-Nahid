import { Boxes, Plus } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { formatBDT } from '@/lib/currency'
import type { Departure } from '@/payload-types'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

function pkgTitle(p: Departure['package']): string {
  return p && typeof p === 'object' && 'title' in p ? String(p.title) : '—'
}

const addPill = (
  <a
    href="/cms/collections/departures/create"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
  >
    <Plus className="h-4 w-4" />
    Add departure
  </a>
)

export default async function InventoryPage() {
  const payload = await adminClient()
  const res = await payload.find({
    collection: 'departures',
    depth: 1,
    limit: 200,
    sort: 'departureDate',
  })
  const rows = res.docs as Departure[]

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Inventory" action={addPill}>
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No departures yet"
              body="Add scheduled departures to manage seats, pricing and availability for your packages."
              icon={Boxes}
              action={addPill}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Departure</th>
                  <th className="px-6 py-3 font-medium">Return</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Seats</th>
                  <th className="px-6 py-3 font-medium">Available</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((d) => {
                  const total = d.seatsTotal ?? 0
                  const booked = d.seatsBooked ?? 0
                  const available = Math.max(total - booked, 0)
                  const pct = total > 0 ? Math.min(Math.round((booked / total) * 100), 100) : 0
                  return (
                    <tr key={d.id}>
                      <td className="px-6 py-4 font-body text-sm">
                        <a
                          href={`/cms/collections/departures/${d.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans font-semibold text-navy hover:text-primary hover:underline"
                        >
                          {pkgTitle(d.package)}
                        </a>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-navy">{fmtDate(d.departureDate)}</td>
                      <td className="px-6 py-4 font-body text-sm text-muted">{fmtDate(d.returnDate)}</td>
                      <td className="px-6 py-4 font-body text-sm font-semibold text-navy">{formatBDT(d.price ?? 0)}</td>
                      <td className="px-6 py-4 font-body text-sm">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-ui text-xs font-semibold text-muted-2">
                            {booked}/{total}
                          </span>
                          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                            <span
                              className="block h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm font-semibold text-navy">{available}</td>
                      <td className="px-6 py-4 font-body text-sm">
                        <StatusBadge status={d.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

import { PhoneCall } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel, EmptyState } from '@/components/dashboard/ui'
import { StatusSelect } from '@/components/admin/controls'
import { updateEnquiryStatus } from '@/app/actions/admin'
import type { Enquiry } from '@/payload-types'

export const dynamic = 'force-dynamic'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function fmtDate(v?: string | null): string {
  return v
    ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
}

function pkgTitle(p: unknown): string | null {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : null
}

export default async function EnquiriesPage() {
  const payload = await adminClient()
  const res = await payload.find({
    collection: 'enquiries',
    limit: 100,
    sort: '-createdAt',
    depth: 1,
  })
  const rows = res.docs as Enquiry[]

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Call List / Enquiries">
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No enquiries yet"
              body="Incoming call-list enquiries from the website and contact forms will appear here."
              icon={PhoneCall}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Interest</th>
                  <th className="px-6 py-3 font-medium">Message</th>
                  <th className="px-6 py-3 font-medium">Received</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((e) => {
                  const category = e.interestedCategory ?? null
                  const pkg = pkgTitle(e.package)
                  return (
                    <tr key={e.id}>
                      <td className="px-6 py-4 font-body text-sm">
                        <span className="font-sans font-semibold text-navy">{e.name}</span>
                      </td>
                      <td className="px-6 py-4 font-body text-sm">
                        <div className="flex flex-col">
                          <span className="text-navy">{e.phone}</span>
                          {e.email ? <span className="font-ui text-xs text-muted-2">{e.email}</span> : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm">
                        {category || pkg ? (
                          <div className="flex flex-col">
                            {category ? <span className="text-navy capitalize">{category}</span> : null}
                            {pkg ? <span className="font-ui text-xs text-muted-2">{pkg}</span> : null}
                          </div>
                        ) : (
                          <span className="text-muted-2">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body text-sm">
                        {e.message ? (
                          <p className="line-clamp-2 max-w-xs text-muted">{e.message}</p>
                        ) : (
                          <span className="text-muted-2">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body text-sm whitespace-nowrap text-muted">
                        {fmtDate(e.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-body text-sm">
                        <StatusSelect
                          id={String(e.id)}
                          value={e.status}
                          options={STATUS_OPTIONS}
                          action={updateEnquiryStatus}
                        />
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

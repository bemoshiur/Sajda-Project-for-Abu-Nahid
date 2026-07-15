import { Users2 } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { StatCard, Panel, EmptyState } from '@/components/dashboard/ui'
import type { Customer } from '@/payload-types'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v
    ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
}

export default async function CustomersPage() {
  const payload = await adminClient()
  const res = await payload.find({
    collection: 'customers',
    depth: 0,
    limit: 100,
    sort: '-createdAt',
  })
  const customers = res.docs as Customer[]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customers" value={res.totalDocs} icon={Users2} accent="navy" />
      </div>

      <Panel title="Customers">
        {customers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No customers yet"
              body="Customers who register or book will appear here."
              icon={Users2}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">City</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-body text-sm font-semibold text-navy">{c.name}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{c.email}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{c.phone || '—'}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{c.address?.city || '—'}</td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{fmtDate(c.createdAt)}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <a
                        href={`/cms/collections/customers/${c.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-semibold text-primary hover:underline"
                      >
                        View
                      </a>
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

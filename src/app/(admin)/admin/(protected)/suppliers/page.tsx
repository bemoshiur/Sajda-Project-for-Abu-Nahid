import { Plus, Star, Truck } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import type { Supplier } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function SuppliersPage() {
  const payload = await adminClient()
  const res = await payload.find({
    collection: 'suppliers',
    limit: 100,
    sort: '-createdAt',
    depth: 0,
  })
  const suppliers = res.docs as Supplier[]

  const addAction = (
    <a
      href="/cms/collections/suppliers/create"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
    >
      <Plus className="h-4 w-4" />
      Add supplier
    </a>
  )

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Suppliers" action={addAction}>
        {suppliers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No suppliers yet"
              body="Add hotels, airlines, transport, and visa partners to keep supplier details in one place."
              icon={Truck}
              action={addAction}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {suppliers.map((s) => (
                  <tr key={s.id} className="font-body text-sm">
                    <td className="px-6 py-4">
                      <a
                        href={`/cms/collections/suppliers/${s.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-semibold text-navy hover:text-primary hover:underline"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-1 font-ui text-xs font-medium text-navy capitalize">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-navy">{s.contactPerson || '—'}</td>
                    <td className="px-6 py-4 text-navy">{s.phone || '—'}</td>
                    <td className="px-6 py-4 text-navy">{s.email || '—'}</td>
                    <td className="px-6 py-4">
                      {typeof s.rating === 'number' ? (
                        <span className="inline-flex items-center gap-1 font-sans font-semibold text-navy">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {s.rating}
                        </span>
                      ) : (
                        <span className="text-muted-2">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
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

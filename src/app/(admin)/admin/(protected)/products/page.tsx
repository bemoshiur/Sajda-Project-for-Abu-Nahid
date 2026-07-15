import { Package, Plus, Star } from 'lucide-react'
import { adminClient } from '@/lib/admin-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { formatBDT } from '@/lib/currency'
import type { Package as PackageType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const payload = await adminClient()
  const res = await payload.find({
    collection: 'packages',
    depth: 0,
    limit: 100,
    sort: '-createdAt',
  })
  const packages = res.docs as PackageType[]

  const newButton = (
    <a
      href="/cms/collections/packages/create"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary/90"
    >
      <Plus className="h-4 w-4" />
      New package
    </a>
  )

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Products" action={newButton}>
        {packages.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Package}
              title="No products yet"
              body="Create your first package to start selling tours, Hajj and Umrah trips."
              action={newButton}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Featured</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {packages.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 font-body text-sm font-semibold text-navy">{p.title}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-1 font-ui text-xs font-semibold text-navy capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-navy">{formatBDT(p.basePrice ?? 0)}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <Star
                        className={
                          p.featured
                            ? 'h-4 w-4 fill-amber-400 text-amber-400'
                            : 'h-4 w-4 text-muted-2'
                        }
                      />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <a
                        href={`/cms/collections/packages/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm font-semibold text-primary hover:underline"
                      >
                        Edit
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

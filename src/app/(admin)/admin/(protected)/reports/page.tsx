import { Wallet, ShoppingBag, Users2, Package as PackageIcon, BarChart3 } from 'lucide-react'
import { adminClient, getAdminStats, getRevenueSeries } from '@/lib/admin-data'
import { StatCard, Panel, EmptyState } from '@/components/dashboard/ui'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { formatBDT } from '@/lib/currency'
import type { Booking, Package } from '@/payload-types'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER = ['tour', 'hajj', 'umrah'] as const
const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  tour: 'Tours',
  hajj: 'Hajj',
  umrah: 'Umrah',
}

function bookingPackage(b: Booking): Package | null {
  return b.package && typeof b.package === 'object' && 'title' in b.package ? (b.package as Package) : null
}

export default async function ReportsPage() {
  const payload = await adminClient()
  const [stats, series, bookingsRes] = await Promise.all([
    getAdminStats(),
    getRevenueSeries(),
    payload.find({ collection: 'bookings', limit: 1000, sort: '-createdAt', depth: 1 }),
  ])
  const bookings = bookingsRes.docs as Booking[]

  // (c) Bookings grouped by package category
  const categoryCounts: Record<(typeof CATEGORY_ORDER)[number], number> = { tour: 0, hajj: 0, umrah: 0 }
  // (d) Bookings grouped by package title
  const titleCounts = new Map<string, number>()

  for (const b of bookings) {
    const pkg = bookingPackage(b)
    if (!pkg) continue
    if (pkg.category && pkg.category in categoryCounts) {
      categoryCounts[pkg.category as (typeof CATEGORY_ORDER)[number]] += 1
    }
    if (pkg.title) {
      titleCounts.set(pkg.title, (titleCounts.get(pkg.title) ?? 0) + 1)
    }
  }

  const maxCategory = Math.max(1, ...CATEGORY_ORDER.map((c) => categoryCounts[c]))
  const categorised = CATEGORY_ORDER.reduce((s, c) => s + categoryCounts[c], 0)

  const topPackages = [...titleCounts.entries()]
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const maxTop = Math.max(1, ...topPackages.map((t) => t.count))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatBDT(stats.revenue)} icon={Wallet} accent="green" />
        <StatCard label="Bookings" value={stats.bookings} icon={ShoppingBag} accent="primary" />
        <StatCard label="Customers" value={stats.customers} icon={Users2} accent="navy" />
        <StatCard label="Packages" value={stats.packages} icon={PackageIcon} accent="coral" />
      </div>

      <Panel title="Revenue (last 6 months)">
        <div className="p-5">
          <RevenueChart data={series} />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Bookings by Category">
          {categorised === 0 ? (
            <div className="p-6">
              <EmptyState title="No bookings yet" body="Category performance appears once bookings come in." icon={BarChart3} />
            </div>
          ) : (
            <div className="flex flex-col gap-5 p-6">
              {CATEGORY_ORDER.map((cat) => {
                const count = categoryCounts[cat]
                const pct = Math.round((count / maxCategory) * 100)
                return (
                  <div key={cat}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-sans text-sm font-semibold text-navy">{CATEGORY_LABELS[cat]}</span>
                      <span className="font-ui text-xs font-semibold text-muted-2">{count}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        <Panel title="Top Packages">
          {topPackages.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No bookings yet" body="Your best-selling packages will be ranked here." icon={PackageIcon} />
            </div>
          ) : (
            <ol className="divide-y divide-line">
              {topPackages.map((t, i) => {
                const pct = Math.round((t.count / maxTop) * 100)
                return (
                  <li key={t.title} className="flex items-center gap-4 px-6 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-sm font-semibold text-navy">{t.title}</p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="font-display text-lg font-bold text-navy">{t.count}</span>
                  </li>
                )
              })}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  )
}

import { Star } from 'lucide-react'
import { getRecent } from '@/lib/admin-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { ReviewActions } from '@/components/admin/controls'
import { cn } from '@/lib/utils'
import type { Review } from '@/payload-types'

export const dynamic = 'force-dynamic'

function pkgTitle(p: unknown): string {
  return p && typeof p === 'object' && 'title' in p ? String((p as { title: string }).title) : '—'
}

function Rating({ value }: { value: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(value ?? 0)))
  return (
    <div className="flex items-center gap-0.5" aria-label={`${filled} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4 text-coral', i < filled ? 'fill-current' : 'text-line')}
        />
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const reviews = await getRecent<Review>('reviews', { limit: 100, sort: '-createdAt', depth: 1 })

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Reviews">
        {reviews.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No reviews yet"
              body="Customer reviews awaiting moderation will appear here."
              icon={Star}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Author</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Review</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 font-body text-sm">
                      <span className="font-sans font-semibold text-navy">{r.authorName}</span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <Rating value={r.rating} />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <div className="max-w-sm">
                        {r.title ? <p className="font-sans font-semibold text-navy">{r.title}</p> : null}
                        <p className="line-clamp-2 text-muted">{r.body}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{pkgTitle(r.package)}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <ReviewActions id={String(r.id)} featured={r.featured} />
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

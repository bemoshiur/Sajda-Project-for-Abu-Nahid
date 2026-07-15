import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'primary',
}: {
  label: string
  value: ReactNode
  icon: LucideIcon
  accent?: 'primary' | 'coral' | 'navy' | 'green'
}) {
  const accents: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    coral: 'bg-coral/10 text-coral',
    navy: 'bg-navy/10 text-navy',
    green: 'bg-emerald-500/10 text-emerald-600',
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
      <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl', accents[accent])}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="font-ui text-xs font-medium tracking-wide text-muted-2 uppercase">{label}</p>
        <p className="font-display text-2xl font-bold text-navy">{value}</p>
      </div>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  // bookings
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-sky-100 text-sky-700',
  paid: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  refunded: 'bg-slate-100 text-slate-600',
  // payment
  unpaid: 'bg-amber-100 text-amber-700',
  partial: 'bg-sky-100 text-sky-700',
  // enquiries
  new: 'bg-sky-100 text-sky-700',
  contacted: 'bg-indigo-100 text-indigo-700',
  interested: 'bg-violet-100 text-violet-700',
  // invoices
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-sky-100 text-sky-700',
  void: 'bg-rose-100 text-rose-700',
  // reviews
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  // generic
  open: 'bg-emerald-100 text-emerald-700',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
}

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null
  const cls = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 font-ui text-xs font-semibold capitalize', cls)}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-line bg-white', className)}>
      {title || action ? (
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          {title ? <h2 className="font-display text-lg font-bold text-navy">{title}</h2> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function EmptyState({ title, body, icon: Icon, action }: { title: string; body?: string; icon: LucideIcon; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted-2">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
      {body ? <p className="max-w-sm font-body text-sm text-muted">{body}</p> : null}
      {action}
    </div>
  )
}

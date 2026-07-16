'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import type { PackageWithNextDate } from '@/lib/data'
import { PackageCard } from '@/components/ui/PackageCard'
import { useCurrency } from '@/components/currency/CurrencyProvider'
import { formatMoney } from '@/lib/currency'
import { cn } from '@/lib/utils'

type Tier = 'all' | 'economy' | 'standard' | 'premium'

const TIERS: { value: Tier; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'economy', label: 'Economy' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
]

const DURATIONS: { key: string; label: string; test: (d: number) => boolean }[] = [
  { key: '7', label: '7 Days', test: (d) => d > 0 && d <= 7 },
  { key: '10', label: '10 Days', test: (d) => d > 7 && d <= 10 },
  { key: '15', label: '15 Days', test: (d) => d > 10 && d <= 15 },
  { key: '21', label: '21+ Days', test: (d) => d > 15 },
]

const SERVICES: { key: string; label: string; keywords: string[] }[] = [
  { key: 'visa', label: 'Visa & Flight', keywords: ['visa', 'flight', 'airfare'] },
  { key: 'hotel', label: 'Hotel & Transport', keywords: ['hotel', 'transport', 'accommodation'] },
  { key: 'guide', label: 'Guide & Ziyarah', keywords: ['guide', 'ziyarah', 'cruise'] },
]

export function PackageExplorer({ items }: { items: PackageWithNextDate[] }) {
  const { currency, usdRate } = useCurrency()

  const destinations = useMemo(
    () => Array.from(new Set(items.map((i) => i.pkg.destination).filter(Boolean))) as string[],
    [items],
  )
  const priceBounds = useMemo(() => {
    const prices = items.map((i) => i.pkg.basePrice)
    return { min: Math.min(...prices, 0), max: Math.max(...prices, 100000) }
  }, [items])

  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [maxBudget, setMaxBudget] = useState(priceBounds.max)
  const [tier, setTier] = useState<Tier>('all')
  const [durations, setDurations] = useState<Set<string>>(new Set())
  const [services, setServices] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  }

  const reset = () => {
    setSearch('')
    setDestination('')
    setMaxBudget(priceBounds.max)
    setTier('all')
    setDurations(new Set())
    setServices(new Set())
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter(({ pkg }) => {
      if (q && !`${pkg.title} ${pkg.destination ?? ''}`.toLowerCase().includes(q)) return false
      if (destination && pkg.destination !== destination) return false
      if (pkg.basePrice > maxBudget) return false
      if (tier !== 'all' && pkg.tier !== tier) return false
      if (durations.size) {
        const d = pkg.duration?.days ?? 0
        if (!DURATIONS.some((b) => durations.has(b.key) && b.test(d))) return false
      }
      if (services.size) {
        const inc = (pkg.included ?? []).map((x) => (x.item ?? '').toLowerCase()).join(' ')
        if (!SERVICES.every((g) => !services.has(g.key) || g.keywords.some((k) => inc.includes(k)))) return false
      }
      return true
    })
  }, [items, search, destination, maxBudget, tier, durations, services])

  const sidebar = (
    <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5">
      <h2 className="font-display text-lg font-bold text-navy">Plan Your Journey</h2>

      <Field label="Search Package">
        <div className="flex items-center gap-2 rounded-xl border border-line px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or place"
            className="h-10 w-full bg-transparent font-body text-sm text-navy placeholder:text-muted-2 focus:outline-none"
          />
        </div>
      </Field>

      <Field label="Select Destination">
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 font-body text-sm text-navy focus:border-primary focus:outline-none"
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Budget up to — ${formatMoney(maxBudget, currency, usdRate)}`}>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={1000}
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between font-ui text-[10px] text-muted-2">
          <span>{formatMoney(priceBounds.min, currency, usdRate)}</span>
          <span>{formatMoney(priceBounds.max, currency, usdRate)}</span>
        </div>
      </Field>

      <Field label="Tier">
        <div className="grid grid-cols-2 gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={cn(
                'rounded-lg px-3 py-2 font-ui text-xs font-semibold transition',
                tier === t.value ? 'bg-primary text-white' : 'border border-line text-muted hover:border-primary',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Duration">
        <div className="flex flex-wrap gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDurations((s) => toggle(s, d.key))}
              className={cn(
                'rounded-full px-3 py-1.5 font-ui text-xs font-semibold transition',
                durations.has(d.key) ? 'bg-navy text-white' : 'border border-line text-muted hover:border-primary',
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Included Services">
        <div className="flex flex-col gap-2">
          {SERVICES.map((s) => (
            <label key={s.key} className="flex cursor-pointer items-center gap-2.5 font-body text-sm text-navy">
              <input
                type="checkbox"
                checked={services.has(s.key)}
                onChange={() => setServices((set) => toggle(set, s.key))}
                className="h-4 w-4 rounded border-line accent-primary"
              />
              {s.label}
            </label>
          ))}
        </div>
      </Field>

      <button
        type="button"
        onClick={() => setMobileOpen(false)}
        className="h-11 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Search Packages
      </button>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line font-sans text-sm font-semibold text-muted transition hover:border-primary hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" /> Reset Filter
      </button>
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white font-sans text-sm font-semibold text-navy lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-navy">Filters</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters" className="rounded-lg p-1.5">
                <X className="h-5 w-5 text-navy" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}

      {/* Results */}
      <div>
        <p className="mb-4 font-body text-sm text-muted">
          Showing <span className="font-semibold text-navy">{filtered.length}</span> package
          {filtered.length === 1 ? '' : 's'}
        </p>
        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(({ pkg, nextDate }) => (
              <PackageCard key={pkg.id} pkg={pkg} nextDate={nextDate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <h3 className="font-display text-lg font-bold text-navy">No packages match your filters</h3>
            <p className="max-w-sm font-body text-sm text-muted">Try widening your budget or clearing some filters.</p>
            <button onClick={reset} className="mt-1 font-sans text-sm font-semibold text-primary hover:underline">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-ui text-xs font-semibold tracking-wide text-muted-2 uppercase">{label}</span>
      {children}
    </div>
  )
}

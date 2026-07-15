'use client'

import { useActionState } from 'react'
import { Search, Check } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiries'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const initial: EnquiryState = { ok: false }

export function PlanJourneyWidget({ packages }: { packages: { id: number | string; title: string }[] }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-xl shadow-navy/10 ring-1 ring-line">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-navy">Enquiry received</p>
          <p className="font-body text-sm text-muted">{state.message}</p>
        </div>
      </div>
    )
  }

  return (
    <form
      action={action}
      className="rounded-2xl bg-white p-4 shadow-xl shadow-navy/10 ring-1 ring-line sm:p-5"
    >
      <p className="mb-3 px-1 font-ui text-xs font-semibold tracking-wide text-primary uppercase">
        Plan Your Journey
      </p>
      <input type="hidden" name="source" value="hero_widget" />
      <input type="hidden" name="name" value="Website Visitor" />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Package">
          <select name="package" className="w-full bg-transparent text-sm text-navy focus:outline-none">
            <option value="">Select package</option>
            {packages.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Travel Month">
          <select name="travelMonth" className="w-full bg-transparent text-sm text-navy focus:outline-none">
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Travelers">
          <input
            name="travelers"
            type="number"
            min={1}
            defaultValue={1}
            className="w-full bg-transparent text-sm text-navy focus:outline-none"
          />
        </Field>
        <Field label="Phone">
          <input
            name="phone"
            type="tel"
            required
            placeholder="Enter number"
            className="w-full bg-transparent text-sm text-navy placeholder:text-muted-2 focus:outline-none"
          />
        </Field>
      </div>
      {state.error ? <p className="mt-2 px-1 text-xs text-coral">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        <Search className="h-4 w-4" /> {pending ? 'Sending…' : 'Search Now'}
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line px-3 py-2 focus-within:border-primary">
      <span className="font-ui text-[10px] font-semibold tracking-wide text-muted-2 uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

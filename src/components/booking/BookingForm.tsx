'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, CreditCard, Send } from 'lucide-react'
import { createBookingAndCheckout, type BookingState } from '@/app/actions/booking'
import { formatBDT } from '@/lib/currency'

type DepartureOpt = { id: number | string; label: string; price: number; seatsAvailable: number }

export function BookingForm({
  packageId,
  basePrice,
  departures,
  stripeEnabled,
}: {
  packageId: number | string
  basePrice: number
  departures: DepartureOpt[]
  stripeEnabled: boolean
}) {
  const [state, action, pending] = useActionState<BookingState, FormData>(createBookingAndCheckout, {})
  const [depId, setDepId] = useState<string>(departures[0] ? String(departures[0].id) : '')
  const [travelers, setTravelers] = useState(1)

  const unit = departures.find((d) => String(d.id) === depId)?.price ?? basePrice
  const total = unit * travelers

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="packageId" value={String(packageId)} />
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </p>
      ) : null}

      {departures.length > 0 ? (
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Departure date</span>
          <select
            name="departureId"
            value={depId}
            onChange={(e) => setDepId(e.target.value)}
            className="h-12 rounded-xl border border-line bg-white px-3.5 font-body text-sm text-navy focus:border-primary focus:outline-none"
          >
            {departures.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.label} — {formatBDT(d.price)} ({d.seatsAvailable} seats)
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm font-medium text-navy">Number of travelers</span>
        <input
          name="travelersCount"
          type="number"
          min={1}
          max={20}
          value={travelers}
          onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
          className="h-12 rounded-xl border border-line bg-white px-3.5 font-body text-sm text-navy focus:border-primary focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm font-medium text-navy">Notes (optional)</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Special requirements, preferred hotel, etc."
          className="rounded-xl border border-line bg-white px-3.5 py-2.5 font-body text-sm text-navy focus:border-primary focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3">
        <span className="font-sans text-sm font-medium text-muted">Estimated total</span>
        <span className="font-display text-xl font-bold text-navy">{formatBDT(total)}</span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {stripeEnabled ? <CreditCard className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
        {pending ? 'Processing…' : stripeEnabled ? 'Continue to payment' : 'Request booking'}
      </button>
      <p className="text-center font-body text-xs text-muted-2">
        {stripeEnabled
          ? 'You will be redirected to a secure Stripe checkout.'
          : 'Our team will contact you to confirm and arrange payment.'}
      </p>
    </form>
  )
}

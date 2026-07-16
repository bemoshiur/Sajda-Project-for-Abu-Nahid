'use client'

import { useActionState } from 'react'
import { Check, AlertCircle, CreditCard } from 'lucide-react'
import { submitBookingRequest, type BookingRequestState } from '@/app/actions/booking-request'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/currency/Price'

const inputCls =
  'h-11 w-full rounded-xl border border-line bg-white px-3.5 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none'

const initial: BookingRequestState = { ok: false }

export function BookThisTour({
  packageId,
  slug,
  basePrice,
}: {
  packageId: string
  slug: string
  basePrice: number
}) {
  const [state, action, pending] = useActionState(submitBookingRequest, initial)

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold text-navy">Book This Tour</h3>
        <p className="font-sans text-lg font-bold text-navy">
          <Price amountBdt={basePrice} per="person" />
        </p>
      </div>

      {state.ok ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-6 w-6" />
          </span>
          <p className="font-sans text-sm font-semibold text-navy">Request received</p>
          <p className="font-body text-sm text-muted">{state.message}</p>
        </div>
      ) : (
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="packageId" value={packageId} />
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {state.error ? (
            <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-3 py-2 text-xs text-coral">
              <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
            </p>
          ) : null}
          <input name="name" required placeholder="Name" autoComplete="name" className={inputCls} />
          <input name="email" type="email" required placeholder="Email" autoComplete="email" className={inputCls} />
          <input name="confirmEmail" type="email" required placeholder="Confirm Email" className={inputCls} />
          <input name="phone" type="tel" required placeholder="Phone" autoComplete="tel" className={inputCls} />
          <label className="flex flex-col gap-1">
            <span className="font-ui text-xs text-muted-2">Join date</span>
            <input name="joinDate" type="date" className={inputCls} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-ui text-xs text-muted-2">Number of tickets</span>
            <input name="tickets" type="number" min={1} max={50} defaultValue={1} className={inputCls} />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-1 h-12 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {pending ? 'Sending…' : 'Book Now'}
          </button>
        </form>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <Button href={`/book/${slug}`} variant="outline" size="md" className="w-full">
          <CreditCard className="h-4 w-4" /> Book &amp; pay online
        </Button>
        <p className="mt-2 text-center font-body text-xs text-muted-2">
          Sign in to reserve seats and pay securely.
        </p>
      </div>
    </div>
  )
}

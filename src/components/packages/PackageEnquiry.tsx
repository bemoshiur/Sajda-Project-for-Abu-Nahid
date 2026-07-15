'use client'

import { useActionState } from 'react'
import { Check, Send } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiries'

const initial: EnquiryState = { ok: false }

/** Compact enquiry form for the package detail sidebar. */
export function PackageEnquiry({ packageId }: { packageId: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-primary-50 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-navy">Enquiry received</p>
          <p className="font-body text-sm text-muted">
            {state.message ?? "Thank you! We'll contact you shortly."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <p className="font-ui text-xs font-semibold tracking-wide text-primary uppercase">
        Have a question?
      </p>
      <input type="hidden" name="source" value="package_page" />
      <input type="hidden" name="packageId" value={packageId} />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <label className="flex flex-col gap-1">
        <span className="font-ui text-[11px] font-semibold tracking-wide text-muted-2 uppercase">
          Name
        </span>
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="h-11 rounded-xl border border-line bg-white px-3 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-ui text-[11px] font-semibold tracking-wide text-muted-2 uppercase">
          Phone
        </span>
        <input
          name="phone"
          type="tel"
          required
          placeholder="Enter number"
          className="h-11 rounded-xl border border-line bg-white px-3 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-ui text-[11px] font-semibold tracking-wide text-muted-2 uppercase">
          Message
        </span>
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us what you'd like to know…"
          className="resize-none rounded-xl border border-line bg-white px-3 py-2 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none"
        />
      </label>

      {state.error ? <p className="text-xs text-coral">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
      >
        <Send className="h-4 w-4" /> {pending ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  )
}

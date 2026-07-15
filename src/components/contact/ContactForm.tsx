'use client'

import { useActionState } from 'react'
import { Check, Send } from 'lucide-react'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiries'

const CATEGORIES: { value: 'tour' | 'hajj' | 'umrah' | 'other'; label: string }[] = [
  { value: 'tour', label: 'Tour' },
  { value: 'hajj', label: 'Hajj' },
  { value: 'umrah', label: 'Umrah' },
  { value: 'other', label: 'Other' },
]

const initial: EnquiryState = { ok: false }

const fieldClass =
  'h-11 w-full rounded-xl border border-line bg-white px-4 font-body text-sm text-navy placeholder:text-muted-2 transition-colors focus:border-primary focus:outline-none sm:h-12'

const labelClass = 'font-ui text-xs font-semibold tracking-wide text-navy uppercase'

export function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-bold text-navy">Enquiry received</p>
          <p className="font-body text-sm text-muted">
            {state.message ?? "Thank you! We'll contact you shortly."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="source" value="contact_form" />
      {/* Honeypot: bots fill this hidden field. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className="text-coral">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="text-coral">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Your phone number"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-category" className={labelClass}>
            Interested In
          </label>
          <select
            id="contact-category"
            name="interestedCategory"
            defaultValue="tour"
            className={`${fieldClass} cursor-pointer`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-coral">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your travel plans…"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 font-body text-sm text-navy placeholder:text-muted-2 transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      {state.error ? (
        <p className="font-body text-sm text-coral" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
      >
        <Send className="h-4 w-4" /> {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

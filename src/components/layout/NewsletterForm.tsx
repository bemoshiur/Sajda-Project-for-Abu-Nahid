'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterForm() {
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (email.includes('@')) setDone(true)
      }}
      className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-4"
    >
      {done ? (
        <span className="flex items-center gap-2 py-2 text-sm text-white">
          <Check className="h-4 w-4" /> Subscribed — thank you!
        </span>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Subscribe <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}
    </form>
  )
}

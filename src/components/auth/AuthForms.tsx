'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { AlertCircle } from 'lucide-react'
import { loginCustomer, registerCustomer, type AuthState } from '@/app/actions/auth'

const initial: AuthState = {}

const inputCls =
  'h-12 w-full rounded-xl border border-line bg-white px-4 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none'

function ErrorBanner({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
      <AlertCircle className="h-4 w-4 shrink-0" /> {error}
    </p>
  )
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginCustomer, initial)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">Welcome back</h1>
        <p className="mt-2 font-body text-sm text-muted">Sign in to manage your bookings and enquiries.</p>
      </div>
      <form action={action} className="flex flex-col gap-4">
        <ErrorBanner error={state.error} />
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Password</span>
          <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputCls} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center font-body text-sm text-muted">
        New to Sajda?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerCustomer, initial)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">Create your account</h1>
        <p className="mt-2 font-body text-sm text-muted">Book journeys and track everything in one place.</p>
      </div>
      <form action={action} className="flex flex-col gap-4">
        <ErrorBanner error={state.error} />
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Full name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+880…" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Password</span>
          <input name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" className={inputCls} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 rounded-xl bg-primary font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-center font-body text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

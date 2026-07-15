'use client'

import { useActionState } from 'react'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { loginStaff, type AuthState } from '@/app/actions/auth'
import { Logo } from '@/components/ui/Logo'

const inputCls =
  'h-12 w-full rounded-xl border border-line bg-white px-4 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none'

export function StaffLoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginStaff, {})
  return (
    <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-xl shadow-navy/5">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Logo />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 font-ui text-xs font-semibold text-navy">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Staff Portal
        </span>
      </div>
      <form action={action} className="flex flex-col gap-4">
        {state.error ? (
          <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
            <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
          </p>
        ) : null}
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Email</span>
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-sm font-medium text-navy">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 rounded-xl bg-navy font-sans text-sm font-semibold text-white transition hover:bg-navy-2 disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in to admin'}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useActionState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { updateProfile, type ProfileState } from '@/app/actions/profile'

const inputCls =
  'h-11 w-full rounded-xl border border-line bg-white px-3.5 font-body text-sm text-navy placeholder:text-muted-2 focus:border-primary focus:outline-none'

type Values = {
  name: string
  email: string
  phone?: string
  line1?: string
  city?: string
  country?: string
  postcode?: string
  passportNumber?: string
}

function F({ label, name, defaultValue, type = 'text', disabled }: { label: string; name: string; defaultValue?: string; type?: string; disabled?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-sm font-medium text-navy">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} disabled={disabled} className={inputCls} />
    </label>
  )
}

export function ProfileForm({ values }: { values: Values }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {})
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4" /> {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Full name" name="name" defaultValue={values.name} />
        <F label="Email" name="email" defaultValue={values.email} disabled />
        <F label="Phone" name="phone" defaultValue={values.phone} />
        <F label="Passport number" name="passportNumber" defaultValue={values.passportNumber} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Address line" name="line1" defaultValue={values.line1} />
        <F label="City" name="city" defaultValue={values.city} />
        <F label="Country" name="country" defaultValue={values.country} />
        <F label="Postcode" name="postcode" defaultValue={values.postcode} />
      </div>
      <div>
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl bg-primary px-6 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

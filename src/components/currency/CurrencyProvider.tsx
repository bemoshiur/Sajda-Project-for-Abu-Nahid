'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { DisplayCurrency } from '@/lib/currency'

type CurrencyState = {
  currency: DisplayCurrency
  usdRate: number
  setCurrency: (c: DisplayCurrency) => void
}

const CurrencyContext = createContext<CurrencyState | null>(null)

export function CurrencyProvider({
  initial,
  children,
}: {
  initial: { currency: DisplayCurrency; usdRate: number }
  children: ReactNode
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(initial.currency)

  const setCurrency = useCallback((c: DisplayCurrency) => {
    setCurrencyState(c)
    document.cookie = `currency=${c};path=/;max-age=31536000;samesite=lax`
  }, [])

  return (
    <CurrencyContext.Provider value={{ currency, usdRate: initial.usdRate, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    // Safe fallback so components render even outside a provider (e.g. isolated).
    return { currency: 'BDT', usdRate: 120, setCurrency: () => {} }
  }
  return ctx
}

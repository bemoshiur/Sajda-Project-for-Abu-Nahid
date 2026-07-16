'use client'

import { useCurrency } from './CurrencyProvider'
import { formatMoney } from '@/lib/currency'
import { cn } from '@/lib/utils'

/**
 * Currency-aware price. `amountBdt` is the canonical BDT amount; it renders in
 * the visitor's selected currency (BDT or USD via the settings rate).
 */
export function Price({
  amountBdt,
  per,
  className,
}: {
  amountBdt: number
  per?: string
  className?: string
}) {
  const { currency, usdRate } = useCurrency()
  return (
    <span className={cn('whitespace-nowrap', className)}>
      {formatMoney(amountBdt, currency, usdRate)}
      {per ? <span className="font-ui text-xs font-normal text-muted-2"> / {per}</span> : null}
    </span>
  )
}

export type DisplayCurrency = 'BDT' | 'USD'

/** Format a BDT amount using the South-Asian (lakh/crore) grouping, e.g. ৳1,65,000. */
export function formatBDT(amount: number): string {
  return '৳' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)
}

/** Convert BDT → USD using the configurable rate. */
export function bdtToUsd(amountBdt: number, usdRate: number): number {
  return usdRate > 0 ? amountBdt / usdRate : 0
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a canonical (BDT) amount in the requested display currency.
 * BDT is the stored base; USD is derived from the settings usdRate.
 */
export function formatMoney(
  amountBdt: number,
  currency: DisplayCurrency = 'BDT',
  usdRate = 120,
): string {
  return currency === 'USD' ? formatUSD(bdtToUsd(amountBdt, usdRate)) : formatBDT(amountBdt)
}

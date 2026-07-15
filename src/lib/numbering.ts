/** Human-friendly document numbering. */

const stamp = (): string => {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yy}${mm}${dd}`
}

const rand4 = (): string => String(Math.floor(1000 + Math.random() * 9000))

/** e.g. SJB-260715-4821 */
export const generateBookingNumber = (): string => `SJB-${stamp()}-${rand4()}`

/** e.g. SAJ-260715-4821 (prefix comes from Settings.invoicePrefix) */
export const generateInvoiceNumber = (prefix = 'SAJ'): string => `${prefix}-${stamp()}-${rand4()}`

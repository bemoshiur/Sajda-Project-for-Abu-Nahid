import { Download, FileText } from 'lucide-react'
import { getCurrentCustomer } from '@/lib/auth'
import { getCustomerInvoices } from '@/lib/customer-data'
import { Panel, StatusBadge, EmptyState } from '@/components/dashboard/ui'
import { formatBDT } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function fmtDate(v?: string | null): string {
  return v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

export default async function InvoicesPage() {
  const customer = await getCurrentCustomer()
  if (!customer) return null
  const invoices = await getCustomerInvoices(customer.id)

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        body="Invoices are generated after a booking is confirmed and paid."
        icon={FileText}
      />
    )
  }

  return (
    <Panel title="My Invoices">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Issued</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition hover:bg-surface">
                <td className="px-6 py-4 font-sans text-sm font-semibold text-navy">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 font-body text-sm text-muted">{fmtDate(inv.issueDate)}</td>
                <td className="px-6 py-4 font-sans text-sm font-semibold text-navy">{formatBDT(inv.total ?? 0)}</td>
                <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`/api/invoices/${inv.id}/pdf`}
                    className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" /> PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

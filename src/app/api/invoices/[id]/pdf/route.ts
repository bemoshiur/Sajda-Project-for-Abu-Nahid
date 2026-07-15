import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { getAuth } from '@/lib/auth'
import { InvoiceDocument } from '@/components/pdf/InvoiceDocument'

export const dynamic = 'force-dynamic'

function relId(v: unknown): number | undefined {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && 'id' in v) return Number((v as { id: number }).id)
  return v ? Number(v) : undefined
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { payload, user } = await getAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const invoice = await payload.findByID({ collection: 'invoices', id, depth: 2 }).catch(() => null)
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Customers may only fetch their own invoice; staff may fetch any.
  if (user.collection === 'customers' && relId(invoice.customer) !== Number(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const settings = await payload.findGlobal({ slug: 'settings' }).catch(() => null)
  const buffer = await renderToBuffer(InvoiceDocument({ invoice, settings }))

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  })
}

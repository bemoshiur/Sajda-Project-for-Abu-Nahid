import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Invoice, Setting } from '@/payload-types'

const money = (n?: number | null) => 'BDT ' + new Intl.NumberFormat('en-IN').format(n ?? 0)
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: '#1d242d', fontFamily: 'Helvetica' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0188ff' },
  muted: { color: '#5e6282' },
  h: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#181433' },
  section: { marginTop: 24 },
  label: { fontSize: 8, color: '#84829a', textTransform: 'uppercase', marginBottom: 3 },
  tableHead: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 8, marginTop: 20 },
  tr: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  cDesc: { flex: 3 },
  cNum: { flex: 1, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  totalLabel: { width: 100, textAlign: 'right', color: '#5e6282' },
  totalVal: { width: 90, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  footer: { marginTop: 40, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e5e5', color: '#84829a', fontSize: 9 },
})

export function InvoiceDocument({ invoice, settings }: { invoice: Invoice; settings: Setting | null }) {
  const customer = typeof invoice.customer === 'object' && invoice.customer ? invoice.customer : null
  const items = invoice.lineItems ?? []

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.row}>
          <View>
            <Text style={s.brand}>SAJDA</Text>
            <Text style={s.muted}>{settings?.companyName ?? 'Sajda Travel & Tours Limited'}</Text>
            {settings?.address ? <Text style={s.muted}>{settings.address}</Text> : null}
            {settings?.phones?.[0]?.phone ? <Text style={s.muted}>{settings.phones[0].phone}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.h}>INVOICE</Text>
            <Text>{invoice.invoiceNumber}</Text>
            <Text style={s.muted}>Issued {fmtDate(invoice.issueDate)}</Text>
          </View>
        </View>

        <View style={[s.section, s.row]}>
          <View>
            <Text style={s.label}>Billed to</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{customer?.name ?? '—'}</Text>
            {customer?.email ? <Text style={s.muted}>{customer.email}</Text> : null}
            {customer?.phone ? <Text style={s.muted}>{customer.phone}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.label}>Status</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', textTransform: 'capitalize' }}>{invoice.status}</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={[s.cDesc, s.label]}>Description</Text>
          <Text style={[s.cNum, s.label]}>Qty</Text>
          <Text style={[s.cNum, s.label]}>Unit</Text>
          <Text style={[s.cNum, s.label]}>Total</Text>
        </View>
        {items.map((it, i) => (
          <View style={s.tr} key={i}>
            <Text style={s.cDesc}>{it.description}</Text>
            <Text style={s.cNum}>{it.qty ?? 1}</Text>
            <Text style={s.cNum}>{money(it.unitPrice)}</Text>
            <Text style={s.cNum}>{money(it.total)}</Text>
          </View>
        ))}

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Subtotal</Text>
          <Text style={s.totalVal}>{money(invoice.subtotal)}</Text>
        </View>
        {invoice.discount ? (
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Discount</Text>
            <Text style={s.totalVal}>-{money(invoice.discount)}</Text>
          </View>
        ) : null}
        <View style={s.totalRow}>
          <Text style={[s.totalLabel, { color: '#181433', fontFamily: 'Helvetica-Bold' }]}>Total</Text>
          <Text style={[s.totalVal, { color: '#0188ff' }]}>{money(invoice.total)}</Text>
        </View>

        <Text style={s.footer}>
          {settings?.invoiceFooterNote ?? 'Thank you for travelling with Sajda Travel & Tours Limited.'}
        </Text>
      </Page>
    </Document>
  )
}

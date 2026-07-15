import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff, isStaffOrOwnedByCustomer } from '../access'
import { generateInvoiceNumber } from '../lib/numbering'

/**
 * Invoices. Generated on successful payment (Phase 5); PDF rendered to Blob.
 * Customers can read only their own invoices.
 */
export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'customer', 'total', 'status', 'issueDate'],
    group: 'Sales',
  },
  access: {
    read: isStaffOrOwnedByCustomer('customer'),
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.invoiceNumber) {
          data.invoiceNumber = generateInvoiceNumber()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    { name: 'booking', type: 'relationship', relationTo: 'bookings' },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true },
    {
      name: 'lineItems',
      type: 'array',
      fields: [
        { name: 'description', type: 'text' },
        { name: 'qty', type: 'number', defaultValue: 1 },
        { name: 'unitPrice', type: 'number' },
        { name: 'total', type: 'number' },
      ],
    },
    { name: 'subtotal', type: 'number', min: 0 },
    { name: 'discount', type: 'number', min: 0, defaultValue: 0 },
    { name: 'tax', type: 'number', min: 0, defaultValue: 0 },
    { name: 'total', type: 'number', min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'BDT' },
    { name: 'issueDate', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'dueDate', type: 'date' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Paid', value: 'paid' },
        { label: 'Void', value: 'void' },
      ],
    },
    { name: 'pdfUrl', type: 'text', admin: { readOnly: true } },
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}

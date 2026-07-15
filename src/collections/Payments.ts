import type { CollectionConfig } from 'payload'
import { isStaff, isSuperAdmin } from '../access'

/**
 * Payment records. Created by the Stripe webhook (Phase 5) via the Local API,
 * which bypasses access — so read is staff-only here (customers view status
 * through their booking).
 */
export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'stripeSessionId',
    defaultColumns: ['booking', 'amount', 'currency', 'status', 'paidAt'],
    group: 'Sales',
  },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isSuperAdmin,
  },
  fields: [
    { name: 'booking', type: 'relationship', relationTo: 'bookings', required: true },
    { name: 'amount', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'BDT' },
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'stripe',
      options: [{ label: 'Stripe', value: 'stripe' }],
    },
    { name: 'stripeSessionId', type: 'text', index: true },
    { name: 'stripePaymentIntentId', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'created',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    { name: 'receiptUrl', type: 'text' },
    { name: 'paidAt', type: 'date' },
    { name: 'raw', type: 'json', admin: { readOnly: true } },
  ],
  timestamps: true,
}

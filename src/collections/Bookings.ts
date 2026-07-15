import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin, isStaff, isStaffFieldLevel, isStaffOrOwnedByCustomer } from '../access'
import { generateBookingNumber } from '../lib/numbering'

/** Field-level access shared by all money/state fields — staff-writable only. */
const staffOnlyField = { create: isStaffFieldLevel, update: isStaffFieldLevel }

/**
 * Bookings (the admin "Orders"). A customer books a package/departure;
 * payment + invoice are handled in Phase 5. Customers see only their own.
 *
 * Security: money + status fields are staff-writable only (a customer cannot
 * self-declare `total: 0` or `status: 'paid'`). The real booking flow creates
 * rows via the Local API (Phase 5), which recomputes totals server-side. On
 * customer create, `customer` is forced to the authenticated customer's id.
 */
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'bookingNumber',
    defaultColumns: ['bookingNumber', 'customer', 'package', 'status', 'paymentStatus', 'total'],
    group: 'Sales',
  },
  access: {
    read: isStaffOrOwnedByCustomer('customer'),
    create: authenticated,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          if (!data.bookingNumber) data.bookingNumber = generateBookingNumber()
          const user = req.user as { collection?: string; id?: string | number } | null
          // A customer may only ever book for themselves.
          if (user?.collection === 'customers' && user.id != null) {
            data.customer = user.id
            data.source = 'web'
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'bookingNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true },
    { name: 'package', type: 'relationship', relationTo: 'packages', required: true },
    { name: 'departure', type: 'relationship', relationTo: 'departures' },
    {
      name: 'travelers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'passportNumber', type: 'text' },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'adult',
          options: [
            { label: 'Adult', value: 'adult' },
            { label: 'Child', value: 'child' },
            { label: 'Infant', value: 'infant' },
          ],
        },
      ],
    },
    { name: 'travelersCount', type: 'number', min: 1, defaultValue: 1 },
    { name: 'subtotal', type: 'number', min: 0, access: staffOnlyField },
    { name: 'discount', type: 'number', min: 0, defaultValue: 0, access: staffOnlyField },
    { name: 'total', type: 'number', min: 0, access: staffOnlyField },
    { name: 'currency', type: 'text', defaultValue: 'BDT', access: staffOnlyField },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      access: staffOnlyField,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'unpaid',
      access: staffOnlyField,
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'passportCopies',
      type: 'array',
      admin: { description: 'Uploaded passport copies (staff/owner-only via private-media).' },
      fields: [{ name: 'file', type: 'upload', relationTo: 'private-media' }],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web',
      access: staffOnlyField,
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
  timestamps: true,
}

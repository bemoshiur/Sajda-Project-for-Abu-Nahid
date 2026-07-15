import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin, isStaff, isStaffOrOwnedByCustomer } from '../access'
import { generateBookingNumber } from '../lib/numbering'

/**
 * Bookings (the admin "Orders"). A customer books a package/departure;
 * payment + invoice are handled in Phase 5. Customers see only their own.
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
      ({ data, operation }) => {
        if (operation === 'create' && !data.bookingNumber) {
          data.bookingNumber = generateBookingNumber()
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
    { name: 'subtotal', type: 'number', min: 0 },
    { name: 'discount', type: 'number', min: 0, defaultValue: 0 },
    { name: 'total', type: 'number', min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'BDT' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
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
      admin: { description: 'Uploaded passport copies (restricted).' },
      fields: [{ name: 'file', type: 'upload', relationTo: 'media' }],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
  timestamps: true,
}

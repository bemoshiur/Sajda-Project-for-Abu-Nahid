import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isStaff } from '../access'

/**
 * Scheduled departures for a package (the admin "Inventory").
 * Tracks seat availability per date. Publicly readable so package pages can
 * show upcoming dates; only staff can mutate.
 */
export const Departures: CollectionConfig = {
  slug: 'departures',
  admin: {
    useAsTitle: 'departureDate',
    defaultColumns: ['package', 'departureDate', 'price', 'seatsTotal', 'seatsBooked', 'status'],
    group: 'Catalog',
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    { name: 'package', type: 'relationship', relationTo: 'packages', required: true },
    { name: 'departureDate', type: 'date', required: true },
    { name: 'returnDate', type: 'date' },
    { name: 'price', type: 'number', required: true, min: 0, admin: { description: 'Price in BDT (৳).' } },
    { name: 'seatsTotal', type: 'number', required: true, min: 0, defaultValue: 30 },
    { name: 'seatsBooked', type: 'number', min: 0, defaultValue: 0, admin: { readOnly: true } },
    {
      name: 'seatsAvailable',
      type: 'number',
      virtual: true,
      admin: { readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) => Math.max(0, (data?.seatsTotal ?? 0) - (data?.seatsBooked ?? 0)),
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Full', value: 'full' },
        { label: 'Closed', value: 'closed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
  timestamps: true,
}

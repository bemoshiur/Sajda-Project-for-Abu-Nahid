import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

/**
 * Suppliers / vendors — hotels, airlines, transport, visa services.
 * Staff-managed; not exposed publicly.
 */
export const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'rating'],
    group: 'Operations',
  },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'hotel',
      options: [
        { label: 'Hotel', value: 'hotel' },
        { label: 'Airline', value: 'airline' },
        { label: 'Transport', value: 'transport' },
        { label: 'Visa', value: 'visa' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'contactPerson', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea' },
    { name: 'services', type: 'array', fields: [{ name: 'service', type: 'text' }] },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    { name: 'linkedPackages', type: 'relationship', relationTo: 'packages', hasMany: true },
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isStaffOrSelf } from '../access'

/**
 * Storefront end-users. Separate auth collection from staff `users`.
 * Public registration allowed; a customer can read/update only their own row.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'CRM',
  },
  auth: true,
  access: {
    read: isStaffOrSelf,
    create: anyone,
    update: isStaffOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    { name: 'dateOfBirth', type: 'date' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Bangladesh' },
        { name: 'postcode', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Passport',
      admin: { initCollapsed: true },
      fields: [
        { name: 'passportNumber', type: 'text' },
        { name: 'passportExpiry', type: 'date' },
      ],
    },
  ],
  timestamps: true,
}

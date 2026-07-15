import type { CollectionConfig } from 'payload'

/**
 * Staff / admin authentication collection.
 * Backs the custom admin login and the Users & Roles screen.
 * (End-user customers live in a separate `customers` collection — added in Phase 1.)
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'isActive'],
    group: 'Staff',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  versions: false,
}

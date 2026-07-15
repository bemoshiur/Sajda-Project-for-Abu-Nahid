import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isStaff, isStaffOrSelf, isSuperAdmin } from '../access'

/**
 * Staff / admin authentication collection.
 * Backs the custom admin login and the Users & Roles screen.
 * (End-user customers live in a separate `customers` collection.)
 *
 * Access model:
 *  - read:   any staff
 *  - create: admin+ (seed uses Local API, which bypasses access for first user)
 *  - update: self or admin+ — but `role`/`isActive` are field-locked to admin+,
 *            so a staff/manager can never escalate their own privileges
 *  - delete: super-admin only
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'isActive'],
    group: 'Staff',
  },
  auth: true,
  access: {
    read: isStaff,
    create: isAdmin,
    update: isStaffOrSelf,
    delete: isSuperAdmin,
  },
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
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
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
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
  versions: false,
}

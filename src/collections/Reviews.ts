import type { CollectionConfig } from 'payload'
import { anyone, isStaff, isStaffFieldLevel, readByStatusOrStaff } from '../access'

/**
 * Visitor reviews / testimonials. Public can submit (status starts `pending`);
 * staff approve/reject. Only approved reviews are publicly readable.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'status', 'featured', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: readByStatusOrStaff('approved'),
    create: anyone,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: 'authorName', type: 'text', required: true },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      access: { create: isStaffFieldLevel, update: isStaffFieldLevel },
    },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'package', type: 'relationship', relationTo: 'packages' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      // Field-locked so a public submitter can never self-approve.
      access: { create: isStaffFieldLevel, update: isStaffFieldLevel },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      access: { create: isStaffFieldLevel, update: isStaffFieldLevel },
    },
  ],
  timestamps: true,
}

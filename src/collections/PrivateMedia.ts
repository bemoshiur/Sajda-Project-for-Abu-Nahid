import type { CollectionConfig } from 'payload'
import { authenticated, isStaff, isStaffFieldLevel, isStaffOrOwnedByCustomer } from '../access'

/**
 * Private uploads — passport copies and other sensitive documents.
 * Read is gated to staff or the owning customer; the public `media`
 * collection is NOT used for these.
 *
 * NOTE (Phase 5): when wired to Vercel Blob, passport files must use private
 * blob access / signed URLs — public blob URLs bypass Payload access control.
 * Until the booking upload flow lands, this collection uses disk storage.
 */
export const PrivateMedia: CollectionConfig = {
  slug: 'private-media',
  admin: { group: 'Sales', hidden: true },
  access: {
    read: isStaffOrOwnedByCustomer('owner'),
    create: authenticated,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          const user = req.user as { collection?: string; id?: string | number } | null
          if (user?.collection === 'customers' && user.id != null) {
            data.owner = user.id
          }
        }
        return data
      },
    ],
  },
  upload: true,
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'customers',
      access: { update: isStaffFieldLevel },
    },
    { name: 'alt', type: 'text' },
  ],
}

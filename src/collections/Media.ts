import type { CollectionConfig } from 'payload'

/**
 * Media uploads. Public-read by default (package/blog images).
 * Access control is refined in Phase 1 (passport copies become private).
 * Storage: Vercel Blob in prod/preview (see payload.config), local disk in dev.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: true,
}

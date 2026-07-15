import type { Field } from 'payload'

export const slugify = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug field. Auto-derives from `source` (default: `title`) when left blank,
 * and always normalizes whatever is entered.
 */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL identifier — auto-generated from the title if left blank.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const src = data?.[source]
        return typeof src === 'string' ? slugify(src) : value
      },
    ],
  },
})

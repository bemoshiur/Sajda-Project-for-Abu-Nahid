import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff, readByStatusOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

/**
 * Blog posts. Only published posts are publicly readable.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: readByStatusOrStaff('published'),
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'excerpt', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'author', type: 'text', defaultValue: 'Sajda Team' },
    { name: 'category', type: 'text' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    { name: 'readTime', type: 'number', admin: { description: 'Estimated read time (minutes).' } },
    seoField,
  ],
  timestamps: true,
}

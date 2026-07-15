import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff, readByStatusOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

/**
 * Travel packages (the "Products" of the admin). Tour / Hajj / Umrah.
 * Prices stored in the base currency (BDT); FX/display handled in the app layer.
 */
export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'basePrice', 'status', 'featured'],
    group: 'Catalog',
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
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Tour', value: 'tour' },
        { label: 'Hajj', value: 'hajj' },
        { label: 'Umrah', value: 'umrah' },
      ],
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
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'basePrice', type: 'number', required: true, min: 0, admin: { description: 'Price in BDT (৳).' } },
    {
      name: 'duration',
      type: 'group',
      fields: [
        { name: 'days', type: 'number', min: 0 },
        { name: 'nights', type: 'number', min: 0 },
      ],
    },
    { name: 'destination', type: 'text' },
    { name: 'startLocation', type: 'text', defaultValue: 'Dhaka' },
    { name: 'overview', type: 'richText' },
    {
      name: 'info',
      type: 'group',
      label: 'Hotel / Flight / Food / Transport',
      fields: [
        { name: 'hotelInfo', type: 'textarea' },
        { name: 'flightInfo', type: 'textarea' },
        { name: 'foodInfo', type: 'textarea' },
        { name: 'transportInfo', type: 'textarea' },
      ],
    },
    { name: 'included', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'excluded', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        { name: 'day', type: 'number' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'highlights', type: 'array', fields: [{ name: 'label', type: 'text' }] },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    {
      name: 'ratingAvg',
      type: 'number',
      min: 0,
      max: 5,
      admin: { readOnly: true, position: 'sidebar', description: 'Derived from approved reviews.' },
    },
    seoField,
  ],
  timestamps: true,
}

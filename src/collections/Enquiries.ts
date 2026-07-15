import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isStaff } from '../access'

/**
 * Enquiries / leads (the admin "Call List"). Created by public forms
 * (hero widget, contact page, package CTA). Staff manage status + call notes.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'interestedCategory', 'status', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read: isStaff,
    create: anyone,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'package', type: 'relationship', relationTo: 'packages' },
    {
      name: 'interestedCategory',
      type: 'select',
      options: [
        { label: 'Tour', value: 'tour' },
        { label: 'Hajj', value: 'hajj' },
        { label: 'Umrah', value: 'umrah' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'travelMonth', type: 'text' },
    { name: 'travelers', type: 'number', min: 1 },
    { name: 'message', type: 'textarea' },
    { name: 'callNote', type: 'textarea', admin: { description: 'Internal staff note.' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Interested', value: 'interested' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled / Not Interested', value: 'cancelled' },
      ],
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'contact_form',
      options: [
        { label: 'Hero Widget', value: 'hero_widget' },
        { label: 'Contact Form', value: 'contact_form' },
        { label: 'Package Page', value: 'package_page' },
      ],
    },
  ],
  timestamps: true,
}

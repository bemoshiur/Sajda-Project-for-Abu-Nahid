import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '../access'

/**
 * Site-wide settings — company info, contact, social, invoicing, currency/FX.
 * Publicly readable (footer/header consume it); only admins can edit.
 */
export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'companyName', type: 'text', defaultValue: 'Sajda Travel & Tours Limited' },
            { name: 'tagline', type: 'text', defaultValue: 'Tour, Hajj & Umrah' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'address', type: 'textarea' },
            { name: 'businessHours', type: 'textarea' },
            {
              name: 'heroStats',
              type: 'group',
              fields: [
                { name: 'clientsCount', type: 'number', defaultValue: 40 },
                { name: 'clientsLabel', type: 'text', defaultValue: 'Trusted By 40+ Clients' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phones', type: 'array', fields: [{ name: 'phone', type: 'text' }] },
            { name: 'emails', type: 'array', fields: [{ name: 'email', type: 'text' }] },
            { name: 'whatsapp', type: 'text' },
            { name: 'googleMapEmbed', type: 'textarea', admin: { description: 'Google Maps embed URL.' } },
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                { name: 'facebook', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'twitter', type: 'text' },
                { name: 'linkedin', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Invoicing & Currency',
          fields: [
            { name: 'invoicePrefix', type: 'text', defaultValue: 'SAJ' },
            { name: 'invoiceFooterNote', type: 'textarea' },
            { name: 'baseCurrency', type: 'text', defaultValue: 'BDT' },
            {
              name: 'usdRate',
              type: 'number',
              defaultValue: 120,
              admin: { description: '1 USD = how many BDT (used for currency localization).' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoDefaults',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

import type { Payload } from 'payload'

export async function seedSettings(payload: Payload): Promise<void> {
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      companyName: 'Sajda Travel & Tours Limited',
      tagline: 'Tour, Hajj & Umrah',
      address: 'House 12, Road 5, Banani, Dhaka 1213, Bangladesh',
      businessHours: 'Sat–Thu, 10:00 AM – 8:00 PM',
      heroStats: { clientsCount: 40, clientsLabel: 'Trusted By 40+ Clients' },
      phones: [{ phone: '+880 1700-000000' }, { phone: '+880 1800-000000' }],
      emails: [{ email: 'info@sajdatravels.com' }, { email: 'support@sajdatravels.com' }],
      whatsapp: '+8801700000000',
      googleMapEmbed: 'https://maps.google.com/maps?q=Banani%20Dhaka&output=embed',
      socialLinks: {
        facebook: 'https://facebook.com/sajdatravels',
        instagram: 'https://instagram.com/sajdatravels',
        youtube: 'https://youtube.com/@sajdatravels',
      },
      invoicePrefix: 'SAJ',
      invoiceFooterNote: 'Thank you for travelling with Sajda Travel & Tours Limited.',
      baseCurrency: 'BDT',
      usdRate: 120,
      seoDefaults: {
        title: 'Sajda Travel & Tours — Tour, Hajj & Umrah Packages',
        description:
          'Book your Tour, Hajj or Umrah pilgrimage with trusted services & packages from Sajda Travel & Tours Limited.',
      },
    },
  })
  payload.logger.info('✔ Settings seeded')
}

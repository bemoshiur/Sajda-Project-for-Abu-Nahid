import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Customers } from './collections/Customers'
import { Packages } from './collections/Packages'
import { Departures } from './collections/Departures'
import { Bookings } from './collections/Bookings'
import { Payments } from './collections/Payments'
import { Invoices } from './collections/Invoices'
import { Enquiries } from './collections/Enquiries'
import { Suppliers } from './collections/Suppliers'
import { Reviews } from './collections/Reviews'
import { Posts } from './collections/Posts'
import { PrivateMedia } from './collections/PrivateMedia'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Fail fast on insecure / missing configuration rather than booting with empty secrets.
const secret = process.env.PAYLOAD_SECRET
if (!secret || secret.length < 32) {
  throw new Error('PAYLOAD_SECRET must be set to a 32+ character random value.')
}
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set.')
}

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  // Payload's built-in admin lives at /cms; the custom-designed admin owns /admin.
  routes: {
    admin: '/cms',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Sajda CMS',
    },
  },
  collections: [
    Users,
    Customers,
    Packages,
    Departures,
    Bookings,
    Payments,
    Invoices,
    Enquiries,
    Suppliers,
    Reviews,
    Posts,
    Media,
    PrivateMedia,
  ],
  globals: [Settings],
  editor: lexicalEditor(),
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),
  sharp,
  plugins: [
    // Vercel Blob storage — enabled only when a token is present (prod/preview).
    // Locally, uploads fall back to disk so dev works without a token.
    ...(blobToken
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: blobToken,
          }),
        ]
      : []),
  ],
})

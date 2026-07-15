import { getPayload } from 'payload'
import config from '../../payload.config'
import { seedAdmin } from './seedAdmin'
import { seedSettings } from './seedSettings'
import { seedCatalog } from './seedCatalog'
import { seedReviews } from './seedReviews'
import { seedPosts } from './seedPosts'

/**
 * Seed entrypoint — run with: `pnpm seed`
 * Uses top-level await so `payload run` waits for completion before exiting.
 * Every step is idempotent.
 */
const payload = await getPayload({ config: await config })

payload.logger.info('— Seeding Sajda —')
await seedAdmin(payload)
await seedSettings(payload)
await seedCatalog(payload)
await seedReviews(payload)
await seedPosts(payload)
payload.logger.info('— Seed complete —')

process.exit(0)

import { getPayload } from 'payload'
import config from '../../payload.config'
import { seedAdmin } from './seedAdmin'

/**
 * Seed entrypoint — run with: `pnpm seed`
 * Uses top-level await so `payload run` waits for completion before exiting.
 * (Later phases append package/departure/review/blog/settings seeding here.)
 */
const payload = await getPayload({ config: await config })

payload.logger.info('— Seeding Sajda —')
await seedAdmin(payload)
payload.logger.info('— Seed complete —')

process.exit(0)

import type { Payload } from 'payload'

/**
 * Upsert the first super-admin user from env (SEED_ADMIN_*).
 * Fails closed: requires explicit credentials, enforces a minimum password
 * length, and refuses to run in production unless ALLOW_PROD_SEED=1.
 * Idempotent — safe to run repeatedly.
 */
export async function seedAdmin(payload: Payload): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || 'Sajda Admin'

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to seed the super-admin.')
  }
  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters.')
  }
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== '1') {
    throw new Error('Refusing to seed in production. Set ALLOW_PROD_SEED=1 to override.')
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    payload.logger.info(`✔ Admin user already exists: ${email}`)
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name, role: 'superadmin', isActive: true },
  })

  payload.logger.info(`✔ Created super-admin: ${email}`)
}

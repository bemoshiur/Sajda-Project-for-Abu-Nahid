import type { Payload } from 'payload'

/**
 * Upsert the first super-admin user from env (SEED_ADMIN_*).
 * Idempotent — safe to run repeatedly.
 */
export async function seedAdmin(payload: Payload): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@sajda.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'change-me-strong-password'
  const name = process.env.SEED_ADMIN_NAME || 'Sajda Admin'

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

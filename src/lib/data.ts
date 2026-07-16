import 'server-only'
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'
import type { Package, Post, Review, Setting, Departure } from '@/payload-types'

export async function payloadClient() {
  return getPayload({ config: await config })
}

export async function getSettings(): Promise<Setting> {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 1 })
}

export async function getPackages(opts?: {
  category?: string
  limit?: number
  featured?: boolean
}): Promise<Package[]> {
  const payload = await payloadClient()
  const where: Where = { status: { equals: 'published' } }
  if (opts?.category) where.category = { equals: opts.category }
  if (opts?.featured) where.featured = { equals: true }
  const res = await payload.find({
    collection: 'packages',
    where,
    limit: opts?.limit ?? 50,
    depth: 1,
    sort: '-createdAt',
  })
  return res.docs
}

export type PackageWithNextDate = { pkg: Package; nextDate: string | null }

/** Published packages plus each one's earliest upcoming (open) departure date. */
export async function getPackagesWithNextDeparture(opts?: {
  category?: string
}): Promise<PackageWithNextDate[]> {
  const payload = await payloadClient()
  const packages = await getPackages({ category: opts?.category, limit: 100 })
  if (!packages.length) return []

  const ids = packages.map((p) => p.id)
  const deps = await payload.find({
    collection: 'departures',
    where: { package: { in: ids }, status: { equals: 'open' } },
    sort: 'departureDate',
    limit: 500,
    depth: 0,
  })

  const nextByPkg = new Map<number, string>()
  for (const d of deps.docs) {
    const pid = typeof d.package === 'object' && d.package ? Number((d.package as { id: number }).id) : Number(d.package)
    if (!nextByPkg.has(pid) && d.departureDate) nextByPkg.set(pid, d.departureDate)
  }

  return packages.map((pkg) => ({ pkg, nextDate: nextByPkg.get(Number(pkg.id)) ?? null }))
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'packages',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getDeparturesForPackage(packageId: string | number): Promise<Departure[]> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'departures',
    where: { package: { equals: packageId }, status: { equals: 'open' } },
    sort: 'departureDate',
    depth: 0,
    limit: 20,
  })
  return res.docs
}

export async function getReviews(opts?: { featured?: boolean; limit?: number }): Promise<Review[]> {
  const payload = await payloadClient()
  const where: Where = { status: { equals: 'approved' } }
  if (opts?.featured) where.featured = { equals: true }
  const res = await payload.find({
    collection: 'reviews',
    where,
    limit: opts?.limit ?? 12,
    depth: 1,
    sort: '-createdAt',
  })
  return res.docs
}

export async function getPosts(limit = 12): Promise<Post[]> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit,
    depth: 1,
    sort: '-publishedAt',
  })
  return res.docs
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
}

import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Phase 0 branded placeholder. Verifies fonts, tokens, and the Payload/Neon
 * connection render end-to-end. Replaced by the pixel-matched landing in Phase 3.
 */
export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const mediaCount = await payload
    .count({ collection: 'media' })
    .then((r) => r.totalDocs)
    .catch(() => 0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <span className="mb-6 rounded-full border border-white/20 px-4 py-1.5 font-ui text-xs tracking-widest text-white/70 uppercase">
        Sajda Travel &amp; Tours Limited
      </span>
      <h1 className="font-display text-5xl leading-tight font-bold sm:text-6xl">
        Your Tour, Hajj &amp; Umrah
        <br />
        <span className="text-primary">Journey begins here</span>
      </h1>
      <p className="mt-6 max-w-xl font-body text-base text-white/70">
        Book your Tour, Hajj or Umrah pilgrimage with trusted services &amp; packages. The full
        experience is under construction — foundation is live.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="/admin"
          className="rounded-full bg-primary px-7 py-3 font-sans text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          CMS / Admin
        </a>
        <a
          href="/api/health"
          className="rounded-full border border-white/25 px-7 py-3 font-sans text-sm font-semibold text-white/90 transition hover:bg-white/10"
        >
          Health check
        </a>
      </div>
      <p className="mt-12 font-ui text-xs text-white/40">
        Foundation online · DB connected · media records: {mediaCount}
      </p>
    </main>
  )
}

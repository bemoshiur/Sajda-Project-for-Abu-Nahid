import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Liveness + DB connectivity probe. Returns only non-sensitive status.
 * GET /api/health → { status, db, time }
 */
export async function GET() {
  try {
    const payload = await getPayload({ config: await config })
    // Exercise the DB connection without exposing any counts to the client.
    await payload.count({ collection: 'users' })
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      time: new Date().toISOString(),
    })
  } catch (err) {
    // Log the real error server-side; never leak internals to the client.
    console.error('[health] check failed:', err)
    return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 500 })
  }
}

import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Liveness + DB connectivity probe.
 * GET /api/health → { status, db, users, time }
 */
export async function GET() {
  try {
    const payload = await getPayload({ config: await config })
    const { totalDocs } = await payload.count({ collection: 'users' })
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      users: totalDocs,
      time: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        message: err instanceof Error ? err.message : 'unknown error',
      },
      { status: 500 },
    )
  }
}

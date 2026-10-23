import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Hit daily by Vercel Cron (vercel.json) so the free-tier Supabase project never idles into a pause
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('submissions').select('id', { head: true }).limit(1)

  if (error) {
    console.error('Keepalive error:', error.message)
    return NextResponse.json({ error: 'Supabase unreachable' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

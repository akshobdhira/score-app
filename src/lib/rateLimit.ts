import { NextRequest } from 'next/server'
import { createServiceClient } from './supabase'

export function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // non-browser call (Postman, curl) — not a CSRF risk
  const host = req.headers.get('host')
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ponytail: read-then-write, so a burst of concurrent requests can slip a few past
// the limit. Move the increment into a Postgres function (single UPDATE ... RETURNING)
// if abuse ever shows up in rate_limits.
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMinutes: number
): Promise<{ allowed: boolean }> {
  const supabase = createServiceClient()
  const now = new Date()
  const windowCutoff = new Date(now.getTime() - windowMinutes * 60 * 1000)

  const { data } = await supabase
    .from('rate_limits')
    .select('attempts, window_start')
    .eq('key', key)
    .maybeSingle()

  if (!data) {
    await supabase
      .from('rate_limits')
      .insert({ key, attempts: 1, window_start: now.toISOString() })
    return { allowed: true }
  }

  if (new Date(data.window_start) < windowCutoff) {
    // Window expired — reset the counter
    await supabase
      .from('rate_limits')
      .update({ attempts: 1, window_start: now.toISOString() })
      .eq('key', key)
    return { allowed: true }
  }

  if (data.attempts >= limit) {
    return { allowed: false }
  }

  await supabase
    .from('rate_limits')
    .update({ attempts: data.attempts + 1 })
    .eq('key', key)

  return { allowed: true }
}

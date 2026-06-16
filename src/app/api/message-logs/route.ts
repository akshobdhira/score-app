import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('message_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ logs: data })
  } catch (err) {
    console.error('Message logs fetch error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

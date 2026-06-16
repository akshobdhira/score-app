import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        bookings (
          parent_name,
          parent_mobile,
          parent_email,
          child_name,
          child_age,
          academic_challenges,
          career_goals,
          preferred_time_slot,
          additional_notes,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ submissions: data })
  } catch (err) {
    console.error('Submissions fetch error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

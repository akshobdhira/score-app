import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createServiceClient } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { ids } = await req.json() as { ids: string[] }
    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Delete bookings first (FK constraint: bookings.submission_id → submissions.id)
    const { error: bookingError } = await supabase
      .from('bookings')
      .delete()
      .in('submission_id', ids)

    if (bookingError) throw bookingError

    // Then delete the submissions
    const { error: submissionError } = await supabase
      .from('submissions')
      .delete()
      .in('id', ids)

    if (submissionError) throw submissionError

    await supabase.from('admin_audit_log').insert({
      action: 'delete_submissions',
      submission_ids: ids,
      performed_by: session.user?.name ?? session.user?.email ?? 'unknown',
    })

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (err) {
    console.error('Delete error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

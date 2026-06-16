import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { checkRateLimit, getIP, isValidOrigin } from '@/lib/rateLimit'
import { bookingSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getIP(req)
  const { allowed } = await checkRateLimit(`booking:${ip}`, 10, 5)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 5 minutes.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    const {
      submissionId,
      parentName,
      parentMobile,
      parentEmail,
      childName,
      childAge,
      academicChallenges,
      careerGoals,
      preferredTimeSlot,
      additionalNotes,
    } = parsed.data

    const supabase = createServiceClient()

    // Insert booking
    const { error: bookingError } = await supabase.from('bookings').insert({
      submission_id: submissionId,
      parent_name: parentName,
      parent_mobile: parentMobile,
      parent_email: parentEmail,
      child_name: childName,
      child_age: childAge,
      academic_challenges: academicChallenges,
      career_goals: careerGoals,
      preferred_time_slot: preferredTimeSlot,
      additional_notes: additionalNotes,
    })

    if (bookingError) throw bookingError

    // Mark submission as having a booking
    if (submissionId) {
      await supabase
        .from('submissions')
        .update({ has_booking: true })
        .eq('id', submissionId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
  }
}

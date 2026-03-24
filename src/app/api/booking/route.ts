import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
    } = body

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
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
  }
}

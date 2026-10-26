import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { checkRateLimit, getIP, isValidOrigin } from '@/lib/rateLimit'
import { initialSubmitSchema, updateChildSchema } from '@/lib/schemas'
import { calculateResults } from '@/lib/scoring'

// POST — called from assessment modal: saves parent contact + result, returns submissionId
export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getIP(req)
  const { allowed } = await checkRateLimit(`submit:${ip}`, 10, 5)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 5 minutes.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = initialSubmitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    const { parentName, parentMobile, parentEmail } = parsed.data
    const result = calculateResults(parsed.data.result.answers)

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        parent_name: parentName,
        parent_mobile: parentMobile,
        parent_email: parentEmail || null,
        total_score: result.totalScore,
        max_score: result.maxScore,
        percentage: result.percentage,
        profile_name: result.profile.name,
        profile_id: result.profile.id,
        category_scores: result.categoryScores,
        has_booking: false,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ submissionId: data.id })
  } catch (err) {
    console.error('Submit error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}

// PATCH — called from lead-capture: fills in child school details on existing submission
export async function PATCH(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { allowed } = await checkRateLimit(`submit-patch:${getIP(req)}`, 10, 5)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 5 minutes.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = updateChildSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    const { submissionId, childClass, childBoard } = parsed.data

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('submissions')
      .update({
        child_class: childClass,
        child_board: childBoard,
      })
      .eq('id', submissionId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Child update error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

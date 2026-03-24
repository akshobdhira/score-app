import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { childClass, childSchool, childBoard, result } = body

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        child_class: childClass,
        child_school: childSchool,
        child_board: childBoard,
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
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}

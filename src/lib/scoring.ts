import { AssessmentResult, CategoryScore } from '@/types'
import { questions, CATEGORIES, MIN_SCORE, SCORE_RANGE } from './questions'
import { getProfileByPercentage } from './profiles'

// Normalized scoring:
// percentage = ((totalScore - MIN_SCORE) / SCORE_RANGE) * 100
// This ensures: all 1s → 0%, all 5s → 100%

export function calculateResults(answers: Record<number, number>): AssessmentResult {
  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0)
  const maxScore = questions.length * 5 // 200
  const percentage = Math.round(((totalScore - MIN_SCORE) / SCORE_RANGE) * 100)
  const clampedPct = Math.max(0, Math.min(100, percentage))
  const profile = getProfileByPercentage(clampedPct)

  const categoryScores: CategoryScore[] = CATEGORIES.map((category) => {
    const catQuestions = questions.filter((q) => q.category === category)
    const catScore = catQuestions.reduce(
      (sum, q) => sum + (answers[q.id] ?? 1),
      0
    )
    const catMin = catQuestions.length * 1
    const catMax = catQuestions.length * 5
    const catRange = catMax - catMin
    const catPct = catRange > 0
      ? Math.round(((catScore - catMin) / catRange) * 100)
      : 0

    return {
      category,
      score: catScore,
      maxScore: catMax,
      percentage: Math.max(0, Math.min(100, catPct)),
    }
  })

  return {
    answers,
    totalScore,
    maxScore,
    percentage: clampedPct,
    profile,
    categoryScores,
  }
}

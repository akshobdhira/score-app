export type QuestionCategory =
  | 'Guidance & Communication'
  | 'Awareness & Exposure'
  | 'Engagement & Support Habits'
  | 'Planning & Financial Readiness'
  | 'Mindset & Adaptability'

export interface AnswerOption {
  text: string
  score: 1 | 2.5 | 5
}

export interface Question {
  id: number
  category: QuestionCategory
  text: string
  options: AnswerOption[]
}

export interface CategoryScore {
  category: QuestionCategory
  score: number
  maxScore: number
  percentage: number
}

export interface ParentingProfile {
  id: string
  name: string
  description: string
  strengths: string[]
  improvements: string[]
  minPercentage: number
  maxPercentage: number
}

export interface AssessmentResult {
  answers: Record<number, number>
  totalScore: number
  maxScore: number
  percentage: number
  profile: ParentingProfile
  categoryScores: CategoryScore[]
}

export interface LeadData {
  childClass: string
  childSchool: string
  childBoard: string
}

export interface BookingData {
  parentName: string
  parentMobile: string
  parentEmail: string
  childName: string
  childAge: string
  academicChallenges: string
  careerGoals: string
  preferredTimeSlot: string
  additionalNotes: string
}

export interface Submission {
  id: string
  created_at: string
  child_class: string
  child_school: string
  child_board: string
  total_score: number
  max_score: number
  percentage: number
  profile_name: string
  category_scores: CategoryScore[]
  has_booking: boolean
}

export interface Booking {
  id: string
  created_at: string
  submission_id: string
  parent_name: string
  parent_mobile: string
  parent_email: string
  child_name: string
  child_age: string
  academic_challenges: string
  career_goals: string
  preferred_time_slot: string
  additional_notes: string
}

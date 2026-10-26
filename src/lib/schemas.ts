import { z } from 'zod'
import { questions } from './questions'

const CLASS_OPTIONS = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] as const
const BOARD_OPTIONS = ['CBSE', 'ICSE', 'IB', 'Cambridge (IGCSE)', 'State Board', 'Other'] as const
const INDIAN_MOBILE = /^[6-9]\d{9}$/

// Only the raw answers are trusted — the server recomputes every score from them
const answersSchema = z
  .record(z.string(), z.union([z.literal(1), z.literal(2.5), z.literal(5)]))
  .refine(
    (a) => Object.keys(a).length === questions.length && questions.every((q) => String(q.id) in a),
    'Every question must be answered exactly once'
  )

// Initial submit: parent contact info + assessment answers (no child info yet)
export const initialSubmitSchema = z.object({
  parentName: z.string().trim().min(1).max(100),
  parentMobile: z.string().regex(INDIAN_MOBILE, 'Must be a valid 10-digit Indian mobile'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  result: z.object({ answers: answersSchema }),
})

// Child info update: called from lead-capture to fill in school details
export const updateChildSchema = z.object({
  submissionId: z.string().uuid(),
  childClass: z.enum(CLASS_OPTIONS),
  childBoard: z.enum(BOARD_OPTIONS),
})

export const bookingSchema = z.object({
  submissionId: z.string().uuid().nullable().optional(),
  parentName: z.string().trim().min(1).max(100),
  parentMobile: z.string().regex(INDIAN_MOBILE, 'Must be a valid 10-digit Indian mobile'),
  parentEmail: z.string().email(),
  childName: z.string().trim().min(1).max(100),
  childAge: z.string().trim().min(1).max(10),
  academicChallenges: z.string().trim().min(1).max(1000),
  careerGoals: z.string().trim().min(1).max(1000),
  preferredTimeSlot: z.string().optional().default('Via Calendly'),
  additionalNotes: z.string().max(1000).optional().default(''),
})

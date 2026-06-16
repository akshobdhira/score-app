import { z } from 'zod'

const CLASS_OPTIONS = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] as const
const BOARD_OPTIONS = ['CBSE', 'ICSE', 'IB', 'Cambridge (IGCSE)', 'State Board', 'Other'] as const
const TIME_SLOTS = [
  'Weekday Morning (9am–12pm)',
  'Weekday Afternoon (12pm–4pm)',
  'Weekday Evening (6pm–9pm)',
  'Weekend Morning (9am–12pm)',
  'Weekend Afternoon (12pm–4pm)',
] as const

const resultSchema = z.object({
  totalScore: z.number().min(40).max(200),
  maxScore: z.number().min(1),
  percentage: z.number().min(0).max(100),
  profile: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
  }),
  categoryScores: z.array(
    z.object({
      category: z.string().min(1),
      score: z.number(),
      maxScore: z.number(),
      percentage: z.number().min(0).max(100),
    })
  ).length(5),
  answers: z.record(z.string(), z.number()),
})

// Initial submit: parent contact info + assessment result (no child info yet)
export const initialSubmitSchema = z.object({
  parentName: z.string().trim().min(1).max(100),
  parentMobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  result: resultSchema,
})

// Child info update: called from lead-capture to fill in school details
export const updateChildSchema = z.object({
  submissionId: z.string().uuid(),
  childClass: z.enum(CLASS_OPTIONS),
  childBoard: z.enum(BOARD_OPTIONS),
})

// Legacy alias kept so any direct import of submitSchema still works
export const submitSchema = z.object({
  childClass: z.enum(CLASS_OPTIONS),
  childSchool: z.string().trim().min(1).max(200),
  childBoard: z.enum(BOARD_OPTIONS),
  result: resultSchema,
})

export const bookingSchema = z.object({
  submissionId: z.string().uuid().nullable().optional(),
  parentName: z.string().trim().min(1).max(100),
  parentMobile: z.string().regex(/^\d{10}$/, 'Must be a 10-digit number'),
  parentEmail: z.string().email(),
  childName: z.string().trim().min(1).max(100),
  childAge: z.string().trim().min(1).max(10),
  academicChallenges: z.string().trim().min(1).max(1000),
  careerGoals: z.string().trim().min(1).max(1000),
  preferredTimeSlot: z.string().optional().default('Via Calendly'),
  additionalNotes: z.string().max(1000).optional().default(''),
})

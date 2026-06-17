import { Question } from '@/types'

// 40 questions across 5 categories (scores: 1, 2.5, 5)

export const questions: Question[] = [
  // ── Guidance & Communication (8 questions) ───────────────────────────────
  {
    id: 1,
    category: 'Guidance & Communication',
    text: 'How often do you talk calmly with your child about their future?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },
  {
    id: 2,
    category: 'Guidance & Communication',
    text: 'When your child shares a career idea, what do you usually do first?',
    options: [
      { text: 'I give my opinion quickly', score: 1 },
      { text: 'I listen a little, then advise', score: 2.5 },
      { text: 'I will understand fully', score: 5 },
    ],
  },
  {
    id: 3,
    category: 'Guidance & Communication',
    text: 'How comfortable is your child discussing career worries with you?',
    options: [
      { text: 'Not comfortable', score: 1 },
      { text: 'Somewhat comfortable', score: 2.5 },
      { text: 'Very comfortable', score: 5 },
    ],
  },
  {
    id: 4,
    category: 'Guidance & Communication',
    text: 'How clear are you and your child about who decides what in study choices?',
    options: [
      { text: 'Not clear', score: 1 },
      { text: 'Somewhat clear', score: 2.5 },
      { text: 'Very clear', score: 5 },
    ],
  },
  {
    id: 5,
    category: 'Guidance & Communication',
    text: 'In your family, how consistent is the message around your child\'s career choices?',
    options: [
      { text: 'Often mixed', score: 1 },
      { text: 'Sometimes mixed', score: 2.5 },
      { text: 'Mostly consistent', score: 5 },
    ],
  },
  {
    id: 6,
    category: 'Guidance & Communication',
    text: 'When you and your child disagree about studies or career, how do talks usually end?',
    options: [
      { text: 'Tense and unresolved', score: 1 },
      { text: 'Resolved after some time', score: 2.5 },
      { text: 'Calm and constructive', score: 5 },
    ],
  },
  {
    id: 7,
    category: 'Guidance & Communication',
    text: 'How often do you ask your child questions to understand before suggesting a solution?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Most of the time', score: 5 },
    ],
  },
  {
    id: 8,
    category: 'Guidance & Communication',
    text: 'Does your child come to you on their own to discuss school or career matters?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },

  // ── Awareness & Exposure (8 questions) ───────────────────────────────────
  {
    id: 9,
    category: 'Awareness & Exposure',
    text: 'Do you and your child explore different career options together?',
    options: [
      { text: 'Occasionally', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 10,
    category: 'Awareness & Exposure',
    text: 'How updated are you about new-age career paths and skills?',
    options: [
      { text: 'Not much', score: 1 },
      { text: 'A little', score: 2.5 },
      { text: 'Quite good', score: 5 },
    ],
  },
  {
    id: 11,
    category: 'Awareness & Exposure',
    text: 'Do you share useful career information with your child?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 12,
    category: 'Awareness & Exposure',
    text: 'Has your child had chances to hear from people working in different domains?',
    options: [
      { text: 'Not yet', score: 1 },
      { text: 'Once or twice', score: 2.5 },
      { text: 'Many times', score: 5 },
    ],
  },
  {
    id: 13,
    category: 'Awareness & Exposure',
    text: 'How often do you share what different jobs are really like in real life?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },
  {
    id: 14,
    category: 'Awareness & Exposure',
    text: 'How much exposure has your child had to colleges, courses, or career events?',
    options: [
      { text: 'Very little', score: 1 },
      { text: 'Some exposure', score: 2.5 },
      { text: 'Good exposure', score: 5 },
    ],
  },
  {
    id: 15,
    category: 'Awareness & Exposure',
    text: 'Do conversations at home include changing career trends due to Artificial Intelligence?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },
  {
    id: 16,
    category: 'Awareness & Exposure',
    text: 'Do you actively encourage your child to learn about careers beyond the usual options?',
    options: [
      { text: 'No', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },

  // ── Engagement & Support Habits (8 questions) ────────────────────────────
  {
    id: 17,
    category: 'Engagement & Support Habits',
    text: 'Does your child have a regular place or time to study at home?',
    options: [
      { text: 'Not really', score: 1 },
      { text: 'Somewhat', score: 2.5 },
      { text: 'Yes, clearly', score: 5 },
    ],
  },
  {
    id: 18,
    category: 'Engagement & Support Habits',
    text: 'Do you help your child keep a healthy balance between study and rest?',
    options: [
      { text: 'Very little', score: 1 },
      { text: 'Somewhat', score: 2.5 },
      { text: 'A lot', score: 5 },
    ],
  },
  {
    id: 19,
    category: 'Engagement & Support Habits',
    text: 'When your child feels stuck, how quickly do you help them find support?',
    options: [
      { text: 'It depends', score: 1 },
      { text: 'After some time', score: 2.5 },
      { text: 'Quickly', score: 5 },
    ],
  },
  {
    id: 20,
    category: 'Engagement & Support Habits',
    text: 'Do you notice and talk about your child\'s stress or mood?',
    options: [
      { text: 'Sometimes', score: 1 },
      { text: 'Only when important', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },
  {
    id: 21,
    category: 'Engagement & Support Habits',
    text: 'How often do you model healthy phone or screen habits at home?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Consistently', score: 5 },
    ],
  },
  {
    id: 22,
    category: 'Engagement & Support Habits',
    text: 'Do you encourage your child to take part in projects and competitions?',
    options: [
      { text: 'No compulsion', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },
  {
    id: 23,
    category: 'Engagement & Support Habits',
    text: 'Do you review school feedback with your child and discuss next steps?',
    options: [
      { text: 'Not much', score: 1 },
      { text: 'Teachers care', score: 2.5 },
      { text: 'Every term', score: 5 },
    ],
  },
  {
    id: 24,
    category: 'Engagement & Support Habits',
    text: 'Do you check in on your child\'s personality and interests?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },

  // ── Planning & Financial Readiness (8 questions) ─────────────────────────
  {
    id: 25,
    category: 'Planning & Financial Readiness',
    text: 'How clear are you about the cost of the college education your child is considering?',
    options: [
      { text: 'Not clear', score: 1 },
      { text: 'Somewhat clear', score: 2.5 },
      { text: 'Very clear', score: 5 },
    ],
  },
  {
    id: 26,
    category: 'Planning & Financial Readiness',
    text: 'Have you set aside money for your child\'s future education or skill development?',
    options: [
      { text: 'Not yet', score: 1 },
      { text: 'A little', score: 2.5 },
      { text: 'Yes', score: 5 },
    ],
  },
  {
    id: 27,
    category: 'Planning & Financial Readiness',
    text: 'How aware are you of scholarships, grants and financial support options?',
    options: [
      { text: 'Not aware', score: 1 },
      { text: 'Somewhat aware', score: 2.5 },
      { text: 'Very aware', score: 5 },
    ],
  },
  {
    id: 28,
    category: 'Planning & Financial Readiness',
    text: 'Before paying for a course, how do you check whether it is worth the cost?',
    options: [
      { text: 'Google', score: 1 },
      { text: 'Family / Friends', score: 2.5 },
      { text: 'Alumni', score: 5 },
    ],
  },
  {
    id: 29,
    category: 'Planning & Financial Readiness',
    text: 'If your child\'s first plan does not work out, how prepared are you with alternative options?',
    options: [
      { text: 'Not prepared', score: 1 },
      { text: 'Somewhat prepared', score: 2.5 },
      { text: 'Well prepared', score: 5 },
    ],
  },
  {
    id: 30,
    category: 'Planning & Financial Readiness',
    text: 'Do you compare different education options before making a financial decision?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 31,
    category: 'Planning & Financial Readiness',
    text: 'How comfortable are you discussing money limits with your child honestly?',
    options: [
      { text: 'Not comfortable', score: 1 },
      { text: 'Somewhat comfortable', score: 2.5 },
      { text: 'Very comfortable', score: 5 },
    ],
  },
  {
    id: 32,
    category: 'Planning & Financial Readiness',
    text: 'How planned is your family when it comes to sending your child to study in other states?',
    options: [
      { text: 'Not planned', score: 1 },
      { text: 'Partly planned', score: 2.5 },
      { text: 'Well planned', score: 5 },
    ],
  },

  // ── Mindset & Adaptability (8 questions) ─────────────────────────────────
  {
    id: 33,
    category: 'Mindset & Adaptability',
    text: 'When your child faces failure, how do you usually respond?',
    options: [
      { text: 'With criticism', score: 1 },
      { text: 'With advice', score: 2.5 },
      { text: 'With a solution', score: 5 },
    ],
  },
  {
    id: 34,
    category: 'Mindset & Adaptability',
    text: 'Do you encourage your child to gain real world experiences?',
    options: [
      { text: 'If time permits', score: 1 },
      { text: 'During vacations', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 35,
    category: 'Mindset & Adaptability',
    text: 'How open are you if your child prefers a less traditional career path?',
    options: [
      { text: 'Don\'t want risk', score: 1 },
      { text: 'Somewhat open', score: 2.5 },
      { text: 'Very open', score: 5 },
    ],
  },
  {
    id: 36,
    category: 'Mindset & Adaptability',
    text: 'How often do you update your own understanding of education and careers?',
    options: [
      { text: 'No time', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 37,
    category: 'Mindset & Adaptability',
    text: 'When unsure, how willing are you to ask for reliable advice?',
    options: [
      { text: 'I have clarity', score: 1 },
      { text: 'It depends', score: 2.5 },
      { text: 'Seek experts', score: 5 },
    ],
  },
  {
    id: 38,
    category: 'Mindset & Adaptability',
    text: 'At home, what gets valued more in your child\'s growth?',
    options: [
      { text: 'Academic results', score: 1 },
      { text: 'Both', score: 2.5 },
      { text: 'Goals & pathways', score: 5 },
    ],
  },
  {
    id: 39,
    category: 'Mindset & Adaptability',
    text: 'When new information comes up, do you rethink the plan?',
    options: [
      { text: 'Already planned', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Yes', score: 5 },
    ],
  },
  {
    id: 40,
    category: 'Mindset & Adaptability',
    text: 'Do you learn new things alongside your child when planning their future?',
    options: [
      { text: 'No time', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
]

export const TOTAL_QUESTIONS = questions.length // 40
export const MIN_SCORE = TOTAL_QUESTIONS * 1     // 40
export const MAX_SCORE = TOTAL_QUESTIONS * 5     // 200
export const SCORE_RANGE = MAX_SCORE - MIN_SCORE // 160

export const CATEGORIES = [
  'Guidance & Communication',
  'Awareness & Exposure',
  'Engagement & Support Habits',
  'Planning & Financial Readiness',
  'Mindset & Adaptability',
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  'Guidance & Communication': '#2980B9',
  'Awareness & Exposure': '#E94560',
  'Engagement & Support Habits': '#2980B9',
  'Planning & Financial Readiness': '#E94560',
  'Mindset & Adaptability': '#2980B9',
}

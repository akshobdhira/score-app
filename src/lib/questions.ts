import { Question } from '@/types'

// 40 questions across 5 categories (scores: 1, 2.5, 5)

export const questions: Question[] = [
  // ── Guidance & Communication (8 questions) ───────────────────────────────
  {
    id: 1,
    category: 'Guidance & Communication',
    text: 'How often do you set aside uninterrupted time to talk about your child\'s future?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Monthly', score: 2.5 },
      { text: 'Weekly', score: 5 },
    ],
  },
  {
    id: 2,
    category: 'Guidance & Communication',
    text: 'When your child shares a career idea, how much do you listen before advising?',
    options: [
      { text: 'Answer first', score: 1 },
      { text: 'Balance both', score: 2.5 },
      { text: 'Listen fully', score: 5 },
    ],
  },
  {
    id: 3,
    category: 'Guidance & Communication',
    text: 'How clearly have you and your child agreed on who makes the final study decisions?',
    options: [
      { text: 'Not discussed', score: 1 },
      { text: 'Vaguely discussed', score: 2.5 },
      { text: 'Crystal clear roles', score: 5 },
    ],
  },
  {
    id: 4,
    category: 'Guidance & Communication',
    text: 'Do family members present a united message about career choices?',
    options: [
      { text: 'Often contradict', score: 1 },
      { text: 'Occasionally differ', score: 2.5 },
      { text: 'Always align', score: 5 },
    ],
  },
  {
    id: 5,
    category: 'Guidance & Communication',
    text: 'How comfortable is your child asking you for help with school/career topics?',
    options: [
      { text: 'Hesitant', score: 1 },
      { text: 'Somewhat comfortable', score: 2.5 },
      { text: 'Very comfortable', score: 5 },
    ],
  },
  {
    id: 6,
    category: 'Guidance & Communication',
    text: 'How regularly do you celebrate small academic or skill wins together?',
    options: [
      { text: 'Seldom', score: 1 },
      { text: 'When reminded', score: 2.5 },
      { text: 'Consistently', score: 5 },
    ],
  },
  {
    id: 7,
    category: 'Guidance & Communication',
    text: 'When disagreements arise, how quickly do you reach a calm resolution?',
    options: [
      { text: 'It drags on', score: 1 },
      { text: 'Within a day', score: 2.5 },
      { text: 'Within the hour', score: 5 },
    ],
  },
  {
    id: 8,
    category: 'Guidance & Communication',
    text: 'Do you use open-ended questions (e.g. "What excites you about a job?") more than directives?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'About half', score: 2.5 },
      { text: 'Almost always', score: 5 },
    ],
  },

  // ── Awareness & Exposure (8 questions) ───────────────────────────────────
  {
    id: 9,
    category: 'Awareness & Exposure',
    text: 'In the past six months, how many new career fields have you explored together?',
    options: [
      { text: 'None', score: 1 },
      { text: 'One or two', score: 2.5 },
      { text: 'Three+', score: 5 },
    ],
  },
  {
    id: 10,
    category: 'Awareness & Exposure',
    text: 'How often do you share news articles or videos about future work trends?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Regularly', score: 5 },
    ],
  },
  {
    id: 11,
    category: 'Awareness & Exposure',
    text: 'Have you arranged industry visits, webinars, or job shadowing for your child?',
    options: [
      { text: 'Not yet', score: 1 },
      { text: 'One experience', score: 2.5 },
      { text: 'Multiple experiences', score: 5 },
    ],
  },
  {
    id: 12,
    category: 'Awareness & Exposure',
    text: 'Do you personally follow thought leaders or pages on emerging careers?',
    options: [
      { text: 'No', score: 1 },
      { text: 'A few', score: 2.5 },
      { text: 'Several', score: 5 },
    ],
  },
  {
    id: 13,
    category: 'Awareness & Exposure',
    text: 'How many professionals has your teen interviewed?',
    options: [
      { text: '0', score: 1 },
      { text: '1 or 2', score: 2.5 },
      { text: '3+', score: 5 },
    ],
  },
  {
    id: 14,
    category: 'Awareness & Exposure',
    text: 'Does your child\'s bookshelf/feed include biographies of diverse achievers?',
    options: [
      { text: 'None', score: 1 },
      { text: 'A couple', score: 2.5 },
      { text: 'Well-curated set', score: 5 },
    ],
  },
  {
    id: 15,
    category: 'Awareness & Exposure',
    text: 'Have you visited at least one college campus together in the last year?',
    options: [
      { text: 'No', score: 1 },
      { text: 'One visit', score: 2.5 },
      { text: 'Multiple campuses', score: 5 },
    ],
  },
  {
    id: 16,
    category: 'Awareness & Exposure',
    text: 'Do dinner table conversations feature global challenges/trends (AI, climate, etc.)?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Often', score: 5 },
    ],
  },

  // ── Engagement & Support Habits (8 questions) ────────────────────────────
  {
    id: 17,
    category: 'Engagement & Support Habits',
    text: 'How consistently do you monitor academic deadlines without micromanaging?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'When prompted', score: 2.5 },
      { text: 'Proactively yet lightly', score: 5 },
    ],
  },
  {
    id: 18,
    category: 'Engagement & Support Habits',
    text: 'Does your home have a designated, distraction-free study space?',
    options: [
      { text: 'No', score: 1 },
      { text: 'Sort of', score: 2.5 },
      { text: 'Yes, well equipped', score: 5 },
    ],
  },
  {
    id: 19,
    category: 'Engagement & Support Habits',
    text: 'How balanced is your child\'s weekly schedule (study, hobbies, rest)?',
    options: [
      { text: 'Random', score: 1 },
      { text: 'Somewhat balanced', score: 2.5 },
      { text: 'Well balanced', score: 5 },
    ],
  },
  {
    id: 20,
    category: 'Engagement & Support Habits',
    text: 'When your child feels stuck, how quickly do you help find resources or mentors?',
    options: [
      { text: 'Rarely/late', score: 1 },
      { text: 'After a while', score: 2.5 },
      { text: 'Promptly', score: 5 },
    ],
  },
  {
    id: 21,
    category: 'Engagement & Support Habits',
    text: 'Do you track and discuss your child\'s mental wellbeing signals?',
    options: [
      { text: 'Not really', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Actively', score: 5 },
    ],
  },
  {
    id: 22,
    category: 'Engagement & Support Habits',
    text: 'How often do you model healthy digital habits?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Consistently', score: 5 },
    ],
  },
  {
    id: 23,
    category: 'Engagement & Support Habits',
    text: 'Have you encouraged at least one passion project or competition this year?',
    options: [
      { text: 'Not yet', score: 1 },
      { text: 'One', score: 2.5 },
      { text: 'Several', score: 5 },
    ],
  },
  {
    id: 24,
    category: 'Engagement & Support Habits',
    text: 'Do you jointly review school feedback and set improvement steps?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Once a term', score: 2.5 },
      { text: 'After every assessment', score: 5 },
    ],
  },

  // ── Planning & Financial Readiness (8 questions) ─────────────────────────
  {
    id: 25,
    category: 'Planning & Financial Readiness',
    text: 'Do you know estimated costs for your child\'s top three study paths?',
    options: [
      { text: 'No idea', score: 1 },
      { text: 'Rough figures', score: 2.5 },
      { text: 'Detailed numbers', score: 5 },
    ],
  },
  {
    id: 26,
    category: 'Planning & Financial Readiness',
    text: 'Have you planned for a dedicated education or skill-building fund?',
    options: [
      { text: 'Not yet', score: 1 },
      { text: 'Small savings', score: 2.5 },
      { text: 'Structured plan', score: 5 },
    ],
  },
  {
    id: 27,
    category: 'Planning & Financial Readiness',
    text: 'How updated are you on scholarship or financial aid opportunities?',
    options: [
      { text: 'Unaware', score: 1 },
      { text: 'Somewhat aware', score: 2.5 },
      { text: 'Actively tracking', score: 5 },
    ],
  },
  {
    id: 28,
    category: 'Planning & Financial Readiness',
    text: 'Do you compare ROI before committing to courses?',
    options: [
      { text: 'Seldom', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Always', score: 5 },
    ],
  },
  {
    id: 29,
    category: 'Planning & Financial Readiness',
    text: 'Have you mapped backup options if the first career plan changes?',
    options: [
      { text: 'No', score: 1 },
      { text: 'Loose ideas', score: 2.5 },
      { text: 'Clear Plan B/C', score: 5 },
    ],
  },
  {
    id: 30,
    category: 'Planning & Financial Readiness',
    text: 'Are you leveraging education loans, grants, or tax benefits effectively?',
    options: [
      { text: 'Not considered', score: 1 },
      { text: 'Somewhat used', score: 2.5 },
      { text: 'Fully optimized', score: 5 },
    ],
  },
  {
    id: 31,
    category: 'Planning & Financial Readiness',
    text: 'How comfortable are you discussing money choices openly with your child?',
    options: [
      { text: 'Avoid it', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Very transparent', score: 5 },
    ],
  },
  {
    id: 32,
    category: 'Planning & Financial Readiness',
    text: 'Do you compare your budget between study abroad and Indian institutions?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Every year', score: 5 },
    ],
  },

  // ── Mindset & Adaptability (8 questions) ─────────────────────────────────
  {
    id: 33,
    category: 'Mindset & Adaptability',
    text: 'When your child fails at something, how do you frame it?',
    options: [
      { text: 'Critically', score: 1 },
      { text: 'Soft encouragement', score: 2.5 },
      { text: 'Growth lesson', score: 5 },
    ],
  },
  {
    id: 34,
    category: 'Mindset & Adaptability',
    text: 'Do you encourage experimentation (hackathons, workshops, internships)?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Enthusiastically', score: 5 },
    ],
  },
  {
    id: 35,
    category: 'Mindset & Adaptability',
    text: 'How comfortable are you with your child choosing an unconventional path?',
    options: [
      { text: 'Very uneasy', score: 1 },
      { text: 'Somewhat open', score: 2.5 },
      { text: 'Embrace it', score: 5 },
    ],
  },
  {
    id: 36,
    category: 'Mindset & Adaptability',
    text: 'Do you personally invest in learning to stay ahead?',
    options: [
      { text: 'Not currently', score: 1 },
      { text: 'Occasionally', score: 2.5 },
      { text: 'Continuously', score: 5 },
    ],
  },
  {
    id: 37,
    category: 'Mindset & Adaptability',
    text: 'How willing are you to seek professional guidance when unsure?',
    options: [
      { text: 'Prefer DIY', score: 1 },
      { text: 'Consider it', score: 2.5 },
      { text: 'Actively seek experts', score: 5 },
    ],
  },
  {
    id: 38,
    category: 'Mindset & Adaptability',
    text: 'Does your household celebrate effort as much as results?',
    options: [
      { text: 'Mostly results', score: 1 },
      { text: 'Mixed', score: 2.5 },
      { text: 'Effort first', score: 5 },
    ],
  },
  {
    id: 39,
    category: 'Mindset & Adaptability',
    text: 'How quickly do you adapt plans when new data arises?',
    options: [
      { text: 'Slow to shift', score: 1 },
      { text: 'Moderate', score: 2.5 },
      { text: 'Very agile', score: 5 },
    ],
  },
  {
    id: 40,
    category: 'Mindset & Adaptability',
    text: 'Do you set personal learning goals alongside your child each year?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Sometimes', score: 2.5 },
      { text: 'Absolutely', score: 5 },
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

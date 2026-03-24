import { ParentingProfile } from '@/types'

export const profiles: ParentingProfile[] = [
  {
    id: 'outsourced-observer',
    name: 'Outsourced Observer',
    description:
      'You are at the very beginning of your career-guidance journey. Right now, most of the responsibility for your child\'s career direction has been handed off to others — teachers, tutors, or circumstance. The good news? Awareness is the first step to change, and you\'ve already taken it by completing this assessment.',
    strengths: [
      'Taking the first step by assessing yourself',
      'Openness to understanding your role',
      'Your child\'s future is still wide open to influence',
    ],
    improvements: [
      'Start having regular, open conversations with your child about their interests',
      'Research basic career options available in your child\'s areas of curiosity',
      'Consider booking a consultation to get a structured plan in place',
    ],
    minPercentage: 0,
    maxPercentage: 20,
  },
  {
    id: 'reactive-rescuer',
    name: 'Reactive Rescuer',
    description:
      'You step in when things go wrong, but your involvement in your child\'s career journey tends to be reactive rather than proactive. You care deeply — but your engagement is driven by crisis rather than strategy. With a more consistent and planned approach, you can shift from rescuing to truly guiding.',
    strengths: [
      'You are present and responsive when your child needs you',
      'You have a basic awareness of the career landscape',
      'Your child knows you\'re in their corner',
    ],
    improvements: [
      'Move from reactive to proactive — schedule regular career check-ins',
      'Build your knowledge of emerging career trends and education pathways',
      'Create a simple career roadmap with your child for the next 1–2 years',
    ],
    minPercentage: 21,
    maxPercentage: 50,
  },
  {
    id: 'performance-pusher',
    name: 'Performance Pusher',
    description:
      'You are engaged and invested in your child\'s success — but your focus may be more on performance metrics (marks, ranks, scores) than on long-term career alignment. You\'re doing a lot right, but shifting from pushing performance to guiding purpose will make a transformational difference.',
    strengths: [
      'Strong involvement in your child\'s academic journey',
      'High standards and accountability',
      'Consistent presence and investment in your child\'s future',
    ],
    improvements: [
      'Balance academic pressure with conversations about passion and purpose',
      'Explore careers that align with your child\'s strengths, not just scores',
      'Learn to measure success beyond ranks — skills, exposure, and confidence matter',
    ],
    minPercentage: 51,
    maxPercentage: 70,
  },
  {
    id: 'concerned-companion',
    name: 'Concerned Companion',
    description:
      'You are a genuinely engaged and caring guide. You\'re deeply involved, well-informed, and have built a strong relationship with your child around their future. A few strategic refinements — particularly around structured planning and professional support — will take you to the very top.',
    strengths: [
      'Deep, open communication with your child about their future',
      'Strong awareness of career trends, college pathways, and education options',
      'Consistent, proactive involvement in your child\'s academic and personal growth',
    ],
    improvements: [
      'Formalise your approach with a written roadmap and milestones',
      'Deepen your financial planning for higher education',
      'Engage professional career counselling to add expert structure to your guidance',
    ],
    minPercentage: 71,
    maxPercentage: 90,
  },
  {
    id: 'struggling-strategist',
    name: 'Struggling Strategist',
    description:
      'You\'re operating at a very high level — you have the knowledge, the intent, and the systems. But being this close to the top often brings its own challenges: overthinking, over-planning, or struggling to let your child own their journey. Fine-tuning your approach will take you all the way.',
    strengths: [
      'Exceptional strategic awareness and planning capability',
      'High level of knowledge about careers, colleges, and pathways',
      'Strong, structured approach to guiding your child\'s future',
    ],
    improvements: [
      'Practice giving your child more ownership and autonomy in decisions',
      'Balance strategy with emotional connection — let your child lead sometimes',
      'Share your learnings with your community — you have a lot to offer others',
    ],
    minPercentage: 91,
    maxPercentage: 95,
  },
  {
    id: 'impact-maker',
    name: 'Impact Maker',
    description:
      'You are an exemplary career-guidance parent — operating at the highest level of awareness, engagement, and strategic thinking. You are not just guiding your child; you are shaping a future leader. Your child is fortunate to have a parent who is this intentional, informed, and involved.',
    strengths: [
      'Mastery-level awareness of career trends, education pathways, and opportunities',
      'Deeply structured, proactive, and consistent career guidance',
      'A powerful, trust-based partnership with your child around their future',
    ],
    improvements: [
      'Continue evolving — the career landscape changes rapidly',
      'Mentor other parents in your community who are earlier in this journey',
      'Stay attuned to your child\'s evolving identity — even impact makers must adapt',
    ],
    minPercentage: 96,
    maxPercentage: 100,
  },
]

export function getProfileByPercentage(percentage: number): ParentingProfile {
  return (
    profiles.find(
      (p) => percentage >= p.minPercentage && percentage <= p.maxPercentage
    ) ?? profiles[0]
  )
}

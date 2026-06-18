'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { calculateResults } from '@/lib/scoring'
import { profiles } from '@/lib/profiles'
import { AssessmentResult } from '@/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getBarColor(pct: number): string {
  if (pct < 40) return '#E74C3C'
  if (pct < 60) return '#F39C12'
  if (pct < 75) return '#2980B9'
  return '#27AE60'
}

function getStrengthLabel(pct: number): string {
  if (pct < 40) return 'Low Strength'
  if (pct < 60) return 'Low to Average'
  if (pct < 75) return 'Average to High'
  return 'High Strength'
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Guidance & Communication': 'How well you communicate and guide your child',
  'Awareness & Exposure': 'How much career exposure you provide your child',
  'Engagement & Support Habits': 'How actively engaged you are in their journey',
  'Planning & Financial Readiness': 'How prepared you are for your child\'s future costs',
  'Mindset & Adaptability': 'How confidently and flexibly you guide their future',
}

// ─── Speedometer SVG ────────────────────────────────────────────────────────

function Speedometer({ score, profileName }: { score: number; profileName: string }) {
  const cx = 150
  const cy = 160
  const r = 110
  const sw = 18

  // Build a semi-circle arc path string
  // Arc goes from left (180°) to right (0°) — top of the "D"
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
  const circ = Math.PI * r // half circumference

  const scoreColor = '#E94560'

  return (
    <div className="flex flex-col items-center min-h-[220px] md:min-h-[260px]">
      <p className="text-[#1A1A2E] font-bold text-lg md:text-xl text-center mb-4">Your Overall Score</p>
      <svg
        viewBox="0 0 300 170"
        className="w-full max-w-[280px] md:max-w-[320px] mx-auto"
        aria-label={`Speedometer showing ${score}%`}
      >
        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={sw}
          strokeLinecap="butt"
        />

        {/* Red zone: 0–40% */}
        <path
          d={arcPath}
          fill="none"
          stroke="#E74C3C"
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={`${circ * 0.4} ${circ}`}
          strokeDashoffset={0}
        />
        {/* Orange zone: 40–70% */}
        <path
          d={arcPath}
          fill="none"
          stroke="#F39C12"
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={`${circ * 0.3} ${circ}`}
          strokeDashoffset={`${-circ * 0.4}`}
        />
        {/* Green zone: 70–100% */}
        <path
          d={arcPath}
          fill="none"
          stroke="#27AE60"
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={`${circ * 0.3} ${circ}`}
          strokeDashoffset={`${-circ * 0.7}`}
        />

        {/*
          NEEDLE GROUP — rotates around cx,cy
          rotation: 0% = -180deg (left), 100% = 0deg (right)
          so needleRotation = -180 + (score / 100) * 180
        */}
        <g transform={`rotate(${-180 + (score / 100) * 180}, 150, 160)`}>
          {/* Needle drawn pointing RIGHT from centre — rotation handles direction */}
          <line
            x1={150}
            y1={160}
            x2={235}
            y2={160}
            stroke="#1A1A2E"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>

        {/* Pivot dot — rendered AFTER needle so it sits on top */}
        <circle cx={150} cy={160} r={6} fill="#1A1A2E" />
      </svg>

      {/* Low / High labels below arc */}
      <div className="w-full max-w-[280px] md:max-w-[320px] flex justify-between px-4 -mt-1">
        <span className="text-xs text-gray-400">Low</span>
        <span className="text-xs text-gray-400">High</span>
      </div>

      {/* Score percentage */}
      <p className="text-3xl font-bold text-center mt-6" style={{ color: scoreColor }}>
        {score.toFixed(1)}%
      </p>

      {/* Profile name */}
      <p className="text-base font-bold text-center text-[#1A1A2E] mt-1">
        {profileName}
      </p>
    </div>
  )
}

// ─── Radial Progress Ring SVG ────────────────────────────────────────────────

function RadialRing({ score }: { score: number }) {
  const r = 80
  const circumference = 2 * Math.PI * r // ~502.65
  const ringColor = score >= 70 ? '#27AE60' : score >= 40 ? '#F39C12' : '#E74C3C'
  const targetOffset = circumference * (1 - score / 100)

  return (
    <div className="flex flex-col items-center">
      <p className="text-[#1A1A2E] font-bold text-lg md:text-xl text-center mb-4">
        Parenting Influence Score
      </p>
      <svg
        viewBox="0 0 200 200"
        className="w-full max-w-[200px] md:max-w-[220px] mx-auto"
        aria-label={`Progress ring showing ${score}%`}
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="#E5E7EB"
          strokeWidth="16"
          fill="none"
        />

        {/* Animated progress circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          stroke={ringColor}
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{ rotate: -90, transformOrigin: '100px 100px' }}
        />

        {/* Centre percentage text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="28"
          fontWeight="bold"
          fill={ringColor}
        >
          {score.toFixed(1)}%
        </text>

        {/* Sub text */}
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontSize="11"
          fill="#9CA3AF"
        >
          out of 100%
        </text>
      </svg>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AssessmentResult | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('score_answers')
    if (!saved) {
      router.push('/')
      return
    }
    const answers = JSON.parse(saved)
    const calc = calculateResults(answers)
    setResult(calc)
    sessionStorage.setItem('score_result', JSON.stringify(calc))
  }, [router])

  if (!result) return null

  const normalizedScore = result.percentage
  const profile = result.profile
  const categoryScores = result.categoryScores

  // Find weakest category index
  const weakestIndex = categoryScores.reduce(
    (minIdx, cat, idx) =>
      cat.percentage < categoryScores[minIdx].percentage ? idx : minIdx,
    0
  )

  // Other profiles (all except current)
  const otherProfiles = profiles.filter((p) => p.id !== profile.id)

  // Short teaser: first sentence of description
  const firstSentence = profile.description.split('.')[0]

  // Share URLs
  const shareText = encodeURIComponent(
    `I just scored ${normalizedScore.toFixed(1)}% on the Immpact Parenting Assessment! Find out your profile:`
  )
  const shareUrl = encodeURIComponent(`${window.location.origin}/results`)
  const whatsappUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`

  return (
    <div className="overflow-x-hidden min-h-screen bg-[#F5F7FF]">

      {/* ── Section 1: Header ── */}
      <section className="bg-[#1A1A2E] px-6 py-8 md:px-12 md:py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-xl md:text-2xl">
              Thank you for taking the Assessment
            </p>
            <p className="text-[#E94560] text-base md:text-lg mt-1">
              Your personalised parenting profile is ready
            </p>
            {/* Score legend */}
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                { color: '#E74C3C', label: 'Low Strength' },
                { color: '#F39C12', label: 'Low to Average' },
                { color: '#F1C40F', label: 'Average' },
                { color: '#2980B9', label: 'Average to High' },
                { color: '#27AE60', label: 'High Strength' },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block rounded-full flex-shrink-0"
                    style={{ width: 10, height: 10, backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-300">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Two Charts ── */}
      <section className="bg-white px-4 py-10 md:px-12 md:py-14">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center justify-center">
          {/* Left: Speedometer */}
          <div className="w-full md:w-1/2">
            <Speedometer score={normalizedScore} profileName={profile.name} />
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px bg-gray-100 self-stretch" />

          {/* Right: Radial Ring */}
          <div className="w-full md:w-1/2">
            <RadialRing score={normalizedScore} />
          </div>
        </div>
      </section>

      {/* ── Section 3: Category Cards ── */}
      <section className="bg-[#F5F7FF] px-4 py-10 md:px-12">
        <h2 className="text-[#1A1A2E] font-bold text-xl md:text-2xl text-center mb-8">
          Your Category Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categoryScores.map((cat, index) => {
            const isWeakest = index === weakestIndex
            const catPct = cat.percentage
            const barColor = getBarColor(catPct)
            const strengthLabel = getStrengthLabel(catPct)
            const description =
              CATEGORY_DESCRIPTIONS[cat.category] ?? 'How you perform in this area'

            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`bg-white rounded-xl shadow p-5 relative ${
                  isWeakest
                    ? 'border-l-4 border-[#E94560] bg-red-50'
                    : ''
                }`}
              >
                {isWeakest && (
                  <span className="absolute top-3 right-3 bg-[#E94560] text-white text-xs px-2 py-0.5 rounded-full">
                    Focus Area
                  </span>
                )}
                <h3 className="text-[#1A1A2E] font-bold text-base mb-1 pr-20">
                  {cat.category}
                </h3>
                <p className="text-gray-400 text-xs mb-4">{description}</p>

                {/* Animated progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <motion.div
                    className="h-2.5 rounded-full"
                    style={{ backgroundColor: barColor }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${catPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: barColor }}>
                    {catPct.toFixed(0)}%
                  </span>
                  <span className="text-xs font-medium" style={{ color: barColor }}>
                    {strengthLabel}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Section 4: Profile Curiosity Trigger ── */}
      <section className="bg-white px-4 py-12 md:px-12">
        <div className="max-w-[700px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#1A1A2E] font-bold text-xl md:text-2xl mb-3">
              You&apos;ve been identified as:
            </p>
            <p className="text-[#E94560] font-bold text-3xl md:text-4xl mb-4">
              {profile.name}
            </p>
            <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
              {firstSentence}...
            </p>
          </motion.div>
        </div>

        {/* Profiles progression — wider container so all pills fit in one row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-gray-400 text-xs mb-4 uppercase tracking-wide">
            Parenting Profiles
          </p>

          {/* Desktop: single horizontal row */}
          <div className="hidden md:flex items-center justify-center">
            {profiles.map((p, index) => (
              <div key={p.name} className="flex items-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap select-none ${
                    p.id === profile.id
                      ? 'bg-[#E94560] text-white border border-[#E94560]'
                      : 'border border-gray-200 text-gray-500 bg-white'
                  }`}
                >
                  {p.name}
                </span>
                {index < profiles.length - 1 && (
                  <span className="text-gray-300 mx-1.5 text-sm select-none">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack with down arrows */}
          <div className="flex flex-col items-center md:hidden">
            {profiles.map((p, index) => (
              <div key={p.name} className="flex flex-col items-center">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold select-none ${
                    p.id === profile.id
                      ? 'bg-[#E94560] text-white border border-[#E94560]'
                      : 'border border-gray-200 text-gray-500 bg-white'
                  }`}
                >
                  {p.name}
                </span>
                {index < profiles.length - 1 && (
                  <span className="text-gray-400 text-sm my-1 select-none">↓</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Section 5: CTA Card ── */}
      <section className="bg-[#F5F7FF] px-4 py-12 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white shadow rounded-2xl max-w-xl mx-auto px-6 py-8 text-center"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          <h3 className="text-[#1A1A2E] font-bold text-xl">
            Want to know what this means for you?
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            See your full parenting profile, personalised insights, and what you can do next.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/lead-capture')}
            className="w-full bg-[#E94560] text-white py-3 rounded-xl font-bold mt-6"
          >
            Yes, I want to improve →
          </motion.button>
        </motion.div>
      </section>

      {/* ── Section 6: Share Strip ── */}
      <section className="bg-[#F0F2F5] px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#E94560] text-sm font-bold text-center md:text-left">
            Share your results with friends
          </p>

          {/* Social buttons */}
          <div className="flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
              aria-label="Share on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white transition-colors"
              aria-label="Share on X (Twitter)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center md:text-right">
            Powered by KEY PERSON OF INFLUENCE
          </p>
        </div>
      </section>

    </div>
  )
}

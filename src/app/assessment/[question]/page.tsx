'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, CATEGORY_COLORS } from '@/lib/questions'
import { calculateResults } from '@/lib/scoring'

interface ParentForm {
  parentName: string
  parentPhone: string
  parentEmail: string
}

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionNumber = parseInt(params.question as string, 10)
  const question = questions[questionNumber - 1]

  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [shake, setShake] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [parentForm, setParentForm] = useState<ParentForm>({ parentName: '', parentPhone: '', parentEmail: '' })
  const [parentErrors, setParentErrors] = useState<Partial<ParentForm>>({})
  const [submitting, setSubmitting] = useState(false)

  // Clear all session data when starting from question 1 (fresh session)
  useEffect(() => {
    if (questionNumber === 1) {
      sessionStorage.removeItem('score_answers')
      sessionStorage.removeItem('score_result')
      sessionStorage.removeItem('score_child_info')
      sessionStorage.removeItem('score_submission_id')
      sessionStorage.removeItem('score_parent_info')
    }
  }, [questionNumber])

  // Load saved answers from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('score_answers')
    if (saved) {
      const parsed = JSON.parse(saved)
      setAnswers(parsed)
      setSelected(parsed[question?.id] ?? null)
    }
  }, [question?.id])

  if (!question) {
    router.push('/')
    return null
  }

  const progress = Math.round((questionNumber / questions.length) * 100)
  const isLast = questionNumber === questions.length
  const categoryColor = CATEGORY_COLORS[question.category] ?? '#2980B9'

  function handleSelect(score: number) {
    setSelected(score)
  }

  function handleNext() {
    if (selected === null) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const updated = { ...answers, [question.id]: selected }
    setAnswers(updated)
    sessionStorage.setItem('score_answers', JSON.stringify(updated))

    if (isLast) {
      setShowModal(true)
    } else {
      router.push(`/assessment/${questionNumber + 1}`)
    }
  }

  function validateParentForm(): boolean {
    const e: Partial<ParentForm> = {}
    if (!parentForm.parentName.trim()) e.parentName = 'Please enter your name'
    if (!parentForm.parentPhone.trim()) {
      e.parentPhone = 'Please enter your phone number'
    } else if (!/^[6-9]\d{9}$/.test(parentForm.parentPhone.trim())) {
      e.parentPhone = 'Enter a valid 10-digit Indian mobile number'
    }
    if (parentForm.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentForm.parentEmail)) {
      e.parentEmail = 'Enter a valid email address'
    }
    setParentErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleParentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateParentForm()) return
    setSubmitting(true)

    const savedAnswers = sessionStorage.getItem('score_answers')
    if (!savedAnswers) { router.push('/'); return }
    const answers = JSON.parse(savedAnswers)
    const result = calculateResults(answers)

    sessionStorage.setItem('score_parent_info', JSON.stringify(parentForm))
    sessionStorage.setItem('score_result', JSON.stringify(result))

    // Two attempts so a transient failure doesn't lose the lead; results still render from sessionStorage either way
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentName: parentForm.parentName,
            parentMobile: parentForm.parentPhone,
            parentEmail: parentForm.parentEmail || '',
            result,
          }),
        })
        const data = await res.json()
        if (data.submissionId) {
          sessionStorage.setItem('score_submission_id', data.submissionId)
          break
        }
        if (res.status < 500) break // validation or rate-limit errors won't succeed on retry
      } catch {
        // network error — retry once
      }
    }

    router.push('/results')
  }

  function handleBack() {
    if (questionNumber > 1) {
      router.push(`/assessment/${questionNumber - 1}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header with progress */}
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 pt-4 pb-5">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="text-white/70 text-sm font-medium hover:text-white transition-colors"
            style={{ visibility: questionNumber === 1 ? 'hidden' : 'visible' }}
          >
            ← Back
          </button>
          <span className="text-white font-bold tracking-widest text-lg">Immpact</span>
          <span className="text-white/50 text-sm">{questionNumber}/{questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full"
            style={{ backgroundColor: '#E94560' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Category tag */}
        <div className="mt-3 flex justify-center">
          <span
            className="text-white text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: categoryColor }}
          >
            {question.category}
          </span>
        </div>
      </header>

      {/* Question card */}
      <main className="flex-1 flex flex-col px-5 py-10 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            {/* Question */}
            <motion.div
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-semibold text-gray-400 mb-2">Q{questionNumber}</p>
              <h2
                className="font-serif text-3xl md:text-4xl font-normal leading-snug"
                style={{ color: '#1A1A2E' }}
              >
                {question.text}
              </h2>
              <p className="text-sm italic text-gray-400 mt-2">
                Select the option that best describes you
              </p>
            </motion.div>

            {/* Options */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {question.options.map((option) => {
                const isSelected = selected === option.score
                return (
                  <motion.button
                    key={option.score}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.score)}
                    className={`flex-1 text-center px-6 py-8 rounded-2xl transition-all font-medium text-lg${
                      !isSelected ? ' hover:bg-gray-200' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? '#1A1A2E' : '#F3F4F6',
                      color: isSelected ? '#FFFFFF' : '#1A1A2E',
                    }}
                  >
                    {option.text}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <div className="mt-auto pt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all"
            style={{
              backgroundColor: selected !== null ? '#E94560' : '#9CA3AF',
              cursor: selected !== null ? 'pointer' : 'default',
            }}
          >
            {isLast ? 'See My Results →' : 'Next →'}
          </motion.button>
        </div>
      </main>

      {/* Parent Info Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ backgroundColor: 'rgba(26,26,46,0.75)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#E94560,#FF8C42)' }} />

              <div className="px-6 pt-6 pb-8">
                {/* Trophy + headline */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-md"
                    style={{ backgroundColor: '#FFF1F3' }}
                  >
                    🏆
                  </div>
                  <h2 className="text-2xl font-bold leading-tight" style={{ color: '#1A1A2E' }}>
                    Your Score Is Ready!
                  </h2>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
                    You&apos;re just one step away from seeing your personalised Parenting Score and profile.
                  </p>
                </div>

                {/* WhatsApp nudge pill */}
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-5 text-sm font-medium"
                  style={{ backgroundColor: '#F0FFF4', color: '#166534', border: '1px solid #BBF7D0' }}
                >
                  <span className="text-base">📲</span>
                  <span>We&apos;ll send your detailed report to your WhatsApp — free!</span>
                </div>

                <form onSubmit={handleParentSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#1A1A2E' }}>
                      Your Name <span style={{ color: '#E94560' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={parentForm.parentName}
                      onChange={(e) => setParentForm({ ...parentForm, parentName: e.target.value })}
                      className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      style={{
                        borderColor: parentErrors.parentName ? '#E94560' : '#E5E7EB',
                        color: '#1A1A2E',
                      }}
                    />
                    {parentErrors.parentName && (
                      <p className="text-xs mt-1" style={{ color: '#E94560' }}>{parentErrors.parentName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#1A1A2E' }}>
                      WhatsApp / Mobile Number <span style={{ color: '#E94560' }}>*</span>
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                        style={{ color: '#6B7280' }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={parentForm.parentPhone}
                        onChange={(e) => setParentForm({ ...parentForm, parentPhone: e.target.value.replace(/\D/g, '') })}
                        className="w-full border-2 rounded-xl pl-12 pr-4 py-3 text-sm outline-none transition-colors"
                        style={{
                          borderColor: parentErrors.parentPhone ? '#E94560' : '#E5E7EB',
                          color: '#1A1A2E',
                        }}
                      />
                    </div>
                    {parentErrors.parentPhone ? (
                      <p className="text-xs mt-1" style={{ color: '#E94560' }}>{parentErrors.parentPhone}</p>
                    ) : (
                      <p className="text-xs mt-1 text-gray-400">Your report + expert tips will be shared here</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#1A1A2E' }}>
                      Email Address <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={parentForm.parentEmail}
                      onChange={(e) => setParentForm({ ...parentForm, parentEmail: e.target.value })}
                      className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      style={{
                        borderColor: parentErrors.parentEmail ? '#E94560' : '#E5E7EB',
                        color: '#1A1A2E',
                      }}
                    />
                    {parentErrors.parentEmail && (
                      <p className="text-xs mt-1" style={{ color: '#E94560' }}>{parentErrors.parentEmail}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base mt-1 shadow-md transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg,#E94560,#FF6B35)',
                      opacity: submitting ? 0.75 : 1,
                      cursor: submitting ? 'default' : 'pointer',
                    }}
                  >
                    {submitting ? 'Saving…' : 'Reveal My Parenting Score →'}
                  </motion.button>

                  <p className="text-center text-xs text-gray-400">
                    🔒 Your details are private and never shared with third parties.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

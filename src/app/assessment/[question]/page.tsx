'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, CATEGORY_COLORS } from '@/lib/questions'

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionNumber = parseInt(params.question as string, 10)
  const question = questions[questionNumber - 1]

  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [shake, setShake] = useState(false)

  // Clear all session data when starting from question 1 (fresh session)
  useEffect(() => {
    if (questionNumber === 1) {
      sessionStorage.removeItem('score_answers')
      sessionStorage.removeItem('score_result')
      sessionStorage.removeItem('score_child_info')
      sessionStorage.removeItem('score_submission_id')
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
      sessionStorage.setItem('score_answers', JSON.stringify(updated))
      router.push('/results')
    } else {
      router.push(`/assessment/${questionNumber + 1}`)
    }
  }

  function handleBack() {
    if (questionNumber > 1) {
      router.push(`/assessment/${questionNumber - 1}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
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
          <span className="text-white font-bold tracking-widest text-lg">SCORE</span>
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
    </div>
  )
}

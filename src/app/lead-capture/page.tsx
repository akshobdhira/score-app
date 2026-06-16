'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const CLASS_OPTIONS = [
  'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
]

const BOARD_OPTIONS = [
  'CBSE', 'ICSE', 'IB', 'Cambridge (IGCSE)', 'State Board', 'Other',
]

export default function LeadCapturePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    childClass: '',
    childBoard: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.childClass) e.childClass = 'Please select your child\'s class'
    if (!form.childBoard) e.childBoard = 'Please select the board'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const submissionId = sessionStorage.getItem('score_submission_id')
    if (!submissionId) { router.push('/'); return }

    try {
      await fetch('/api/submit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          childClass: form.childClass,
          childBoard: form.childBoard,
        }),
      })
      sessionStorage.setItem('score_child_info', JSON.stringify(form))
      router.push('/thank-you')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 text-center">
        <h1 className="text-white font-bold tracking-widest text-lg">SCORE</h1>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-3xl"
              style={{ backgroundColor: '#E94560' }}
            >
              🎯
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
              Your Results Are Ready!
            </h2>
            <p className="text-gray-500 text-sm">
              Tell us a little about your child to unlock your full profile and personalised insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-5">
            {/* Child's class */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Child&apos;s Current Class *
              </label>
              <select
                value={form.childClass}
                onChange={(e) => setForm({ ...form, childClass: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  borderColor: errors.childClass ? '#E74C3C' : '#E5E7EB',
                  color: '#1A1A2E',
                }}
              >
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.childClass && (
                <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors.childClass}</p>
              )}
            </div>

            {/* Board */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Board of Education *
              </label>
              <select
                value={form.childBoard}
                onChange={(e) => setForm({ ...form, childBoard: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  borderColor: errors.childBoard ? '#E74C3C' : '#E5E7EB',
                  color: '#1A1A2E',
                }}
              >
                <option value="">Select board</option>
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.childBoard && (
                <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors.childBoard}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base mt-2"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#E94560' }}
            >
              {loading ? 'Saving...' : 'Unlock My Full Profile →'}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const TIME_SLOTS = [
  'Weekday Morning (9am–12pm)',
  'Weekday Afternoon (12pm–4pm)',
  'Weekday Evening (6pm–9pm)',
  'Weekend Morning (9am–12pm)',
  'Weekend Afternoon (12pm–4pm)',
]

export default function BookingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    parentName: '',
    parentMobile: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    academicChallenges: '',
    careerGoals: '',
    preferredTimeSlot: '',
    additionalNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.parentName.trim()) e.parentName = 'Required'
    if (!/^\d{10}$/.test(form.parentMobile.trim())) e.parentMobile = 'Enter a valid 10-digit mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail.trim())) e.parentEmail = 'Enter a valid email address'
    if (!form.childName.trim()) e.childName = 'Required'
    if (!form.childAge.trim()) e.childAge = 'Required'
    if (!form.academicChallenges.trim()) e.academicChallenges = 'Required'
    if (!form.careerGoals.trim()) e.careerGoals = 'Required'
    if (!form.preferredTimeSlot) e.preferredTimeSlot = 'Please select a time slot'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const submissionId = sessionStorage.getItem('score_submission_id')

    try {
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submissionId }),
      })
      router.push('/booking/confirmation')
    } catch {
      setLoading(false)
    }
  }

  function field(
    label: string,
    key: keyof typeof form,
    type = 'text',
    placeholder = ''
  ) {
    return (
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
          {label} *
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ borderColor: errors[key] ? '#E74C3C' : '#E5E7EB', color: '#1A1A2E' }}
        />
        {errors[key] && <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 text-center">
        <h1 className="text-white font-bold tracking-widest text-lg">SCORE</h1>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
              Book a 1-on-1 Call
            </h2>
            <p className="text-gray-500 text-sm">
              Fill in the details below and we&apos;ll get in touch to schedule your personalised consultation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E94560' }}>
              Parent Details
            </p>
            {field('Your Name', 'parentName', 'text', 'Full name')}
            {field('Mobile Number', 'parentMobile', 'tel', '10-digit number')}
            {field('Email Address', 'parentEmail', 'email', 'you@email.com')}

            <p className="text-xs font-bold uppercase tracking-wider mt-2" style={{ color: '#E94560' }}>
              About Your Child
            </p>
            {field('Child\'s Name', 'childName', 'text', 'First name')}
            {field('Child\'s Age', 'childAge', 'text', 'e.g. 16')}

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Current Academic Challenges *
              </label>
              <textarea
                rows={3}
                placeholder="What is your child struggling with most right now?"
                value={form.academicChallenges}
                onChange={(e) => setForm({ ...form, academicChallenges: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor: errors.academicChallenges ? '#E74C3C' : '#E5E7EB', color: '#1A1A2E' }}
              />
              {errors.academicChallenges && <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors.academicChallenges}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Career / Education Goals *
              </label>
              <textarea
                rows={3}
                placeholder="What future are you hoping to build for your child?"
                value={form.careerGoals}
                onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor: errors.careerGoals ? '#E74C3C' : '#E5E7EB', color: '#1A1A2E' }}
              />
              {errors.careerGoals && <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors.careerGoals}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Preferred Time Slot *
              </label>
              <select
                value={form.preferredTimeSlot}
                onChange={(e) => setForm({ ...form, preferredTimeSlot: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ borderColor: errors.preferredTimeSlot ? '#E74C3C' : '#E5E7EB', color: '#1A1A2E' }}
              >
                <option value="">Select a time slot</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.preferredTimeSlot && <p className="text-xs mt-1" style={{ color: '#E74C3C' }}>{errors.preferredTimeSlot}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                Additional Notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Anything else you'd like us to know?"
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base mt-2"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#E94560' }}
            >
              {loading ? 'Submitting...' : 'Request My Consultation →'}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

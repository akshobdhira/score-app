'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const CALENDLY_URL = 'https://calendly.com/akshobdhira2005/30min'

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'calendly'>('form')
  const [form, setForm] = useState({
    parentName: '',
    parentMobile: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    academicChallenges: '',
    careerGoals: '',
    additionalNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Pre-fill parent details from assessment modal session data
  useEffect(() => {
    const raw = sessionStorage.getItem('score_parent_info')
    if (raw) {
      const info = JSON.parse(raw)
      setForm((prev) => ({
        ...prev,
        parentName: info.parentName || '',
        parentMobile: info.parentPhone || '',
        parentEmail: info.parentEmail || '',
      }))
    }
  }, [])

  // Listen for Calendly booking completion via postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return
      let data = e.data
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch { return }
      }
      if (data?.event === 'calendly.event_scheduled') {
        router.push('/thank-you')
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.parentName.trim()) e.parentName = 'Required'
    if (!/^[6-9]\d{9}$/.test(form.parentMobile.trim())) e.parentMobile = 'Enter a valid 10-digit Indian mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail.trim())) e.parentEmail = 'Enter a valid email address'
    if (!form.childName.trim()) e.childName = 'Required'
    if (!form.childAge.trim()) e.childAge = 'Required'
    if (!form.academicChallenges.trim()) e.academicChallenges = 'Required'
    if (!form.careerGoals.trim()) e.careerGoals = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const submissionId = sessionStorage.getItem('score_submission_id')

    // Two attempts so a transient failure doesn't drop the booking from the admin view.
    // Calendly still captures the booking, so the parent always proceeds.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            preferredTimeSlot: 'Via Calendly',
            submissionId,
          }),
        })
        if (res.status < 500) break
      } catch {
        // network error — retry once
      }
    }
    setStep('calendly')
    setLoading(false)
  }

  function field(label: string, key: keyof typeof form, type = 'text', placeholder = '') {
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

  // Build pre-filled Calendly URL
  const calendlyEmbedUrl = `${CALENDLY_URL}?name=${encodeURIComponent(form.parentName)}&email=${encodeURIComponent(form.parentEmail)}&hide_gdpr_banner=1`

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 text-center">
        <h1 className="text-white font-bold tracking-widest text-lg">Immpact</h1>
      </header>

      {/* Step indicator */}
      <div className="max-w-xl mx-auto w-full px-5 pt-6">
        <div className="flex items-center gap-3">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: step === 'form' ? '#E94560' : '#27AE60',
                color: '#fff',
              }}
            >
              {step === 'calendly' ? '✓' : '1'}
            </div>
            <span className="text-sm font-semibold" style={{ color: step === 'form' ? '#1A1A2E' : '#27AE60' }}>
              Your Details
            </span>
          </div>

          <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: step === 'calendly' ? '#27AE60' : '#E5E7EB' }} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: step === 'calendly' ? '#E94560' : '#E5E7EB',
                color: step === 'calendly' ? '#fff' : '#9CA3AF',
              }}
            >
              2
            </div>
            <span className="text-sm font-semibold" style={{ color: step === 'calendly' ? '#1A1A2E' : '#9CA3AF' }}>
              Pick Your Slot
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full px-5 py-6">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Details Form ── */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
                  Tell us about yourself
                </h2>
                <p className="text-gray-500 text-sm">
                  Step 1 of 2 — We&apos;ll use this to personalise your session.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-5">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E94560' }}>
                  Parent Details
                </p>
                {field('Your Name', 'parentName', 'text', 'Full name')}
                {field('WhatsApp Number', 'parentMobile', 'tel', '10-digit number')}
                {field('Email Address', 'parentEmail', 'email', 'you@email.com')}

                <p className="text-xs font-bold uppercase tracking-wider mt-2" style={{ color: '#E94560' }}>
                  About Your Child
                </p>
                {field("Child's Name", 'childName', 'text', 'First name')}
                {field("Child's Age", 'childAge', 'text', 'e.g. 16')}

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
                    Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
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
                  {loading ? 'Saving...' : 'Next — Pick Your Slot →'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ── Step 2: Calendly Embed ── */}
          {step === 'calendly' && (
            <motion.div
              key="calendly"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full text-2xl mb-3"
                  style={{ backgroundColor: '#F0FFF4' }}
                >
                  🗓️
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
                  Pick a time that works for you
                </h2>
                <p className="text-gray-500 text-sm">
                  Step 2 of 2 — Choose your slot below. You&apos;ll get a Google Meet link instantly.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                <iframe
                  src={calendlyEmbedUrl}
                  width="100%"
                  height="700"
                  frameBorder={0}
                  title="Book your session"
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}

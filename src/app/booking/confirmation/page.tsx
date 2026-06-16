'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function BookingConfirmationPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 text-center">
        <h1 className="text-white font-bold tracking-widest text-lg">SCORE</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-md p-8 max-w-md w-full text-center"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ backgroundColor: '#27AE60' }}
          >
            ✓
          </div>

          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A1A2E' }}>
            You&apos;re Booked!
          </h2>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your slot is confirmed. Check your email for a calendar invite with the Google Meet link — we can&apos;t wait to meet you!
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>What happens next:</p>
            <ul className="text-sm text-gray-500 flex flex-col gap-1.5">
              <li className="flex gap-2"><span style={{ color: '#27AE60' }}>1.</span> Check your inbox — you&apos;ll get a calendar invite with the Google Meet link</li>
              <li className="flex gap-2"><span style={{ color: '#27AE60' }}>2.</span> Our expert reviews your SCORE assessment results before the session</li>
              <li className="flex gap-2"><span style={{ color: '#27AE60' }}>3.</span> Join your personalised 1-on-1 session at the scheduled time</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl text-white font-bold text-base"
            style={{ backgroundColor: '#1A1A2E' }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}

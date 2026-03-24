'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/admin')
    } else {
      setError('Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ backgroundColor: '#F5F7FA' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-md p-8 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-widest mb-1" style={{ color: '#1A1A2E' }}>SCORE</h1>
          <p className="text-gray-400 text-sm">Admin Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#E74C3C' }}>{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm mt-2"
            style={{ backgroundColor: loading ? '#9CA3AF' : '#1A1A2E' }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

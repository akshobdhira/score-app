'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Submission } from '@/types'

type Filter = {
  search: string
  school: string
  profile: string
  booking: string
  dateFrom: string
  dateTo: string
}

// Booking detail shape returned from the joined Supabase select
type BookingDetail = {
  parent_name?: string
  parent_mobile?: string
  parent_email?: string
  child_name?: string
  child_age?: string
  academic_challenges?: string
  career_goals?: string
  preferred_time_slot?: string
  additional_notes?: string
  created_at?: string
}

// Extend the Submission type locally to carry the joined bookings record
// Supabase returns one-to-many as an array even when there's only one booking
type SubmissionWithBooking = Submission & {
  bookings?: BookingDetail[] | null
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [submissions, setSubmissions] = useState<SubmissionWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>({
    search: '', school: '', profile: '', booking: '', dateFrom: '', dateTo: '',
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchSubmissions()
  }, [status])

  async function fetchSubmissions() {
    setLoading(true)
    try {
      const res = await fetch('/api/submissions')
      const data = await res.json()
      setSubmissions(data.submissions ?? [])
    } finally {
      setLoading(false)
    }
  }

  function filtered() {
    return submissions.filter((s) => {
      const search = filter.search.toLowerCase()
      if (search) {
        const b = s.bookings?.[0]
        const matchesSubmission =
          s.child_school.toLowerCase().includes(search) ||
          s.child_class.toLowerCase().includes(search) ||
          s.child_board.toLowerCase().includes(search) ||
          s.profile_name.toLowerCase().includes(search)
        const matchesBooking =
          b?.parent_name?.toLowerCase().includes(search) ||
          b?.parent_mobile?.toLowerCase().includes(search) ||
          b?.parent_email?.toLowerCase().includes(search) ||
          b?.child_name?.toLowerCase().includes(search) ||
          b?.child_age?.toLowerCase().includes(search) ||
          b?.academic_challenges?.toLowerCase().includes(search) ||
          b?.career_goals?.toLowerCase().includes(search) ||
          b?.preferred_time_slot?.toLowerCase().includes(search) ||
          b?.additional_notes?.toLowerCase().includes(search)
        if (!matchesSubmission && !matchesBooking) return false
      }
      if (filter.school && s.child_school !== filter.school) return false
      if (filter.profile && s.profile_name !== filter.profile) return false
      if (filter.booking === 'yes' && !s.has_booking) return false
      if (filter.booking === 'no' && s.has_booking) return false
      if (filter.dateFrom && new Date(s.created_at) < new Date(filter.dateFrom)) return false
      if (filter.dateTo && new Date(s.created_at) > new Date(filter.dateTo)) return false
      return true
    })
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll(rowIds: string[]) {
    const allSelected = rowIds.every((id) => selected.has(id))
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        rowIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        rowIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  async function handleDelete(ids: string[]) {
    if (!confirm(`Are you sure you want to permanently delete ${ids.length} submission${ids.length > 1 ? 's' : ''} and their booking data? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/submissions/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setSubmissions((prev) => prev.filter((s) => !ids.includes(s.id)))
      setSelected((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
      if (expandedRow && ids.includes(expandedRow)) setExpandedRow(null)
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  function exportCSV() {
    const rows = filtered()
    const headers = [
      'Date', 'Class', 'School', 'Board', 'Score %', 'Profile', 'Booking',
      'Parent Name', 'Mobile Number', 'Email', 'Child Name', 'Child Age',
      'Academic Challenges', 'Career Goals', 'Preferred Time Slot',
      'Additional Notes', 'Booking Date',
    ]
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        [
          new Date(r.created_at).toLocaleDateString(),
          r.child_class,
          `"${r.child_school}"`,
          r.child_board,
          r.percentage,
          `"${r.profile_name}"`,
          r.has_booking ? 'Yes' : 'No',
          `"${r.bookings?.[0]?.parent_name || ''}"`,
          `"${r.bookings?.[0]?.parent_mobile || ''}"`,
          `"${r.bookings?.[0]?.parent_email || ''}"`,
          `"${r.bookings?.[0]?.child_name || ''}"`,
          `"${r.bookings?.[0]?.child_age || ''}"`,
          `"${r.bookings?.[0]?.academic_challenges || ''}"`,
          `"${r.bookings?.[0]?.career_goals || ''}"`,
          `"${r.bookings?.[0]?.preferred_time_slot || ''}"`,
          `"${r.bookings?.[0]?.additional_notes || ''}"`,
          r.bookings?.[0]?.created_at ? `"${new Date(r.bookings[0].created_at).toLocaleString()}"` : '',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `score-submissions-${Date.now()}.csv`
    a.click()
  }

  const profileNames = [...new Set(submissions.map((s) => s.profile_name))]
  const schoolNames = [...new Set(submissions.map((s) => s.child_school))].sort()
  const rows = filtered()
  const rowIds = rows.map((r) => r.id)
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.has(id))
  const totalBookings = submissions.filter((s) => s.has_booking).length
  const avgScore = submissions.length
    ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length)
    : 0

  if (status === 'loading' || status === 'unauthenticated') return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold tracking-widest text-lg">SCORE — Admin</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-white/60 text-sm hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-8">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Submissions', value: submissions.length },
            { label: 'Total Bookings', value: totalBookings },
            { label: 'Avg Score', value: `${avgScore}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-end">
          <input
            type="text"
            placeholder="Search by school, parent, child name, email..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none flex-1 min-w-[160px]"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          />
          <select
            value={filter.school}
            onChange={(e) => setFilter({ ...filter, school: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          >
            <option value="">All Schools</option>
            {schoolNames.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filter.profile}
            onChange={(e) => setFilter({ ...filter, profile: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          >
            <option value="">All Profiles</option>
            {profileNames.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filter.booking}
            onChange={(e) => setFilter({ ...filter, booking: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          >
            <option value="">All Bookings</option>
            <option value="yes">Has Booking</option>
            <option value="no">No Booking</option>
          </select>
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          />
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          />
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ backgroundColor: '#E94560' }}
          >
            Export CSV
          </button>
        </div>

        {/* Bulk delete bar — shown only when rows are selected */}
        {selected.size > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-red-700 font-medium">
              {selected.size} submission{selected.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => handleDelete([...selected])}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : `Delete Selected (${selected.size})`}
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading submissions...</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#1A1A2E' }}>
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleSelectAll(rowIds)}
                        className="cursor-pointer accent-[#E94560]"
                        title="Select all"
                      />
                    </th>
                    {['Date', 'Class', 'School', 'Board', 'Score', 'Profile', 'Booking', ''].map((h) => (
                      <th key={h} className="text-left text-white/80 px-4 py-3 font-semibold text-xs">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${selected.has(s.id) ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(s.id)}
                            onChange={() => toggleSelect(s.id)}
                            className="cursor-pointer accent-[#E94560]"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(s.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#1A1A2E' }}>{s.child_class}</td>
                        <td className="px-4 py-3" style={{ color: '#1A1A2E' }}>{s.child_school}</td>
                        <td className="px-4 py-3 text-gray-500">{s.child_board}</td>
                        <td className="px-4 py-3">
                          <span
                            className="font-bold"
                            style={{
                              color: s.percentage >= 70 ? '#27AE60' : s.percentage >= 40 ? '#F39C12' : '#E74C3C',
                            }}
                          >
                            {s.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.profile_name}</td>
                        <td className="px-4 py-3">
                          {s.has_booking ? (
                            <button
                              onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}
                              className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-600 transition cursor-pointer"
                            >
                              Booked &#9660;
                            </button>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#9CA3AF' }}>
                              None
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete([s.id])}
                            disabled={deleting}
                            className="text-red-400 hover:text-red-600 transition text-xs font-medium disabled:opacity-40"
                            title="Delete this submission"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                      {expandedRow === s.id && (
                        <tr key={`expanded-${s.id}`}>
                          <td colSpan={9} className="bg-blue-50 px-6 py-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-bold text-[#1A1A2E] text-sm">BOOKING DETAILS</h3>
                              <button
                                onClick={() => setExpandedRow(null)}
                                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                              >
                                &#x2715;
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div><span className="font-semibold text-[#1A1A2E]">Parent Name:</span> <span className="text-gray-700">{s.bookings?.[0]?.parent_name || '—'}</span></div>
                              <div><span className="font-semibold text-[#1A1A2E]">Mobile Number:</span> <span className="text-gray-700">{s.bookings?.[0]?.parent_mobile || '—'}</span></div>
                              <div><span className="font-semibold text-[#1A1A2E]">Email:</span> <span className="text-gray-700">{s.bookings?.[0]?.parent_email || '—'}</span></div>
                              <div><span className="font-semibold text-[#1A1A2E]">Child&apos;s Name:</span> <span className="text-gray-700">{s.bookings?.[0]?.child_name || '—'}</span></div>
                              <div><span className="font-semibold text-[#1A1A2E]">Child&apos;s Age:</span> <span className="text-gray-700">{s.bookings?.[0]?.child_age || '—'}</span></div>
                              <div><span className="font-semibold text-[#1A1A2E]">Preferred Time Slot:</span> <span className="text-gray-700">{s.bookings?.[0]?.preferred_time_slot || '—'}</span></div>
                              <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Academic Challenges:</span> <span className="text-gray-700">{s.bookings?.[0]?.academic_challenges || '—'}</span></div>
                              <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Career / Education Goals:</span> <span className="text-gray-700">{s.bookings?.[0]?.career_goals || '—'}</span></div>
                              <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Additional Notes:</span> <span className="text-gray-700">{s.bookings?.[0]?.additional_notes || '—'}</span></div>
                              <div className="col-span-2 text-xs text-gray-400 mt-1">Submitted: {s.bookings?.[0]?.created_at ? new Date(s.bookings[0].created_at).toLocaleString() : '—'}</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

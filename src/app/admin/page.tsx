'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Submission } from '@/types'

type Filter = {
  search: string
  grade: string
  profile: string
  booking: string
  dateFrom: string
  dateTo: string
}

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

type SubmissionWithBooking = Submission & {
  bookings?: BookingDetail[] | null
}

type MessageLog = {
  id: string
  created_at: string
  submission_id: string
  parent_name: string
  parent_email: string
  template_id: string
  template_name: string
  meeting_link: string | null
  status: 'sent' | 'failed'
  error: string | null
}

const TEMPLATE_OPTIONS = [
  { id: 'book-session',   name: 'Book Your Free Session',        needsMeetingLink: true },
  { id: 'follow-up',      name: 'Follow-Up Nudge',               needsMeetingLink: true },
  { id: 'insights',       name: 'Your Parenting Score Insights',  needsMeetingLink: false },
  { id: 'limited-slots',  name: 'Limited Slots — Act Now',        needsMeetingLink: true },
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [submissions, setSubmissions] = useState<SubmissionWithBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>({
    search: '', grade: '', profile: '', booking: '', dateFrom: '', dateTo: '',
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  // Email send state
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendTargets, setSendTargets] = useState<SubmissionWithBooking[]>([])
  const [templateId, setTemplateId] = useState('book-session')
  const [meetingLink, setMeetingLink] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sentCount: number; failedCount: number } | null>(null)

  // Message history
  const [messageLogs, setMessageLogs] = useState<Record<string, MessageLog[]>>({})

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubmissions()
      fetchMessageLogs()
    }
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

  async function fetchMessageLogs() {
    try {
      const res = await fetch('/api/message-logs')
      const data = await res.json()
      const grouped: Record<string, MessageLog[]> = {}
      for (const log of data.logs ?? []) {
        if (!grouped[log.submission_id]) grouped[log.submission_id] = []
        grouped[log.submission_id].push(log)
      }
      setMessageLogs(grouped)
    } catch { /* silent */ }
  }

  function filtered() {
    return submissions.filter((s) => {
      const search = filter.search.toLowerCase()
      if (search) {
        const b = s.bookings?.[0]
        const matchesSubmission =
          (s.child_class ?? '').toLowerCase().includes(search) ||
          (s.child_board ?? '').toLowerCase().includes(search) ||
          s.profile_name.toLowerCase().includes(search) ||
          (s.parent_name ?? '').toLowerCase().includes(search) ||
          (s.parent_mobile ?? '').toLowerCase().includes(search) ||
          (s.parent_email ?? '').toLowerCase().includes(search)
        const matchesBooking =
          b?.parent_name?.toLowerCase().includes(search) ||
          b?.parent_mobile?.toLowerCase().includes(search) ||
          b?.parent_email?.toLowerCase().includes(search) ||
          b?.child_name?.toLowerCase().includes(search)
        if (!matchesSubmission && !matchesBooking) return false
      }
      if (filter.grade && s.child_class !== filter.grade) return false
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
      setSelected((prev) => { const n = new Set(prev); rowIds.forEach((id) => n.delete(id)); return n })
    } else {
      setSelected((prev) => { const n = new Set(prev); rowIds.forEach((id) => n.add(id)); return n })
    }
  }

  async function handleDelete(ids: string[]) {
    if (!confirm(`Delete ${ids.length} submission${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/submissions/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error()
      setSubmissions((prev) => prev.filter((s) => !ids.includes(s.id)))
      setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n })
      if (expandedRow && ids.includes(expandedRow)) setExpandedRow(null)
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  function openSendModal(targets: SubmissionWithBooking[]) {
    const withEmail = targets.filter((t) => t.parent_email)
    if (withEmail.length === 0) {
      alert('None of the selected parents have an email address.')
      return
    }
    setSendTargets(withEmail)
    setTemplateId('book-session')
    setMeetingLink('')
    setSendResult(null)
    setShowSendModal(true)
  }

  async function handleSendEmail() {
    const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.id === templateId)
    if (selectedTemplate?.needsMeetingLink && !meetingLink.trim()) {
      alert('Please enter a meeting / booking link for this template.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: sendTargets.map((t) => ({
            submissionId: t.id,
            parentName: t.parent_name ?? 'Parent',
            parentEmail: t.parent_email!,
            grade: t.child_class ?? null,
          })),
          templateId,
          meetingLink: meetingLink.trim() || undefined,
        }),
      })
      const data = await res.json()
      setSendResult({ sentCount: data.sentCount, failedCount: data.failedCount })
      fetchMessageLogs()
    } catch {
      alert('Failed to send emails. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function exportCSV() {
    const rows = filtered()
    const headers = [
      'Date', 'Parent Name', 'Mobile Number', 'Email', 'Score %', 'Profile',
      'Class', 'Board', 'Booking',
      'Booking — Child Name', 'Child Age', 'Preferred Time Slot', 'Booking Date',
    ]
    const csv = [
      headers.join(','),
      ...rows.map((r) => [
        new Date(r.created_at).toLocaleDateString(),
        `"${r.parent_name || ''}"`,
        `"${r.parent_mobile || ''}"`,
        `"${r.parent_email || ''}"`,
        r.percentage,
        `"${r.profile_name}"`,
        r.child_class || '',
        r.child_board || '',
        r.has_booking ? 'Yes' : 'No',
        `"${r.bookings?.[0]?.child_name || ''}"`,
        `"${r.bookings?.[0]?.child_age || ''}"`,
        `"${r.bookings?.[0]?.preferred_time_slot || ''}"`,
        r.bookings?.[0]?.created_at ? `"${new Date(r.bookings[0].created_at).toLocaleString()}"` : '',
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `score-submissions-${Date.now()}.csv`
    a.click()
  }

  const profileNames = [...new Set(submissions.map((s) => s.profile_name))]
  const gradeNames = [...new Set(submissions.map((s) => s.child_class).filter(Boolean) as string[])]
  const rows = filtered()
  const rowIds = rows.map((r) => r.id)
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.has(id))
  const totalBookings = submissions.filter((s) => s.has_booking).length
  const totalEmailsSent = Object.values(messageLogs).flat().filter((l) => l.status === 'sent').length
  const avgScore = submissions.length
    ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length)
    : 0

  const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.id === templateId)

  if (status === 'loading' || status === 'unauthenticated') return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1A1A2E' }} className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold tracking-widest text-lg">Immpact — Admin</h1>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="text-white/60 text-sm hover:text-white transition-colors">
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-8">

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Submissions', value: submissions.length },
            { label: 'Total Bookings', value: totalBookings },
            { label: 'Emails Sent', value: totalEmailsSent },
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
            placeholder="Search by name, phone, email, profile..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="border rounded-xl px-3 py-2 text-sm outline-none flex-1 min-w-[160px]"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          />
          <select value={filter.grade} onChange={(e) => setFilter({ ...filter, grade: e.target.value })} className="border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}>
            <option value="">All Grades</option>
            {gradeNames.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filter.profile} onChange={(e) => setFilter({ ...filter, profile: e.target.value })} className="border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}>
            <option value="">All Profiles</option>
            {profileNames.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filter.booking} onChange={(e) => setFilter({ ...filter, booking: e.target.value })} className="border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}>
            <option value="">All Bookings</option>
            <option value="yes">Has Booking</option>
            <option value="no">No Booking</option>
          </select>
          <input type="date" value={filter.dateFrom} onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })} className="border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }} />
          <input type="date" value={filter.dateTo} onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })} className="border rounded-xl px-3 py-2 text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }} />
          <button onClick={exportCSV} className="px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: '#E94560' }}>
            Export CSV
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
              {selected.size} parent{selected.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => openSendModal(rows.filter((r) => selected.has(r.id)))}
                className="text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition"
                style={{ backgroundColor: '#E94560' }}
              >
                ✉️ Send Email ({selected.size})
              </button>
              <button
                onClick={() => handleDelete([...selected])}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
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
                      <input type="checkbox" checked={allSelected} onChange={() => toggleSelectAll(rowIds)} className="cursor-pointer accent-[#E94560]" />
                    </th>
                    {['Date', 'Parent', 'Phone', 'Score', 'Profile', 'Class', 'Booking', ''].map((h) => (
                      <th key={h} className="text-left text-white/80 px-4 py-3 font-semibold text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s, i) => {
                    const logs = messageLogs[s.id] ?? []
                    return (
                      <React.Fragment key={s.id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${selected.has(s.id) ? 'bg-rose-50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="cursor-pointer accent-[#E94560]" />
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="font-medium" style={{ color: '#1A1A2E' }}>{s.parent_name || <span className="text-gray-300">—</span>}</p>
                            {s.parent_email && <p className="text-xs text-gray-400 mt-0.5">{s.parent_email}</p>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {s.parent_mobile
                              ? <a href={`tel:+91${s.parent_mobile}`} className="text-blue-600 hover:underline font-mono text-xs">{s.parent_mobile}</a>
                              : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold" style={{ color: s.percentage >= 70 ? '#27AE60' : s.percentage >= 40 ? '#F39C12' : '#E74C3C' }}>
                              {s.percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.profile_name}</td>
                          <td className="px-4 py-3 text-gray-500">{s.child_class || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3">
                            {s.has_booking ? (
                              <button onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)} className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-green-600 transition">
                                Booked ▾
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#9CA3AF' }}>None</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {s.parent_email && (
                                <button
                                  onClick={() => openSendModal([s])}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-lg transition"
                                  style={{ backgroundColor: '#FFF1F3', color: '#E94560' }}
                                  title="Send email"
                                >
                                  ✉️
                                </button>
                              )}
                              {logs.length > 0 && (
                                <button
                                  onClick={() => setExpandedRow(expandedRow === `logs-${s.id}` ? null : `logs-${s.id}`)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                                  style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                                  title={`${logs.length} email${logs.length > 1 ? 's' : ''} sent`}
                                >
                                  📋 {logs.length}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete([s.id])}
                                disabled={deleting}
                                className="text-red-400 hover:text-red-600 transition text-xs font-medium disabled:opacity-40"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>

                        {/* Booking expanded row */}
                        {expandedRow === s.id && (
                          <tr key={`booking-${s.id}`}>
                            <td colSpan={9} className="bg-blue-50 px-6 py-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#1A1A2E] text-sm">BOOKING DETAILS</h3>
                                <button onClick={() => setExpandedRow(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
                              </div>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div><span className="font-semibold text-[#1A1A2E]">Board:</span> <span className="text-gray-700">{s.child_board || '—'}</span></div>
                                <div><span className="font-semibold text-[#1A1A2E]">Email:</span> <span className="text-gray-700">{s.parent_email || '—'}</span></div>
                                <div><span className="font-semibold text-[#1A1A2E]">Child&apos;s Name:</span> <span className="text-gray-700">{s.bookings?.[0]?.child_name || '—'}</span></div>
                                <div><span className="font-semibold text-[#1A1A2E]">Child&apos;s Age:</span> <span className="text-gray-700">{s.bookings?.[0]?.child_age || '—'}</span></div>
                                <div><span className="font-semibold text-[#1A1A2E]">Preferred Slot:</span> <span className="text-gray-700">{s.bookings?.[0]?.preferred_time_slot || '—'}</span></div>
                                <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Academic Challenges:</span> <span className="text-gray-700">{s.bookings?.[0]?.academic_challenges || '—'}</span></div>
                                <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Career Goals:</span> <span className="text-gray-700">{s.bookings?.[0]?.career_goals || '—'}</span></div>
                                <div className="col-span-2"><span className="font-semibold text-[#1A1A2E]">Notes:</span> <span className="text-gray-700">{s.bookings?.[0]?.additional_notes || '—'}</span></div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Email history expanded row */}
                        {expandedRow === `logs-${s.id}` && logs.length > 0 && (
                          <tr key={`logs-${s.id}`}>
                            <td colSpan={9} className="bg-indigo-50 px-6 py-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-[#1A1A2E] text-sm">EMAIL HISTORY</h3>
                                <button onClick={() => setExpandedRow(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
                              </div>
                              <div className="flex flex-col gap-2">
                                {logs.map((log) => (
                                  <div key={log.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 text-sm">
                                    <div className="flex items-center gap-3">
                                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'sent' ? 'bg-green-500' : 'bg-red-400'}`} />
                                      <div>
                                        <p className="font-semibold text-[#1A1A2E]">{log.template_name}</p>
                                        {log.meeting_link && <p className="text-xs text-blue-500 mt-0.5 truncate max-w-xs">{log.meeting_link}</p>}
                                        {log.error && <p className="text-xs text-red-500 mt-0.5">{log.error}</p>}
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {log.status === 'sent' ? 'Sent' : 'Failed'}
                                      </span>
                                      <p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString('en-IN')}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Send Email Modal */}
      <AnimatePresence>
        {showSendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(26,26,46,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget && !sending) setShowSendModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100" style={{ backgroundColor: '#1A1A2E' }}>
                <div>
                  <h2 className="text-white font-bold text-lg">Send Email</h2>
                  <p className="text-white/50 text-xs mt-0.5">
                    {sendTargets.length} recipient{sendTargets.length > 1 ? 's' : ''}
                    {sendTargets.length < (rows.filter((r) => selected.has(r.id)).length) && (
                      <span className="text-yellow-400"> · {rows.filter((r) => selected.has(r.id)).length - sendTargets.length} skipped (no email)</span>
                    )}
                  </p>
                </div>
                {!sending && !sendResult && (
                  <button onClick={() => setShowSendModal(false)} className="text-white/60 hover:text-white text-xl font-bold">✕</button>
                )}
              </div>

              <div className="px-6 py-6">
                {sendResult ? (
                  /* Result screen */
                  <div className="text-center py-4">
                    <div className="text-5xl mb-4">{sendResult.failedCount === 0 ? '🎉' : '⚠️'}</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
                      {sendResult.failedCount === 0 ? 'All emails sent!' : 'Partially sent'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      <span className="text-green-600 font-semibold">{sendResult.sentCount} sent</span>
                      {sendResult.failedCount > 0 && <span className="text-red-500 font-semibold"> · {sendResult.failedCount} failed</span>}
                    </p>
                    <button
                      onClick={() => setShowSendModal(false)}
                      className="px-6 py-3 rounded-2xl text-white font-bold"
                      style={{ backgroundColor: '#E94560' }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  /* Send form */
                  <div className="flex flex-col gap-5">
                    {/* Recipients preview */}
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 max-h-28 overflow-y-auto">
                      {sendTargets.map((t) => (
                        <div key={t.id} className="flex items-center gap-2 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-[#1A1A2E]">{t.parent_name || 'Parent'}</span>
                          <span className="text-xs text-gray-400">{t.parent_email}</span>
                        </div>
                      ))}
                    </div>

                    {/* Template picker */}
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#1A1A2E' }}>Choose Template</label>
                      <div className="flex flex-col gap-2">
                        {TEMPLATE_OPTIONS.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTemplateId(t.id)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all"
                            style={{
                              borderColor: templateId === t.id ? '#E94560' : '#E5E7EB',
                              backgroundColor: templateId === t.id ? '#FFF1F3' : '#FAFAFA',
                            }}
                          >
                            <span className="text-lg flex-shrink-0">
                              {t.id === 'book-session' ? '📅' : t.id === 'follow-up' ? '👋' : t.id === 'insights' ? '📊' : '⚡'}
                            </span>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: templateId === t.id ? '#E94560' : '#1A1A2E' }}>{t.name}</p>
                              {t.needsMeetingLink && <p className="text-xs text-gray-400 mt-0.5">Requires a booking link</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Meeting link input */}
                    {selectedTemplate?.needsMeetingLink && (
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>
                          Booking / Meeting Link <span style={{ color: '#E94560' }}>*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://calendly.com/your-link"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none"
                          style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
                        />
                      </div>
                    )}

                    {/* Send button */}
                    <motion.button
                      whileHover={{ scale: sending ? 1 : 1.02 }}
                      whileTap={{ scale: sending ? 1 : 0.97 }}
                      onClick={handleSendEmail}
                      disabled={sending}
                      className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-md transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg,#E94560,#FF6B35)',
                        opacity: sending ? 0.75 : 1,
                        cursor: sending ? 'default' : 'pointer',
                      }}
                    >
                      {sending
                        ? `Sending to ${sendTargets.length} parent${sendTargets.length > 1 ? 's' : ''}…`
                        : `Send to ${sendTargets.length} Parent${sendTargets.length > 1 ? 's' : ''} →`}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

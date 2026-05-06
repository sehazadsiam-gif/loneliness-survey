'use client'

import { useState, useEffect } from 'react'

type Response = {
  id: string
  created_at: string
  gender: string
  age_range: string
  university: string
  year: string
  subject: string
  financial_background: string
  ordinal_position: string
  total_score: number
  loneliness_level: string
}

type Interview = {
  id: string
  response_id: string
  email: string
  phone: string
  name: string | null
  created_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [responses, setResponses] = useState<Response[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch(`/api/admin?password=${encodeURIComponent(password)}`)
      if (res.status === 401) {
        setAuthError('Wrong password.')
        setLoading(false)
        return
      }
      const data = await res.json()
      setResponses(data.responses || [])
      setInterviews(data.interviews || [])
      setAuthed(true)
    } catch {
      setAuthError('Failed to connect.')
    }
    setLoading(false)
  }

  const levelColor = (level: string) => {
    if (level?.includes('Low')) return '#10b981'
    if (level?.includes('Moderate')) return '#f59e0b'
    if (level?.includes('High') && !level?.includes('Very')) return '#ef4444'
    if (level?.includes('Very')) return '#8b5cf6'
    return '#94a3b8'
  }

  const downloadCSV = () => {
    if (!responses.length) return
    const headers = [
      'ID', 'Date', 'University', 'Year', 'Subject', 'Gender', 'Age Range',
      'Financial BG', 'Ordinal Position', 'Total Score', 'Loneliness Level',
    ]
    const rows = responses.map((r) => [
      r.id,
      new Date(r.created_at).toLocaleDateString(),
      r.university,
      r.year,
      r.subject,
      r.gender,
      r.age_range,
      r.financial_background,
      r.ordinal_position,
      r.total_score,
      r.loneliness_level,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'survey_responses.csv'
    a.click()
  }

  const levelCounts = responses.reduce<Record<string, number>>((acc, r) => {
    const key = r.loneliness_level || 'Unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 w-full max-w-sm text-center relative z-10">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2 block">
            Security
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h1>
          <p className="text-sm text-slate-500 mb-8 font-medium">Enter authorization password.</p>
          
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Authorization Key"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
          
          {authError && <p className="text-red-500 text-[10px] font-bold uppercase mb-4 tracking-wide">{authError}</p>}
          
          <button 
            onClick={login} 
            disabled={loading} 
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold tracking-wide"
          >
            {loading ? 'Authorizing...' : 'Access Dashboard'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1 block">
              Management Console
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Intelligence</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Research Analytics &middot; Academic Insights</p>
          </div>
          <button onClick={downloadCSV} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg">
            <span>Export Dataset</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Dataset</p>
            <p className="text-4xl font-bold text-slate-900">{responses.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Interviews</p>
            <p className="text-4xl font-bold text-blue-600">{interviews.length}</p>
          </div>
          {Object.entries(levelCounts).map(([level, count]) => (
            <div key={level} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{level.split(' ')[0]}</p>
              <p className="text-4xl font-bold" style={{ color: levelColor(level) }}>
                {count}
              </p>
            </div>
          ))}
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Detailed Responses</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-white border border-slate-200 px-3 py-1 rounded-full">
              {responses.length} Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] border-b border-slate-100">
                  <th className="px-8 py-4 text-left">Timestamp</th>
                  <th className="px-8 py-4 text-left">Institution</th>
                  <th className="px-8 py-4 text-left">Academic Year</th>
                  <th className="px-8 py-4 text-left">Demographics</th>
                  <th className="px-8 py-4 text-left">Metrics</th>
                  <th className="px-8 py-4 text-left text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {responses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-slate-400 font-medium">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900">{r.university}</td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{r.year}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold">{r.gender}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{r.age_range} Years</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black" style={{ color: levelColor(r.loneliness_level) }}>
                          {r.total_score}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold">/ 80</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className="text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-white"
                        style={{ background: levelColor(r.loneliness_level) }}
                      >
                        {r.loneliness_level}
                      </span>
                    </td>
                  </tr>
                ))}
                {responses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Initialising dataset...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Requests Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Interview Pipeline</h2>
            <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              {interviews.length} Candidates
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] border-b border-slate-100">
                  <th className="px-8 py-4 text-left">Date</th>
                  <th className="px-8 py-4 text-left">Identity</th>
                  <th className="px-8 py-4 text-left">Electronic Mail</th>
                  <th className="px-8 py-4 text-left">Communication</th>
                  <th className="px-8 py-4 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {interviews.map((iv) => (
                  <tr key={iv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-slate-400 font-medium">
                      {new Date(iv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-slate-900 font-bold">{iv.name || 'Anonymous'}</td>
                    <td className="px-8 py-5 font-bold text-blue-600">{iv.email}</td>
                    <td className="px-8 py-5 text-slate-700 font-medium">{iv.phone}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-[10px] text-slate-300 font-mono tracking-tighter">
                        {iv.response_id?.slice(0, 8)}
                      </span>
                    </td>
                  </tr>
                ))}
                {interviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No candidates scheduled.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

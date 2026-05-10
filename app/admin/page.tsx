'use client'

import { useState, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { 
  Users, ClipboardList, GraduationCap, DollarSign, 
  ChevronRight, Download, LogIn, ShieldCheck,
  LayoutDashboard, PieChart as PieChartIcon, Table as TableIcon,
  Search, Filter, Calendar
} from 'lucide-react'

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

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const LEVEL_COLORS: Record<string, string> = {
  'Low Loneliness': '#10b981',
  'Moderate Loneliness': '#f59e0b',
  'High Loneliness': '#ef4444',
  'Very High Loneliness': '#8b5cf6',
  'Unknown': '#94a3b8'
};

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [responses, setResponses] = useState<Response[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'interviews'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const login = async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch(`/api/admin?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      if (res.status === 401) {
        setAuthError('Invalid credentials.')
        setLoading(false)
        return
      }
      const data = await res.json()
      setResponses(data.responses || [])
      setInterviews(data.interviews || [])
      setAuthed(true)
    } catch {
      setAuthError('Connection failed.')
    }
    setLoading(false)
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

  // Data Preparation for Charts
  const stats = useMemo(() => {
    const genderData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.gender] = (acc[r.gender] || 0) + 1
      return acc
    }, {})

    const levelData = responses.reduce<Record<string, number>>((acc, r) => {
      const key = r.loneliness_level || 'Unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const uniData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.university] = (acc[r.university] || 0) + 1
      return acc
    }, {})

    const financeData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.financial_background] = (acc[r.financial_background] || 0) + 1
      return acc
    }, {})

    const ageData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.age_range] = (acc[r.age_range] || 0) + 1
      return acc
    }, {})

    const ordinalData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.ordinal_position] = (acc[r.ordinal_position] || 0) + 1
      return acc
    }, {})

    const yearData = responses.reduce<Record<string, number>>((acc, r) => {
      acc[r.year] = (acc[r.year] || 0) + 1
      return acc
    }, {})

    return {
      gender: Object.entries(genderData).map(([name, value]) => ({ name, value })),
      levels: Object.entries(levelData).map(([name, value]) => ({ name, value })),
      universities: Object.entries(uniData).map(([name, value]) => ({ name, value })),
      finance: Object.entries(financeData).map(([name, value]) => ({ name, value })),
      age: Object.entries(ageData).map(([name, value]) => ({ name, value })),
      ordinal: Object.entries(ordinalData).map(([name, value]) => ({ name, value })),
      years: Object.entries(yearData).map(([name, value]) => ({ name, value }))
    }
  }, [responses])

  const filteredResponses = responses.filter(r => 
    r.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.loneliness_level.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 mt-2">Secure access to research insights</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="adminhci"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center font-medium">
                {authError}
              </div>
            )}

            <button 
              onClick={login} 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Research</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('responses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'responses' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <TableIcon className="w-5 h-5" />
              Raw Data
            </button>
            <button 
              onClick={() => setActiveTab('interviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'interviews' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Users className="w-5 h-5" />
              Interviews
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-all" />
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Status</p>
            <h4 className="font-bold text-lg mb-2">Live Sync</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Connected to DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === 'overview' ? 'Analytical Dashboard' : activeTab === 'responses' ? 'Survey Responses' : 'Interview Pipeline'}
              </h1>
              <p className="text-slate-500 text-sm font-medium">Insights into university student loneliness levels</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Responses', value: responses.length, icon: ClipboardList, color: 'indigo' },
                  { label: 'Interviews Requested', value: interviews.length, icon: Users, color: 'blue' },
                  { label: 'Avg. Score', value: responses.length ? (responses.reduce((a, b) => a + b.total_score, 0) / responses.length).toFixed(1) : 0, icon: GraduationCap, color: 'emerald' },
                  { label: 'High Risk', value: responses.filter(r => r.loneliness_level.includes('High')).length, icon: ShieldCheck, color: 'rose' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Main Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Loneliness Distribution */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Loneliness Distribution</h3>
                      <p className="text-sm text-slate-500">Breakdown by categorized risk levels</p>
                    </div>
                    <PieChartIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.levels}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.levels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={LEVEL_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* University Distribution */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Institution Reach</h3>
                      <p className="text-sm text-slate-500">Responses across different universities</p>
                    </div>
                    <GraduationCap className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.universities} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={120} 
                          tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gender & Age */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Gender Representation</h3>
                      <p className="text-sm text-slate-500">Demographic split of participants</p>
                    </div>
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.gender}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          {stats.gender.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Financial Background */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Financial Context</h3>
                      <p className="text-sm text-slate-500">Background of surveyed students</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.finance}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ordinal Position */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Sibling Ordinal Position</h3>
                      <p className="text-sm text-slate-500">Birth order of participants</p>
                    </div>
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.ordinal}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.ordinal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Academic Year Distribution */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">Academic Progress</h3>
                      <p className="text-sm text-slate-500">Distribution across study years</p>
                    </div>
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.years}>
                        <defs>
                          <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorYear)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    placeholder="Search by institution, subject or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Showing {filteredResponses.length} records</span>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Institution</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Score</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Level</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredResponses.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{r.gender}, {r.age_range}</span>
                              <span className="text-xs text-slate-500 font-medium">{r.subject} ({r.year})</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-slate-300" />
                              <span className="text-sm font-semibold text-slate-700">{r.university}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black" style={{ color: LEVEL_COLORS[r.loneliness_level] }}>{r.total_score}</span>
                              <span className="text-[10px] text-slate-300 font-bold uppercase">/ 80</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              style={{ 
                                backgroundColor: `${LEVEL_COLORS[r.loneliness_level]}15`,
                                color: LEVEL_COLORS[r.loneliness_level]
                              }}
                            >
                              {r.loneliness_level}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-400 font-medium font-mono">
                            {new Date(r.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((iv) => (
                  <div key={iv.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {iv.name ? iv.name[0] : 'A'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{iv.name || 'Anonymous Candidate'}</h4>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(iv.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <LogIn className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="font-semibold text-indigo-600">{iv.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <Users className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="font-medium text-slate-600">{iv.phone}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {iv.response_id.slice(0,8)}</span>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Result &rarr;</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {interviews.length === 0 && (
                <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Interview Requests</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Candidates who opt-in for further research will appear here for your review.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

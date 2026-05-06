'use client'

import { useState } from 'react'

type Props = {
  responseId: string
  onSubmit: () => void
}

export default function SectionInterview({ responseId, onSubmit }: Props) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})
  const [loading, setLoading] = useState(false)

  const inputClass =
    'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none'

  const labelClass = 'block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider'

  const validate = () => {
    const e: { email?: string; phone?: string } = {}
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email is required.'
    if (!phone.trim() || phone.length < 10) e.phone = 'Valid phone number is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_id: responseId, email, phone, name }),
      })
      onSubmit()
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-slide">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2 block text-center md:text-left">
          Research Opportunity
        </span>
        <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4 text-center md:text-left">
          Join the Physical Interview
        </h2>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium text-center md:text-left">
          Your participation is entirely voluntary. If you are comfortable, please share your
          contact details so our research team can schedule a 20&ndash;30 minute session.
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Email Address</label>
              <span className="text-[10px] font-bold text-blue-500 uppercase">Required</span>
            </div>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 tracking-wide">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Phone Number</label>
              <span className="text-[10px] font-bold text-blue-500 uppercase">Required</span>
            </div>
            <input
              type="tel"
              className={inputClass}
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 tracking-wide">{errors.phone}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass}>Full Name</label>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Optional</span>
            </div>
            <input
              type="text"
              className={inputClass}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full mt-10 py-4 rounded-xl text-base"
        >
          {loading ? 'Processing...' : 'Complete Registration'}
        </button>

        <button
          onClick={onSubmit}
          className="w-full mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-600 transition-colors py-2"
        >
          Skip research interview
        </button>
      </div>
    </div>
  )
}

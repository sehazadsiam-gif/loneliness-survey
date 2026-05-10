'use client'
import { useState } from 'react'

export default function SectionInterview({ responseId, onSubmit }: { responseId:string; onSubmit:()=>void }) {
  const [email, setEmail]   = useState('')
  const [phone, setPhone]   = useState('')
  const [name, setName]     = useState('')
  const [errors, setErrors] = useState<{email?:string;phone?:string}>({})
  const [loading, setLoading] = useState(false)

  const ic = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a1a2e] bg-white transition-all'

  const validate = () => {
    const e: {email?:string;phone?:string} = {}
    if (!email.trim()||!email.includes('@')) e.email='Valid email is required.'
    if (!phone.trim()||phone.length<10)      e.phone='Valid phone number is required.'
    setErrors(e)
    return Object.keys(e).length===0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('/api/interview',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({response_id:responseId,email,phone,name}) })
      onSubmit()
    } catch { setLoading(false) }
  }

  return (
    <div className="animate-fade-slide">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#7986cb]">Research Interview</span>
        <h2 className="font-display text-2xl text-[#1a1a2e] mt-2 mb-3">Join the Physical Interview</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Your participation is entirely voluntary. If you are comfortable, please share your contact details so our research team can reach you to schedule a session.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Email Address *</label>
            <input type="email" className={ic} placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Phone Number *</label>
            <input type="tel" className={ic} placeholder="01XXXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" className={ic} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-7">
          {loading?'Submitting...':'Submit and Finish'}
        </button>
        <button onClick={onSubmit} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
          Skip — I prefer not to participate in the interview
        </button>
      </div>
    </div>
  )
}

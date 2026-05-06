'use client'

import { useState } from 'react'
import type { DemographicData } from '@/app/page'

type Props = {
  onSubmit: (data: DemographicData) => void
}

const inputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none'

const labelClass = 'block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider'

export default function Section1Demographics({ onSubmit }: Props) {
  const [form, setForm] = useState<DemographicData>({
    consent: false,
    gender: '',
    age_range: '',
    university: '',
    year: '',
    subject: '',
    financial_background: '',
    ordinal_position: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof DemographicData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DemographicData, string>> = {}
    if (!form.consent) newErrors.consent = 'Consent is required'
    if (!form.gender) newErrors.gender = 'Required'
    if (!form.age_range) newErrors.age_range = 'Required'
    if (!form.university.trim()) newErrors.university = 'Required'
    if (!form.year) newErrors.year = 'Required'
    if (!form.subject.trim()) newErrors.subject = 'Required'
    if (!form.financial_background) newErrors.financial_background = 'Required'
    if (!form.ordinal_position) newErrors.ordinal_position = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onSubmit(form)
  }

  return (
    <div className="animate-fade-slide">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">
        <div className="mb-10">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2 block">
            Step 1 of 2
          </span>
          <h2 className="text-3xl font-bold text-slate-900">
            Demographic Information
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Please provide accurate information for research integrity.</p>
        </div>

        {/* Consent */}
        <div className={`mb-10 p-6 rounded-2xl border transition-all ${form.consent ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
          <label className="flex gap-4 cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-slate-600 font-medium leading-relaxed">
              I consent to participate in this study. I understand that my data will be used 
              anonymously for academic research and strictly confidential.
            </span>
          </label>
          {errors.consent && <p className="text-red-500 text-[11px] font-bold uppercase mt-3 tracking-wider">{errors.consent}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>
            <select
              className={inputClass}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
            {errors.gender && <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.gender}</p>}
          </div>

          {/* Age Range */}
          <div>
            <label className={labelClass}>Age Range</label>
            <select
              className={inputClass}
              value={form.age_range}
              onChange={(e) => setForm({ ...form, age_range: e.target.value })}
            >
              <option value="">Select</option>
              <option>17–19</option>
              <option>20–22</option>
              <option>23–25</option>
              <option>26+</option>
            </select>
            {errors.age_range && <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.age_range}</p>}
          </div>

          {/* University */}
          <div className="md:col-span-2">
            <label className={labelClass}>University Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. BRAC University"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />
            {errors.university && <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.university}</p>}
          </div>

          {/* Year */}
          <div>
            <label className={labelClass}>Year of Study</label>
            <select
              className={inputClass}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>5th Year +</option>
            </select>
            {errors.year && <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.year}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className={labelClass}>Subject / Department</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Computer Science"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.subject}</p>}
          </div>

          {/* Financial Background */}
          <div>
            <label className={labelClass}>Financial Background</label>
            <select
              className={inputClass}
              value={form.financial_background}
              onChange={(e) => setForm({ ...form, financial_background: e.target.value })}
            >
              <option value="">Select</option>
              <option>Low income</option>
              <option>Lower-middle income</option>
              <option>Middle income</option>
              <option>Upper-middle income</option>
              <option>High income</option>
            </select>
            {errors.financial_background && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.financial_background}</p>
            )}
          </div>

          {/* Ordinal Position */}
          <div>
            <label className={labelClass}>Position in Family</label>
            <select
              className={inputClass}
              value={form.ordinal_position}
              onChange={(e) => setForm({ ...form, ordinal_position: e.target.value })}
            >
              <option value="">Select</option>
              <option>Eldest child</option>
              <option>Middle child</option>
              <option>Youngest child</option>
              <option>Only child</option>
            </select>
            {errors.ordinal_position && (
              <p className="text-red-500 text-[10px] font-bold uppercase mt-1.5">{errors.ordinal_position}</p>
            )}
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-primary w-full mt-10 py-4 rounded-xl text-base">
          Continue to Assessment
        </button>
      </div>
    </div>
  )
}

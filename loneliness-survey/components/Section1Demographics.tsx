'use client'
import { useState } from 'react'
import type { DemographicData } from '@/app/page'

const ic = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a1a2e] bg-white transition-all'
const lc = 'block text-sm font-semibold text-[#1a1a2e] mb-2'

export default function Section1Demographics({ onSubmit }: { onSubmit:(d:DemographicData)=>void }) {
  const [form, setForm] = useState<DemographicData>({ consent:false, gender:'', age_range:'', university:'', year:'', subject:'', financial_background:'', ordinal_position:'' })
  const [errors, setErrors] = useState<Partial<Record<keyof DemographicData,string>>>({})

  const validate = () => {
    const e: Partial<Record<keyof DemographicData,string>> = {}
    if (!form.consent)                   e.consent='You must consent to participate.'
    if (!form.gender)                    e.gender='Please select your gender.'
    if (!form.age_range)                 e.age_range='Please select your age range.'
    if (!form.university.trim())         e.university='University name is required.'
    if (!form.year)                      e.year='Please select your year of study.'
    if (!form.subject.trim())            e.subject='Subject/department is required.'
    if (!form.financial_background)      e.financial_background='Please select your financial background.'
    if (!form.ordinal_position)          e.ordinal_position='Please select your position in family.'
    setErrors(e)
    return Object.keys(e).length===0
  }

  return (
    <div className="animate-fade-slide">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#7986cb]">Section 1 of 2</span>
          <h2 className="font-display text-2xl text-[#1a1a2e] mt-2">Consent and Demographics</h2>
          <p className="text-sm text-gray-400 mt-1">All fields are required.</p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[#f0f2ff]">
          <label className="flex gap-3 cursor-pointer">
            <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})} className="mt-1 w-5 h-5 accent-[#3949ab] flex-shrink-0" />
            <span className="text-sm text-gray-700 leading-relaxed">I consent to participate in this research. My responses will be used strictly for academic purposes and kept confidential.</span>
          </label>
          {errors.consent && <p className="text-red-500 text-xs mt-2">{errors.consent}</p>}
        </div>

        <div className="space-y-5">
          {[
            { label:'Gender', key:'gender', type:'select', opts:['Male','Female','Non-binary','Prefer not to say'] },
            { label:'Age Range', key:'age_range', type:'select', opts:['17–19','20–22','23–25','26+'] },
            { label:'University Name', key:'university', type:'text', placeholder:'e.g. BRAC University' },
            { label:'Year of Study', key:'year', type:'select', opts:['1st Year','2nd Year','3rd Year','4th Year','5th Year +'] },
            { label:'Subject / Department', key:'subject', type:'text', placeholder:'e.g. Computer Science and Engineering' },
            { label:'Financial Background', key:'financial_background', type:'select', opts:['Low income','Lower-middle income','Middle income','Upper-middle income','High income'] },
            { label:'Position in Family', key:'ordinal_position', type:'select', opts:['Eldest child','Middle child','Youngest child','Only child'] },
          ].map(f=>(
            <div key={f.key}>
              <label className={lc}>{f.label}</label>
              {f.type==='select' ? (
                <select className={ic} value={(form as any)[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}>
                  <option value="">Select {f.label.toLowerCase()}</option>
                  {f.opts!.map(o=><option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type="text" className={ic} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
              )}
              {(errors as any)[f.key] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.key]}</p>}
            </div>
          ))}
        </div>
        <button onClick={()=>{ if(validate()) onSubmit(form) }} className="btn-primary w-full mt-8">Continue to Survey</button>
      </div>
    </div>
  )
}

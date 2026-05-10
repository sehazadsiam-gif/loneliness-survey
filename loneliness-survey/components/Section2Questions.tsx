'use client'
import { useState } from 'react'
import { QUESTIONS, OPTIONS } from '@/lib/questions'
import { calculateTotalScore, getLonelinessLevel } from '@/lib/scoring'
import type { DemographicData } from '@/app/page'

type Props = { demographics: DemographicData; onComplete:(answers:Record<number,number>,score:number,responseId:string)=>void }

export default function Section2Questions({ demographics, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers]   = useState<Record<number,number>>({})
  const [selected, setSelected] = useState<number|null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [animating, setAnimating]   = useState(false)

  const question = QUESTIONS[currentQ]
  const progress  = (currentQ / QUESTIONS.length) * 100
  const isLast    = currentQ === QUESTIONS.length - 1

  const handleSelect = async (value: number) => {
    if (animating || submitting) return
    setSelected(value)
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (isLast) {
      setSubmitting(true)
      try {
        const totalScore = calculateTotalScore(newAnswers)
        const level      = getLonelinessLevel(totalScore)
        const payload    = {
          ...demographics,
          ...Object.fromEntries(QUESTIONS.map(q=>[`q${q.id}`, newAnswers[q.id]??1])),
          total_score: totalScore, loneliness_level: level.label,
        }
        const res  = await fetch('/api/submit', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
        const data = await res.json()
        onComplete(newAnswers, totalScore, data.id)
      } catch { setSubmitting(false); setSelected(null) }
    } else {
      setAnimating(true)
      setTimeout(()=>{ setCurrentQ(q=>q+1); setSelected(null); setAnimating(false) }, 300)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {currentQ+1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div className="progress-bar h-full rounded-full" style={{width:`${progress}%`}} />
        </div>
      </div>
      <div key={currentQ} className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 ${animating?'opacity-0 transition-all duration-200':'animate-fade-slide'}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#7986cb]">Section 2 — Loneliness Scale</span>
        <p className="font-display text-xl md:text-2xl text-[#1a1a2e] mt-4 mb-8 leading-snug">{question.text}</p>
        <div className="grid grid-cols-2 gap-3">
          {OPTIONS.map(opt=>(
            <button key={opt.value} onClick={()=>handleSelect(opt.value)} disabled={submitting}
              className={`option-card rounded-2xl p-5 text-left bg-[#f0f2ff] ${selected===opt.value?'selected':''}`}>
              <div className="font-semibold text-[#1a1a2e] text-sm">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {opt.value===1?'0 days / week':opt.value===2?'~1 day / week':opt.value===3?'2–3 days / week':'4–7 days / week'}
              </div>
            </button>
          ))}
        </div>
        {submitting && <div className="text-center mt-6 text-sm text-[#7986cb] animate-pulse">Saving your responses...</div>}
      </div>
    </div>
  )
}

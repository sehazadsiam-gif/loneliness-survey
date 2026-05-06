'use client'

import { useState } from 'react'
import { QUESTIONS, OPTIONS } from '@/lib/questions'
import { calculateTotalScore, getLonelinessLevel } from '@/lib/scoring'
import type { DemographicData } from '@/app/page'

type Props = {
  demographics: DemographicData
  onComplete: (answers: Record<number, number>, score: number, responseId: string) => void
}

export default function Section2Questions({ demographics, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [animating, setAnimating] = useState(false)

  const question = QUESTIONS[currentQ]
  const progress = (currentQ / QUESTIONS.length) * 100
  const isLast = currentQ === QUESTIONS.length - 1

  const handleSelect = async (value: number) => {
    if (animating || submitting) return
    setSelected(value)

    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (isLast) {
      // Submit to API
      setSubmitting(true)
      try {
        const totalScore = calculateTotalScore(newAnswers)
        const level = getLonelinessLevel(totalScore)

        const payload = {
          ...demographics,
          ...Object.fromEntries(
            QUESTIONS.map((q) => [`q${q.id}`, newAnswers[q.id] ?? 1])
          ),
          total_score: totalScore,
          loneliness_level: level.label,
        }

        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        onComplete(newAnswers, totalScore, data.id)
      } catch (err) {
        console.error('Submission error:', err)
        setSubmitting(false)
        setSelected(null)
      }
    } else {
      // Animate to next
      setAnimating(true)
      setTimeout(() => {
        setCurrentQ((q) => q + 1)
        setSelected(null)
        setAnimating(false)
      }, 300)
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10 px-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          <span>Assessment &middot; Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="progress-bar h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={currentQ}
        className={`bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 ${
          animating ? 'opacity-0 translate-y-4 scale-95 transition-all duration-300' : 'animate-fade-slide'
        }`}
      >
        {/* Question */}
        <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
          {question.text}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={submitting}
              className={`option-card rounded-2xl p-6 text-left transition-all ${
                selected === opt.value ? 'selected bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === opt.value ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  {selected === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <div className={`font-bold text-sm tracking-tight ${selected === opt.value ? 'text-blue-700' : 'text-slate-900'}`}>
                  {opt.label}
                </div>
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                {opt.value === 1
                  ? 'Never'
                  : opt.value === 2
                  ? 'Rarely'
                  : opt.value === 3
                  ? 'Sometimes'
                  : 'Always'}
              </div>
            </button>
          ))}
        </div>

        {submitting && (
          <div className="text-center mt-10 text-[11px] font-bold uppercase tracking-widest text-blue-600 animate-pulse">
            Processing assessment data...
          </div>
        )}
      </div>
    </div>
  )
}

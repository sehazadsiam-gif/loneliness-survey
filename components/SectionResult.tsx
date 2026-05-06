'use client'

import { useEffect, useState } from 'react'
import { getLonelinessLevel } from '@/lib/scoring'

type Props = {
  score: number
  onContinue: (needsInterview: boolean) => void
}

export default function SectionResult({ score, onContinue }: Props) {
  const result = getLonelinessLevel(score)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let start = 0
    const end = score
    const duration = 800
    const step = duration / end
    const timer = setInterval(() => {
      start += 1
      setDisplayScore(start)
      if (start >= end) clearInterval(timer)
    }, step)
    return () => clearInterval(timer)
  }, [score])

  const needsInterview = score >= 50

  const min = 20
  const max = 80
  const pct = ((score - min) / (max - min)) * 100

  return (
    <div className="animate-scale">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 text-center">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2 block">
          Assessment Result
        </span>

        <div className="my-10">
          {/* Score display */}
          <div
            className="score-number inline-block text-8xl font-bold mb-2 tracking-tighter"
            style={{ color: result.color }}
          >
            {displayScore}
          </div>
          <div className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">Score out of 80</div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mx-auto max-w-xs mb-8">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: result.color,
              }}
            />
          </div>

          <h2 className="text-3xl font-bold mb-4" style={{ color: result.color }}>
            {result.label}
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
            {result.description}
          </p>
        </div>

        {/* Score legend */}
        <div className="grid grid-cols-2 gap-3 text-xs text-left mb-10">
          {[
            { range: '20–34', label: 'Low', color: '#10b981' },
            { range: '35–49', label: 'Moderate', color: '#f59e0b' },
            { range: '50–64', label: 'High', color: '#ef4444' },
            { range: '65–80', label: 'Very High', color: '#8b5cf6' },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                result.label.toLowerCase().includes(s.label.toLowerCase())
                  ? 'bg-slate-50 border-slate-200 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-slate-600">
                {s.range} &middot; {s.label}
              </span>
            </div>
          ))}
        </div>

        {needsInterview ? (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left border border-blue-100">
            <p className="text-sm text-blue-900 font-bold mb-2 uppercase tracking-wide">Research Participation</p>
            <p className="text-sm text-blue-800/80 leading-relaxed">
              Based on your responses, we would like to invite you for a short physical interview
              as part of our research. This is entirely voluntary and will take approximately
              20–30 minutes.
            </p>
          </div>
        ) : null}

        <button
          onClick={() => onContinue(needsInterview)}
          className="btn-primary w-full py-4 rounded-xl text-base"
        >
          {needsInterview ? 'Express Interest in Interview' : 'Complete Survey'}
        </button>
      </div>
    </div>
  )
}

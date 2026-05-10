'use client'
import { useEffect, useState } from 'react'
import { getLonelinessLevel } from '@/lib/scoring'

export default function SectionResult({ score, onContinue }: { score:number; onContinue:(needsInterview:boolean)=>void }) {
  const result = getLonelinessLevel(score)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(()=>{
    let s=0
    const timer = setInterval(()=>{ s+=1; setDisplayScore(s); if(s>=score) clearInterval(timer) }, 800/score)
    return ()=>clearInterval(timer)
  },[score])

  const pct = ((score-20)/(80-20))*100
  const needsInterview = score >= 50

  return (
    <div className="animate-scale">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#7986cb]">Your Result</span>
        <div className="my-8">
          <div className="text-7xl font-display font-bold mb-2" style={{color:result.color}}>{displayScore}</div>
          <div className="text-gray-400 text-sm mb-4">out of 80</div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mx-auto max-w-xs mb-6">
            <div className="h-full rounded-full transition-all duration-1000" style={{width:`${pct}%`,background:result.color}} />
          </div>
          <h2 className="font-display text-2xl mb-3" style={{color:result.color}}>{result.label}</h2>
          <p className="text-gray-600 leading-relaxed max-w-md mx-auto">{result.description}</p>
        </div>
        {needsInterview && (
          <div className="bg-[#f0f2ff] rounded-2xl p-5 mb-6 text-left">
            <p className="text-sm text-[#1a1a2e] font-semibold mb-1">Research Interview Invitation</p>
            <p className="text-sm text-gray-600">Based on your responses, we would like to invite you for a short physical interview as part of our research. This is entirely voluntary and will take approximately 20–30 minutes.</p>
          </div>
        )}
        <button onClick={()=>onContinue(needsInterview)} className="btn-primary w-full">
          {needsInterview ? 'Express Interest in Interview' : 'Finish Survey'}
        </button>
      </div>
    </div>
  )
}

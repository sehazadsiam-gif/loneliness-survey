'use client'
import { useState } from 'react'
import Section0Screener from '@/components/Section0Screener'
import Section1Demographics from '@/components/Section1Demographics'
import Section2Questions from '@/components/Section2Questions'
import SectionResult from '@/components/SectionResult'
import SectionInterview from '@/components/SectionInterview'
import ThankYou from '@/components/ThankYou'
import NotEligible from '@/components/NotEligible'

export type DemographicData = {
  consent: boolean; gender: string; age_range: string; university: string
  year: string; subject: string; financial_background: string; ordinal_position: string
}
export type AppStage = 'screener'|'not_eligible'|'demographics'|'questions'|'result'|'interview'|'thankyou'

export default function Home() {
  const [stage, setStage]           = useState<AppStage>('screener')
  const [demographics, setDemo]     = useState<DemographicData | null>(null)
  const [answers, setAnswers]       = useState<Record<number,number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [responseId, setResponseId] = useState<string|null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f2ff] via-[#e8eaf6] to-[#fce4ec] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {stage==='screener'     && <Section0Screener onYes={()=>setStage('demographics')} onNo={()=>setStage('not_eligible')} />}
        {stage==='not_eligible' && <NotEligible />}
        {stage==='demographics' && <Section1Demographics onSubmit={(d)=>{setDemo(d);setStage('questions')}} />}
        {stage==='questions'    && demographics && (
          <Section2Questions demographics={demographics} onComplete={(ans,score,id)=>{setAnswers(ans);setTotalScore(score);setResponseId(id);setStage('result')}} />
        )}
        {stage==='result'    && <SectionResult score={totalScore} onContinue={(ni)=>setStage(ni?'interview':'thankyou')} />}
        {stage==='interview' && responseId && <SectionInterview responseId={responseId} onSubmit={()=>setStage('thankyou')} />}
        {stage==='thankyou'  && <ThankYou />}
      </div>
    </main>
  )
}

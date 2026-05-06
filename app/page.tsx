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
  consent: boolean
  gender: string
  age_range: string
  university: string
  year: string
  subject: string
  financial_background: string
  ordinal_position: string
}

export type AppStage =
  | 'screener'
  | 'not_eligible'
  | 'demographics'
  | 'questions'
  | 'result'
  | 'interview'
  | 'thankyou'

export default function Home() {
  const [stage, setStage] = useState<AppStage>('screener')
  const [demographics, setDemographics] = useState<DemographicData | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [responseId, setResponseId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {stage === 'screener' && (
          <Section0Screener
            onYes={() => setStage('demographics')}
            onNo={() => setStage('not_eligible')}
          />
        )}

        {stage === 'not_eligible' && <NotEligible />}

        {stage === 'demographics' && (
          <Section1Demographics
            onSubmit={(data) => {
              setDemographics(data)
              setStage('questions')
            }}
          />
        )}

        {stage === 'questions' && demographics && (
          <Section2Questions
            demographics={demographics}
            onComplete={(ans, score, id) => {
              setAnswers(ans)
              setTotalScore(score)
              setResponseId(id)
              setStage('result')
            }}
          />
        )}

        {stage === 'result' && (
          <SectionResult
            score={totalScore}
            onContinue={(needsInterview) => {
              if (needsInterview) setStage('interview')
              else setStage('thankyou')
            }}
          />
        )}

        {stage === 'interview' && responseId && (
          <SectionInterview
            responseId={responseId}
            onSubmit={() => setStage('thankyou')}
          />
        )}

        {stage === 'thankyou' && <ThankYou />}
      </div>
    </main>
  )
}

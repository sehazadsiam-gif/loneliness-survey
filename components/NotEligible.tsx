'use client'

export default function NotEligible() {
  return (
    <div className="animate-scale text-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 md:p-14">
        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Thank You for Your Interest
        </h2>
        <p className="text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
          Currently, this research is limited to university students. We appreciate 
          your willingness to participate and value your time.
        </p>
      </div>
    </div>
  )
}

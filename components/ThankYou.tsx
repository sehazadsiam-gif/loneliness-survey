'use client'

export default function ThankYou() {
  return (
    <div className="animate-scale text-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 md:p-14">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Participation Complete
        </h2>
        <p className="text-slate-500 leading-relaxed mb-10 max-w-sm mx-auto font-medium">
          Your responses have been recorded securely. Your contribution is vital to our research 
          on emotional well-being and sensing.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Research Incentive</p>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            Five participants will be selected via raffle for a 200 BDT bKash reward. 
            Winners will be contacted directly.
          </p>
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Academic Research Study &middot; BRAC University
        </p>
      </div>
    </div>
  )
}

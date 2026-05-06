'use client'

export default function Section0Screener({
  onYes,
  onNo,
}: {
  onYes: () => void
  onNo: () => void
}) {
  return (
    <div className="animate-fade-slide">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <span className="inline-block bg-white text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          Research Study &middot; BRACU
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl text-slate-900 leading-tight mb-8 text-center font-bold tracking-tight">
          Emotion-Aware Sensing: <br />
          <span className="text-blue-600">Tracking Loneliness</span> through<br />
          Physiological & Behavioural Signals
        </h1>

        {/* Intro */}
        <p className="text-slate-500 text-lg leading-relaxed mb-10 text-center max-w-2xl mx-auto font-medium">
          This study explores the detection and understanding of loneliness through 
          advanced sensing methods. All data is processed securely for academic research.
        </p>

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 min-w-[160px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
            <span className="text-sm font-bold text-slate-900">~4 minutes</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 min-w-[160px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incentive</span>
            <span className="text-sm font-bold text-slate-900">
              5 winners &middot; 200 BDT
            </span>
          </div>
        </div>

        {/* Screener Question */}
        <div className="bg-slate-900 rounded-3xl p-8 mb-8 text-white">
          <p className="text-xl font-semibold text-center mb-8 text-slate-200">
            Are you currently a university student?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onYes}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold transition-all flex-1 max-w-[200px]"
            >
              Yes, I am
            </button>
            <button
              onClick={onNo}
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold transition-all flex-1 max-w-[200px]"
            >
              No
            </button>
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
          Strictly Confidential &middot; Academic Use Only
        </p>
      </div>
    </div>
  )
}

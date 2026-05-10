'use client'
export default function Section0Screener({ onYes, onNo }: { onYes:()=>void; onNo:()=>void }) {
  return (
    <div className="animate-fade-slide">
      <div className="text-center mb-8">
        <span className="inline-block bg-white/70 backdrop-blur-sm text-[#3949ab] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border border-[#7986cb]/30">
          Research Study
        </span>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="font-display text-2xl md:text-3xl text-[#1a1a2e] leading-tight mb-6 text-center">
          Emotion-Aware Sensing:<br/>
          <span className="italic text-[#5c6bc0]">Tracking Loneliness</span> through<br/>
          Physiological and Behavioural Signals
        </h1>
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7986cb]/30" />
          <span className="text-[#7986cb]">+</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7986cb]/30" />
        </div>
        <p className="text-gray-600 text-base leading-relaxed mb-6 text-center">
          This study is part of a research project on Emotion-Aware Sensing, which aims to detect and better understand loneliness through physiological and behavioral signals. All information will be used strictly for research purposes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <div className="flex items-center gap-2 bg-[#f0f2ff] rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-[#1a1a2e]">Estimated time: 4 minutes</span>
          </div>
          <div className="flex items-center gap-2 bg-[#f0f2ff] rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-[#1a1a2e]">5 lucky winners — 200 BDT via bKash</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#7986cb]/10 to-[#f48fb1]/10 rounded-2xl p-6 mb-6">
          <p className="font-display text-lg text-[#1a1a2e] text-center mb-5">Are you currently a university student?</p>
          <div className="flex gap-4 justify-center">
            <button onClick={onYes} className="btn-primary flex-1 max-w-[180px]">Yes, I am</button>
            <button onClick={onNo} className="flex-1 max-w-[180px] bg-white border-2 border-gray-200 text-gray-600 rounded-xl px-6 py-3 font-semibold text-base hover:border-gray-400 transition-all">No</button>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">Confidential — Academic use only — No identifying data shared</p>
      </div>
    </div>
  )
}

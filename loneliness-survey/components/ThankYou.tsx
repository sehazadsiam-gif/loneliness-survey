'use client'
export default function ThankYou() {
  return (
    <div className="animate-scale text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 md:p-14">
        <h2 className="font-display text-2xl text-[#1a1a2e] mb-4">Thank You for Participating</h2>
        <p className="text-gray-500 leading-relaxed mb-6">Your responses have been recorded and will contribute to important research on loneliness and emotional well-being.</p>
        <div className="bg-gradient-to-br from-[#7986cb]/10 to-[#f48fb1]/10 rounded-2xl p-5">
          <p className="text-sm text-[#1a1a2e] font-semibold mb-1">Raffle Draw</p>
          <p className="text-sm text-gray-500">5 lucky participants will receive 200 BDT via bKash. Results will be announced after data collection closes.</p>
        </div>
        <p className="text-xs text-gray-400 mt-6">For questions, contact the research team at your institution.</p>
      </div>
    </div>
  )
}

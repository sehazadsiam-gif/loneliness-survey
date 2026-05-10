'use client'
export default function NotEligible() {
  return (
    <div className="animate-scale text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 md:p-14">
        <h2 className="font-display text-2xl text-[#1a1a2e] mb-4">Thank You for Your Time</h2>
        <p className="text-gray-500 leading-relaxed">
          This survey is dedicated to university students as part of an academic research study. We appreciate you stopping by — your time is truly valued.
        </p>
      </div>
    </div>
  )
}

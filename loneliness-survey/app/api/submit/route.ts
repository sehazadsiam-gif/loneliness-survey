import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { consent, gender, age_range, university, year, subject, financial_background, ordinal_position, q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20, total_score, loneliness_level } = body
    if (!consent) return NextResponse.json({ error:'Consent required' }, { status:400 })
    const supabase = getServiceClient()
    const { data, error } = await supabase.from('responses').insert([{ consent,gender,age_range,university,year,subject,financial_background,ordinal_position,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,total_score,loneliness_level }]).select('id').single()
    if (error) return NextResponse.json({ error:'Database error' }, { status:500 })
    return NextResponse.json({ id: data.id }, { status:200 })
  } catch { return NextResponse.json({ error:'Server error' }, { status:500 }) }
}

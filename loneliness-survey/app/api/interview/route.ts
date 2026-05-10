import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { response_id, email, phone, name } = await request.json()
    if (!email||!phone||!response_id) return NextResponse.json({ error:'Missing required fields' }, { status:400 })
    const supabase = getServiceClient()
    const { error } = await supabase.from('interview_requests').insert([{ response_id,email,phone,name:name||null }])
    if (error) return NextResponse.json({ error:'Database error' }, { status:500 })
    return NextResponse.json({ success:true }, { status:200 })
  } catch { return NextResponse.json({ error:'Server error' }, { status:500 }) }
}

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')
  const password = searchParams.get('password')

  const adminUser = process.env.ADMIN_USERNAME || 'adminhci'
  const adminPass = process.env.ADMIN_PASSWORD || 'adminhci'

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceClient()

  const { data: responses, error: rErr } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: interviews, error: iErr } = await supabase
    .from('interview_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (rErr || iErr) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ responses, interviews }, { status: 200 })
}

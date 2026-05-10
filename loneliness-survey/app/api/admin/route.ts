import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

const ADMIN_USERNAME = 'adminhci'
const ADMIN_PASSWORD = 'adminhci6789'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('username') !== ADMIN_USERNAME || searchParams.get('password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  }
  const supabase = getServiceClient()
  const { data: responses } = await supabase.from('responses').select('*').order('created_at',{ascending:false})
  const { data: interviews } = await supabase.from('interview_requests').select('*').order('created_at',{ascending:false})
  return NextResponse.json({ responses, interviews }, { status:200 })
}

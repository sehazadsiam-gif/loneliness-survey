'use client'
import { useState } from 'react'

type ResponseRow = {
  id:string; created_at:string; gender:string; age_range:string; university:string; year:string
  subject:string; financial_background:string; ordinal_position:string
  q1:number;q2:number;q3:number;q4:number;q5:number;q6:number;q7:number;q8:number;q9:number;q10:number
  q11:number;q12:number;q13:number;q14:number;q15:number;q16:number;q17:number;q18:number;q19:number;q20:number
  total_score:number; loneliness_level:string
}
type InterviewRow = { id:string; response_id:string; email:string; phone:string; name:string|null; created_at:string }

const LEVEL_COLORS: Record<string,string> = {
  'Low Loneliness':'#4caf50','Moderate Loneliness':'#ff9800','High Loneliness':'#f44336','Very High Loneliness':'#9c27b0'
}
const Q_LABELS = [
  'In tune with people around you','Lack companionship','No one to turn to','Feel alone','Part of a group of friends',
  'Lot in common with people','No longer close to anyone','Interests not shared by others','Outgoing and friendly','Close to people',
  'Feel left out','Relationships not meaningful','No one really knows you well','Isolated from others','Can find companionship when wanted',
  'People who understand you','Feel shy','People around but not with you','People you can talk to','People you can turn to',
]

function lc(level:string){ return LEVEL_COLORS[level]||'#aaa' }

function BarChart({ data, labels, colors, height=180 }:{ data:number[]; labels:string[]; colors:string[]; height?:number }) {
  const max = Math.max(...data,1)
  return (
    <div style={{height}} className="flex items-end gap-1.5">
      {data.map((val,i)=>(
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
          <span className="text-xs font-medium mb-1" style={{color:colors[i],fontSize:10}}>{val}</span>
          <div className="w-full rounded-t" style={{height:`${(val/max)*(height-32)}px`,background:colors[i],minHeight:val>0?3:0}} />
          <span className="text-center mt-1 leading-tight" style={{color:'#666',fontSize:9,maxWidth:60,wordBreak:'break-word'}}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments, size=120 }:{ segments:{value:number;color:string;label:string}[]; size?:number }) {
  const total = segments.reduce((s,x)=>s+x.value,0)
  if (!total) return <div className="text-xs text-gray-400 text-center py-4">No data available.</div>
  const r=40,cx=size/2,cy=size/2
  let angle=-Math.PI/2
  const paths = segments.filter(s=>s.value>0).map(seg=>{
    const sweep=(seg.value/total)*2*Math.PI
    const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle)
    angle+=sweep
    const x2=cx+r*Math.cos(angle), y2=cy+r*Math.sin(angle)
    const large=sweep>Math.PI?1:0
    return { d:`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color:seg.color, label:seg.label, value:seg.value }
  })
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size}>
        {paths.map((p,i)=><path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth={2}/>)}
        <circle cx={cx} cy={cy} r={22} fill="white"/>
        <text x={cx} y={cy+4} textAnchor="middle" fontSize={11} fontWeight={500} fill="#333">{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map((s,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:s.color}}/>
            <span style={{fontSize:11,color:'#666'}}>{s.label} <strong style={{color:'#333'}}>{s.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreHistogram({ responses }:{ responses:ResponseRow[] }) {
  const buckets=[{l:'20–29',a:20,b:29},{l:'30–39',a:30,b:39},{l:'40–49',a:40,b:49},{l:'50–59',a:50,b:59},{l:'60–69',a:60,b:69},{l:'70–80',a:70,b:80}]
  return <BarChart data={buckets.map(b=>responses.filter(r=>r.total_score>=b.a&&r.total_score<=b.b).length)} labels={buckets.map(b=>b.l)} colors={['#4caf50','#8bc34a','#ff9800','#f44336','#e91e63','#9c27b0']} height={160}/>
}

function ScoreTimeline({ responses }:{ responses:ResponseRow[] }) {
  const sorted=[...responses].filter(r=>r.total_score>0).sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime()).slice(-30)
  if (sorted.length<2) return <div className="text-xs text-gray-400 py-4">Not enough data to display a trend.</div>
  const W=500,H=110,pad=20,scores=sorted.map(r=>r.total_score)
  const minS=Math.min(...scores),maxS=Math.max(...scores),range=maxS-minS||1
  const pts=scores.map((s,i)=>`${pad+(i/(scores.length-1))*(W-pad*2)},${H-pad-((s-minS)/range)*(H-pad*2)}`)
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts.join(' ')} fill="none" stroke="#3949ab" strokeWidth={2}/>
      {pts.map((pt,i)=>{ const [x,y]=pt.split(',').map(Number); return <circle key={i} cx={x} cy={y} r={3} fill={lc(sorted[i].loneliness_level)}/> })}
      <text x={pad} y={H-4} fontSize={9} fill="#999">{sorted[0]?.created_at?.slice(0,10)}</text>
      <text x={W-pad} y={H-4} fontSize={9} fill="#999" textAnchor="end">{sorted[sorted.length-1]?.created_at?.slice(0,10)}</text>
    </svg>
  )
}

function QuestionAvgChart({ responses }:{ responses:ResponseRow[] }) {
  const avgs=Array.from({length:20},(_,i)=>{
    const vals=responses.map(r=>Number((r as any)[`q${i+1}`])).filter(v=>!isNaN(v)&&v>0)
    return vals.length ? parseFloat((vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)) : 0
  })
  const W=540,H=20*20+10,lw=190
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {avgs.map((avg,i)=>{
        const y=i*20,bw=(avg/4)*(W-lw-40),col=avg<=2?'#4caf50':avg<=3?'#ff9800':'#f44336'
        return (
          <g key={i}>
            <text x={lw-6} y={y+14} textAnchor="end" fontSize={9} fill="#555">Q{i+1}: {Q_LABELS[i].slice(0,30)}</text>
            <rect x={lw} y={y+2} width={Math.max(bw,2)} height={13} rx={2} fill={col}/>
            <text x={lw+bw+4} y={y+13} fontSize={9} fill="#333" fontWeight={500}>{avg>0?avg:'—'}</text>
          </g>
        )
      })}
    </svg>
  )
}

const TABS=['Overview','Demographics','Questions','Responses','Interviews']

export default function AdminPage() {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [authed,setAuthed]=useState(false)
  const [authError,setAuthError]=useState('')
  const [responses,setResponses]=useState<ResponseRow[]>([])
  const [interviews,setInterviews]=useState<InterviewRow[]>([])
  const [loading,setLoading]=useState(false)
  const [tab,setTab]=useState('Overview')

  const login=async()=>{
    setLoading(true); setAuthError('')
    try {
      const res=await fetch(`/api/admin?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      if (res.status===401){ setAuthError('Invalid credentials.'); setLoading(false); return }
      const data=await res.json()
      setResponses(data.responses||[]); setInterviews(data.interviews||[]); setAuthed(true)
    } catch { setAuthError('Connection failed.') }
    setLoading(false)
  }

  const downloadCSV=()=>{
    const h=['ID','Date','University','Year','Subject','Gender','Age Range','Financial BG','Ordinal Position','Total Score','Loneliness Level']
    const rows=responses.map(r=>[r.id,new Date(r.created_at).toLocaleDateString(),r.university,r.year,r.subject,r.gender,r.age_range,r.financial_background,r.ordinal_position,r.total_score,r.loneliness_level])
    const csv=[h,...rows].map(r=>r.join(',')).join('\n')
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='loneliness_survey.csv'; a.click()
  }

  const levelCounts=['Low Loneliness','Moderate Loneliness','High Loneliness','Very High Loneliness'].map(l=>({ label:l, value:responses.filter(r=>r.loneliness_level===l).length, color:lc(l) }))
  const avgScore=responses.length ? Math.round(responses.reduce((a,r)=>a+r.total_score,0)/responses.length) : 0
  const ic='w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none transition-all bg-white'

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-400 mb-6">Loneliness Survey — Research Dashboard</p>
        <div className="space-y-3 mb-4">
          <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className={ic}/>
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} className={ic}/>
        </div>
        {authError && <p className="text-red-500 text-xs mb-3">{authError}</p>}
        <button onClick={login} disabled={loading} className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
          {loading?'Authenticating...':'Sign In'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Research Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Emotion-Aware Sensing: Loneliness Survey</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadCSV} className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-medium">Export CSV</button>
          <button onClick={()=>setAuthed(false)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Sign out</button>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab===t?'border-indigo-600 text-indigo-700':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {tab==='Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{label:'Total Responses',value:responses.length,color:'#3949ab'},{label:'Average Score',value:avgScore,color:'#ff9800'},{label:'Interview Requests',value:interviews.length,color:'#f44336'},{label:'Score 50 or above',value:responses.filter(r=>r.total_score>=50).length,color:'#9c27b0'}].map(c=>(
                <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
                  <p className="text-3xl font-semibold" style={{color:c.color}}>{c.value}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Loneliness Level Distribution</p>
                <DonutChart segments={levelCounts} size={130}/>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Score Histogram</p>
                <ScoreHistogram responses={responses}/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-700 mb-1">Score Trend Over Time</p>
              <p className="text-xs text-gray-400 mb-3">Last 30 submissions. Dots are colored by loneliness level.</p>
              <ScoreTimeline responses={responses}/>
              <div className="flex flex-wrap gap-4 mt-3">
                {Object.entries(LEVEL_COLORS).map(([l,c])=>(
                  <span key={l} className="flex items-center gap-1.5" style={{fontSize:11,color:'#555'}}>
                    <span className="w-2 h-2 rounded-full" style={{background:c}}/>{l.replace(' Loneliness','')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==='Demographics' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Gender Distribution</p>
                <DonutChart segments={['Male','Female','Non-binary','Prefer not to say'].map((g,i)=>({label:g,value:responses.filter(r=>r.gender===g).length,color:['#3949ab','#e91e63','#9c27b0','#607d8b'][i]}))} size={130}/>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Age Range</p>
                <BarChart data={['17–19','20–22','23–25','26+'].map(r=>responses.filter(res=>res.age_range===r).length)} labels={['17–19','20–22','23–25','26+']} colors={['#5c6bc0','#7986cb','#9fa8da','#c5cae9']} height={140}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Year of Study</p>
                <BarChart data={['1st Year','2nd Year','3rd Year','4th Year','5th Year +'].map(y=>responses.filter(r=>r.year===y).length)} labels={['1st','2nd','3rd','4th','5th+']} colors={['#43a047','#66bb6a','#81c784','#a5d6a7','#c8e6c9']} height={140}/>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Financial Background</p>
                <BarChart data={['Low income','Lower-middle income','Middle income','Upper-middle income','High income'].map(c=>responses.filter(r=>r.financial_background===c).length)} labels={['Low','Lower-mid','Middle','Upper-mid','High']} colors={['#f44336','#ff9800','#ffc107','#8bc34a','#4caf50']} height={140}/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-700 mb-4">Top Universities by Response Count</p>
              {(()=>{ const freq:Record<string,number>={}; responses.forEach(r=>{ if(r.university) freq[r.university]=(freq[r.university]||0)+1 }); const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8); return <BarChart data={sorted.map(s=>s[1])} labels={sorted.map(s=>s[0])} colors={['#3949ab','#5c6bc0','#7986cb','#9fa8da','#c5cae9','#3949ab','#5c6bc0','#7986cb']} height={160}/> })()}
            </div>
          </div>
        )}

        {tab==='Questions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-700 mb-1">Average Response per Question (scale 1–4)</p>
              <p className="text-xs text-gray-400 mb-4">Green indicates a low loneliness signal. Red indicates a high loneliness signal.</p>
              {responses.length===0 ? <p className="text-xs text-gray-400">No data available.</p> : <QuestionAvgChart responses={responses}/>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({length:20},(_,i)=>{
                const q=`q${i+1}` as keyof ResponseRow
                const dist=[1,2,3,4].map(v=>responses.filter(r=>Number(r[q])===v).length)
                const total=dist.reduce((a,b)=>a+b,0)
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">Q{i+1}</p>
                    <p className="text-xs text-gray-500 mb-3 leading-snug">{Q_LABELS[i]}</p>
                    <div className="space-y-1.5">
                      {['Never','Rarely','Sometimes','Always'].map((lbl,j)=>(
                        <div key={lbl} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-16">{lbl}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full" style={{width:total>0?`${(dist[j]/total)*100}%`:'0%',background:['#4caf50','#8bc34a','#ff9800','#f44336'][j]}}/>
                          </div>
                          <span className="text-xs text-gray-500 w-5 text-right">{dist[j]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab==='Responses' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">All Survey Responses</p>
              <span className="text-xs text-gray-400">{responses.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                    {['Date','University','Year','Gender','Age','Financial Background','Score','Level'].map(h=><th key={h} className="px-4 py-3 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {responses.map(r=>(
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 text-xs">{r.university}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.year}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.gender}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.age_range}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.financial_background}</td>
                      <td className="px-4 py-3 font-semibold text-xs" style={{color:lc(r.loneliness_level)}}>{r.total_score}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium text-white whitespace-nowrap" style={{background:lc(r.loneliness_level)}}>{r.loneliness_level?.replace(' Loneliness','')}</span></td>
                    </tr>
                  ))}
                  {responses.length===0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">No responses recorded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='Interviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {label:'Total Requests',value:interviews.length,color:'#3949ab'},
                {label:'Eligible Respondents',value:responses.filter(r=>r.total_score>=50).length,color:'#f44336'},
                {label:'Participation Rate',value:(responses.filter(r=>r.total_score>=50).length>0?Math.round((interviews.length/responses.filter(r=>r.total_score>=50).length)*100):0)+'%',color:'#4caf50'},
              ].map(c=>(
                <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
                  <p className="text-3xl font-semibold" style={{color:c.color}}>{c.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Interview Request List</p>
                <span className="text-xs text-gray-400">{interviews.length} requests</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                      {['Date','Name','Email','Phone','Response ID'].map(h=><th key={h} className="px-4 py-3 text-left">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {interviews.map(iv=>(
                      <tr key={iv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(iv.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-700 text-xs font-medium">{iv.name||'—'}</td>
                        <td className="px-4 py-3 text-indigo-600 text-xs">{iv.email}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{iv.phone}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">{iv.response_id?.slice(0,8)}...</td>
                      </tr>
                    ))}
                    {interviews.length===0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">No interview requests received yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

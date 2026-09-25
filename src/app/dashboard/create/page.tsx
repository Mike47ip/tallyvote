'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TenantShell } from '@/components/tenant/TenantShell'
import { Card, Button, Input, Alert } from '@/components/ui'

export default function CreateElectionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title:'', description:'', short_code:'', starts_at:'', ends_at:'', anonymous:true })
  const [candidates, setCandidates] = useState(['',''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState<{id:string; short_code:string}|null>(null)
  const f = (k: string, v: any) => setForm(p => ({...p, [k]:v}))

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setError('Title required'); return }
    if (!form.short_code) { setError('Short code required'); return }
    if (!form.ends_at) { setError('End date required'); return }
    if (candidates.filter(c=>c.trim()).length < 2) { setError('At least 2 candidates required'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/elections', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, candidates}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create')
      setPublished({ id: data.id, short_code: data.shortCode ?? form.short_code })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const inp = "w-full bg-[#1E2A47] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"

  if (published) return (
    <TenantShell title="Election Published 🎉">
      <Card className="max-w-md">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-black text-lg mb-5">Election is Live!</p>
        <div className="space-y-3 mb-5">
          <div className="bg-[#1E2A47] rounded-xl p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">🔢 Short Code</p><p className="text-2xl font-black tracking-widest">{published.short_code}</p></div>
          <div className="bg-[#1E2A47] rounded-xl p-3"><p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">🔗 Voter Link</p><p className="text-xs text-indigo-400 font-mono break-all">{process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001'}/vote/{published.id}</p></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard/qr')}>Get QR Code</Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard/elections')}>View Elections</Button>
        </div>
      </Card>
    </TenantShell>
  )

  return (
    <TenantShell title="Create Election" subtitle="Set up a new election for your members.">
      <div className="max-w-xl">
        <Card>
          <h2 className="text-lg font-black mb-1">New Election</h2>
          <p className="text-xs text-slate-400 mb-6">Goes live immediately when published.</p>
          <form onSubmit={handlePublish} className="space-y-4">
            {error && <Alert type="error" message={error}/>}
            <Input label="Election Title *" placeholder="e.g. Presidential Election 2025" value={form.title} onChange={e => f('title',e.target.value)}/>
            <Input label="Short Code * (members type this to find the election)" placeholder="e.g. PRES25" maxLength={10} value={form.short_code} onChange={e => f('short_code',e.target.value.toUpperCase())}/>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
              <textarea className={`${inp} resize-none`} rows={3} placeholder="Tell members what they're voting for..." value={form.description} onChange={e => f('description',e.target.value)}/></div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" type="datetime-local" value={form.starts_at} onChange={e => f('starts_at',e.target.value)}/>
              <Input label="End Date *"  type="datetime-local" value={form.ends_at}  onChange={e => f('ends_at',e.target.value)}/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Candidates *</label>
              <div className="space-y-2 mb-2">
                {candidates.map((c,i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inp} flex-1`} placeholder={`Candidate ${i+1}`} value={c} onChange={e => setCandidates(p => p.map((x,j) => j===i?e.target.value:x))}/>
                    {candidates.length>2 && <button type="button" onClick={() => setCandidates(p => p.filter((_,j)=>j!==i))} className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm">✕</button>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setCandidates(p=>[...p,''])} className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">+ Add candidate</button>
            </div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Anonymous voting?</label>
              <select className={inp} value={form.anonymous?'true':'false'} onChange={e => f('anonymous',e.target.value==='true')}>
                <option value="true">Yes — votes are anonymous</option>
                <option value="false">No — require member ID</option>
              </select>
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button variant="ghost" type="button" onClick={() => router.push('/dashboard/elections')}>Cancel</Button>
              <Button type="submit" loading={loading} className="flex-1">Publish Election</Button>
            </div>
          </form>
        </Card>
      </div>
    </TenantShell>
  )
}

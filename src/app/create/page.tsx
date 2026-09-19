'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Card, Button } from '@/components/ui'
import { VOTER_URL } from '@/lib/utils'

export default function CreatePage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState(['',''])
  const [published, setPublished] = useState<string|null>(null)
  const f = "w-full bg-[#1E2A47] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"

  if (published) return (
    <AppShell title="Election Published" subtitle="Share the link or QR code with your members.">
      <Card className="max-w-md">
        <div className="text-4xl mb-3">🎉</div>
        <p className="font-black text-lg mb-2">Election is Live!</p>
        <p className="text-xs text-slate-400 mb-5">Share this link with members to start collecting votes.</p>
        <div className="bg-[#1E2A47] rounded-lg px-4 py-3 font-mono text-xs text-indigo-400 mb-4 break-all">{VOTER_URL}/vote/{published}</div>
        <div className="flex gap-2">
          <Button onClick={()=>router.push('/qr')}>Get QR Code</Button>
          <Button variant="ghost" onClick={()=>router.push('/elections')}>View Elections</Button>
        </div>
      </Card>
    </AppShell>
  )

  return (
    <AppShell title="Create Election" subtitle="Set up a new election for your members.">
      <div className="max-w-xl">
        <Card>
          <h2 className="text-lg font-black mb-1">New Election</h2>
          <p className="text-xs text-slate-400 mb-6">Publish immediately or save as draft.</p>
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Election Title</label><input className={f} placeholder="e.g. Presidential Election 2025"/></div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label><textarea className={`${f} resize-none`} rows={3} placeholder="Tell members what they're voting for..."/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Start Date</label><input type="date" className={f}/></div>
              <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">End Date</label><input type="date" className={f}/></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Candidates / Options</label>
              <div className="space-y-2 mb-2">
                {candidates.map((c,i)=>(
                  <div key={i} className="flex gap-2">
                    <input className={`${f} flex-1`} value={c} onChange={e=>setCandidates(p=>p.map((x,j)=>j===i?e.target.value:x))} placeholder="Candidate name or option"/>
                    <button onClick={()=>setCandidates(p=>p.filter((_,j)=>j!==i))} className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm">✕</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>setCandidates(p=>[...p,''])} className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">+ Add candidate</button>
            </div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Anonymous voting?</label>
              <select className={f}><option>Yes — votes are anonymous</option><option>No — require member ID</option></select>
            </div>
          </div>
          <div className="flex gap-2.5 mt-7">
            <Button variant="ghost" onClick={()=>router.push('/elections')}>Cancel</Button>
            <Button variant="ghost">Save Draft</Button>
            <Button onClick={()=>setPublished('new-election-'+Date.now())}>Publish Election</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

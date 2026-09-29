// src/components/tenant/TenantElectionsClient.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Button, StatusBadge } from '@/components/ui'
import { CandidateBar } from './CandidateBar'
import { fmt } from '@/lib/utils'

const tabs = ['all','live','draft','closed'] as const

function ElectionCard({ e, voterUrl }: { e: any; voterUrl: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch(`/api/elections/${e.id}/counts`)
        if (res.ok) {
          const data = await res.json()
          const map: Record<string, number> = {}
          data.forEach((v: any) => { map[v.candidate_id] = Number(v.percentage) || 0 })
          setCounts(map)
        }
      } catch {}
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 5000)
    return () => clearInterval(interval)
  }, [e.id])

  return (
    <Card key={e.id} className="hover:border-indigo-600/40 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold">{e.title}</p>
          <p className="text-xs text-slate-400 mt-1">{fmt(e._count?.votes ?? 0)} votes · {new Date(e.endsAt).toLocaleDateString()}</p>
          {e.shortCode && <p className="text-xs text-indigo-400 mt-0.5 font-semibold">Code: {e.shortCode}</p>}
        </div>
        <StatusBadge status={e.status}/>
      </div>
      {e.candidates?.slice(0, 3).map((c: any, i: number) => (
        <CandidateBar key={c.id} name={c.name} pct={counts[c.id] ?? 0} index={i}/>
      ))}
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
        <Link href="/dashboard/results"><Button size="sm">Results</Button></Link>
        <a href={`${voterUrl}/vote/${e.id}`} target="_blank" rel="noopener"><Button variant="ghost" size="sm">Voter Link ↗</Button></a>
        <Link href="/dashboard/qr"><Button variant="ghost" size="sm">QR</Button></Link>
      </div>
    </Card>
  )
}

export function TenantElectionsClient({ elections, voterUrl }: { elections: any[]; voterUrl: string }) {
  const [tab, setTab] = useState<typeof tabs[number]>('all')
  const filtered = tab === 'all' ? elections : elections.filter(e => e.status === tab)

  return (
    <>
      <div className="flex gap-1 bg-[#151D35] p-1 rounded-xl w-fit mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab===t?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🗳️</p>
          <p className="text-sm">{elections.length === 0 ? 'No elections yet' : 'No results'}</p>
          {elections.length === 0 && <Link href="/dashboard/create"><Button className="mt-4">+ Create First Election</Button></Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e: any) => (
            <ElectionCard key={e.id} e={e} voterUrl={voterUrl}/>
          ))}
        </div>
      )}
    </>
  )
}
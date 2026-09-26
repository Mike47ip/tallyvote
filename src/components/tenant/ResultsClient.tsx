'use client'
import { useEffect, useState } from 'react'
import { GRADIENTS, initials } from '@/lib/utils'
import type { VoteCount } from '@/types'
const COLORS = ['bg-indigo-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-violet-500']

export function ResultsClient({ electionId, initialCounts }: { electionId: string; initialCounts: VoteCount[] }) {
  const [counts, setCounts] = useState(initialCounts)
  // Polling fallback for realtime (no Supabase in local dev)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/elections/${electionId}/counts`)
        if (res.ok) { const data = await res.json(); setCounts(data) }
      } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }, [electionId])

  return (
    <div className="space-y-4">
      {counts.map((v, i) => (
        <div key={v.candidate_id}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{background:GRADIENTS[i%GRADIENTS.length]}}>{initials(v.candidate_name)}</span>
              <span className="font-semibold text-sm">{v.candidate_name}</span>
              {i===0&&v.count>0&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Leading 👑</span>}
            </div>
            <div className="text-right"><span className="text-base font-black">{Number(v.percentage)||0}%</span><p className="text-[11px] text-slate-400">{v.count} votes</p></div>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${COLORS[i%COLORS.length]}`} style={{width:`${Number(v.percentage)||0}%`}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

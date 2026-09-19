'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Badge, Button, Card } from '@/components/ui'
import { CandidateBar } from '@/components/elections/CandidateBar'
import { VOTER_URL } from '@/lib/utils'
import type { Election } from '@/types'

const MOCK: Election[] = [
  { id:'1', org_id:'o1', title:'Presidential Election',  status:'live',   anonymous:true, starts_at:'', ends_at:'2025-12-31', created_at:'', candidates:[{id:'c1',election_id:'1',name:'Ama Owusu'},{id:'c2',election_id:'1',name:'Kofi Mensah'},{id:'c3',election_id:'1',name:'Abena Asante'}], vote_count:842 },
  { id:'2', org_id:'o1', title:'Community Rep Election', status:'live',   anonymous:true, starts_at:'', ends_at:'2025-12-31', created_at:'', candidates:[{id:'c4',election_id:'2',name:'Efua Kumi'},{id:'c5',election_id:'2',name:'Yaw Asare'}], vote_count:442 },
  { id:'3', org_id:'o1', title:'Best Member Award',      status:'draft',  anonymous:true, starts_at:'', ends_at:'2025-12-31', created_at:'', candidates:[], vote_count:0 },
  { id:'4', org_id:'o1', title:'Board Chair Vote 2024',  status:'closed', anonymous:true, starts_at:'', ends_at:'2024-12-31', created_at:'', candidates:[{id:'c6',election_id:'4',name:'Ama Owusu'}], vote_count:1100 },
]

const tabs = ['all','live','draft','closed'] as const

export default function ElectionsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>('all')
  const filtered = tab==='all' ? MOCK : MOCK.filter(e=>e.status===tab)
  return (
    <AppShell title="Elections" subtitle="Manage and monitor your elections.">
      <div className="flex gap-1 bg-[#151D35] p-1 rounded-xl w-fit mb-6">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab===t?'bg-indigo-600 text-white':'text-slate-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(e=>(
          <Card key={e.id} className="hover:border-indigo-600/40 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div><p className="font-bold">{e.title}</p><p className="text-xs text-slate-400 mt-1">{(e.vote_count??0).toLocaleString()} votes</p></div>
              <Badge status={e.status}/>
            </div>
            {e.candidates?.slice(0,3).map((c,i)=><CandidateBar key={c.id} name={c.name} pct={[44,33,23][i]??20} index={i} leading={i===0}/>)}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
              <Button size="sm">Results</Button>
              <a href={`${VOTER_URL}/vote/${e.id}`} target="_blank" rel="noopener"><Button variant="ghost" size="sm">Voter Link ↗</Button></a>
              <Button variant="ghost" size="sm">QR</Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

'use client'
import { AppShell } from '@/components/layout/AppShell'
import { Card, Button } from '@/components/ui'
import { VOTER_URL } from '@/lib/utils'

const elections = [
  { id:'1', title:'Presidential Election',  color:'#4F46E5' },
  { id:'2', title:'Community Rep Election', color:'#10B981' },
]

function QRBox({ color }: { color:string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <rect x="5" y="5" width="30" height="30" rx="3" fill="#0F1629"/>
      <rect x="10" y="10" width="20" height="20" rx="2" fill="white"/>
      <rect x="14" y="14" width="12" height="12" rx="1" fill="#0F1629"/>
      <rect x="65" y="5" width="30" height="30" rx="3" fill="#0F1629"/>
      <rect x="70" y="10" width="20" height="20" rx="2" fill="white"/>
      <rect x="74" y="14" width="12" height="12" rx="1" fill="#0F1629"/>
      <rect x="5" y="65" width="30" height="30" rx="3" fill="#0F1629"/>
      <rect x="10" y="70" width="20" height="20" rx="2" fill="white"/>
      <rect x="14" y="74" width="12" height="12" rx="1" fill="#0F1629"/>
      <g fill="#0F1629">
        <rect x="40" y="5" width="5" height="5"/><rect x="50" y="5" width="5" height="5"/>
        <rect x="5" y="40" width="5" height="5"/><rect x="20" y="40" width="5" height="5"/><rect x="40" y="40" width="5" height="5"/><rect x="60" y="40" width="5" height="5"/><rect x="80" y="40" width="5" height="5"/>
        <rect x="10" y="50" width="5" height="5"/><rect x="35" y="50" width="5" height="5"/><rect x="55" y="50" width="5" height="5"/><rect x="75" y="50" width="5" height="5"/>
        <rect x="40" y="65" width="5" height="5"/><rect x="60" y="65" width="5" height="5"/>
        <rect x="45" y="75" width="5" height="5"/><rect x="65" y="75" width="5" height="5"/>
        <rect x="40" y="85" width="5" height="5"/><rect x="55" y="85" width="5" height="5"/><rect x="80" y="85" width="5" height="5"/>
      </g>
      <rect x="44" y="44" width="12" height="12" rx="2" fill={color}/>
    </svg>
  )
}

export default function QRPage() {
  return (
    <AppShell title="QR Codes" subtitle="Share these codes to let members vote instantly.">
      <div className="grid grid-cols-2 gap-5 max-w-2xl">
        {elections.map(e=>(
          <Card key={e.id} className="text-center">
            <p className="font-bold mb-1">{e.title}</p>
            <p className="text-xs text-slate-400 mb-5">My Organization</p>
            <div className="w-44 h-44 mx-auto mb-3 bg-white rounded-xl p-3"><QRBox color={e.color}/></div>
            <p className="text-xs text-slate-400 mb-1">{VOTER_URL}/vote/{e.id}</p>
            <a href={`${VOTER_URL}/vote/${e.id}`} target="_blank" rel="noopener">
              <Button variant="ghost" size="sm" className="w-full mb-2">Open Voter Link ↗</Button>
            </a>
            <Button size="sm" className="w-full">Download QR</Button>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

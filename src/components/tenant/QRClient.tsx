'use client'
import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
const QR_COLORS = ['#4F46E5','#10B981','#F59E0B','#F43F5E','#8B5CF6']

function QRBox({ color }: { color:string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <rect x="5" y="5" width="30" height="30" rx="3" fill="#0F1629"/><rect x="10" y="10" width="20" height="20" rx="2" fill="white"/><rect x="14" y="14" width="12" height="12" rx="1" fill="#0F1629"/>
      <rect x="65" y="5" width="30" height="30" rx="3" fill="#0F1629"/><rect x="70" y="10" width="20" height="20" rx="2" fill="white"/><rect x="74" y="14" width="12" height="12" rx="1" fill="#0F1629"/>
      <rect x="5" y="65" width="30" height="30" rx="3" fill="#0F1629"/><rect x="10" y="70" width="20" height="20" rx="2" fill="white"/><rect x="14" y="74" width="12" height="12" rx="1" fill="#0F1629"/>
      <g fill="#0F1629">
        <rect x="40" y="5" width="5" height="5"/><rect x="50" y="5" width="5" height="5"/>
        <rect x="5" y="40" width="5" height="5"/><rect x="20" y="40" width="5" height="5"/><rect x="45" y="40" width="5" height="5"/><rect x="65" y="40" width="5" height="5"/><rect x="80" y="40" width="5" height="5"/>
        <rect x="10" y="50" width="5" height="5"/><rect x="35" y="50" width="5" height="5"/><rect x="55" y="50" width="5" height="5"/><rect x="75" y="50" width="5" height="5"/>
        <rect x="40" y="65" width="5" height="5"/><rect x="60" y="65" width="5" height="5"/>
        <rect x="45" y="75" width="5" height="5"/><rect x="65" y="75" width="5" height="5"/>
        <rect x="40" y="85" width="5" height="5"/><rect x="55" y="85" width="5" height="5"/>
      </g>
      <rect x="44" y="44" width="12" height="12" rx="2" fill={color}/>
    </svg>
  )
}

export function QRClient({ elections, voterUrl }: { elections: any[]; voterUrl: string }) {
  const [copied, setCopied] = useState<string|null>(null)
  function copy(text: string, id: string) { navigator.clipboard.writeText(text); setCopied(id); setTimeout(()=>setCopied(null),2000) }
  if (elections.length===0) return (
    <div className="text-center py-20 text-slate-400"><p className="text-4xl mb-3">📱</p><p className="text-sm mb-4">No elections to generate QR codes for</p><Link href="/dashboard/create"><Button>+ Create Election</Button></Link></div>
  )
  return (
    <div className="grid grid-cols-2 gap-5 max-w-2xl">
      {elections.map((e: any, i: number) => {
        const link = `${voterUrl}/vote/${e.id}`
        return (
          <Card key={e.id} className="text-center">
            <p className="font-bold mb-1">{e.title}</p>
            {e.shortCode && <p className="text-xs text-indigo-400 font-bold mb-1">Code: {e.shortCode}</p>}
            <div className="w-44 h-44 mx-auto mb-3 bg-white rounded-xl p-3"><QRBox color={QR_COLORS[i%QR_COLORS.length]}/></div>
            <p className="text-[11px] text-slate-400 mb-3 break-all">{link}</p>
            <div className="space-y-2">
              <button onClick={() => copy(link, e.id)} className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20 transition-all">
                {copied===e.id ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <a href={link} target="_blank" rel="noopener"><Button variant="ghost" size="sm" className="w-full">Open Voter Portal ↗</Button></a>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

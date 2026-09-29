// src/components/tenant/QRClient.tsx
'use client'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'

const QR_COLORS = ['#4F46E5','#10B981','#F59E0B','#F43F5E','#8B5CF6']

export function QRClient({ elections, voterUrl }: { elections: any[]; voterUrl: string }) {
  const [copied, setCopied] = useState<string|null>(null)

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (elections.length === 0) return (
    <div className="text-center py-20 text-slate-400">
      <p className="text-4xl mb-3">📱</p>
      <p className="text-sm mb-4">No elections to generate QR codes for</p>
      <Link href="/dashboard/create"><Button>+ Create Election</Button></Link>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-5 max-w-2xl">
      {elections.map((e: any, i: number) => {
        const link = `${voterUrl}/vote/${e.id}`
        return (
          <Card key={e.id} className="text-center">
            <p className="font-bold mb-1">{e.title}</p>
            {e.shortCode && <p className="text-xs text-indigo-400 font-bold mb-3">Code: {e.shortCode}</p>}
            <div className="w-44 h-44 mx-auto mb-3 bg-white rounded-xl p-3 flex items-center justify-center">
              <QRCodeSVG
                value={link}
                size={152}
                fgColor="#0F1629"
                bgColor="#ffffff"
                level="H"
                imageSettings={{
                  src: '',
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mb-3 break-all">{link}</p>
            <div className="space-y-2">
              <button onClick={() => copy(link, e.id)}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20 transition-all">
                {copied === e.id ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <a href={link} target="_blank" rel="noopener">
                <Button variant="ghost" size="sm" className="w-full">Open Voter Portal ↗</Button>
              </a>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
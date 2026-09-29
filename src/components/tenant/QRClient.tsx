// src/components/tenant/QRClient.tsx
'use client'
import { useState, useRef } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'

const QR_COLORS = ['#4F46E5','#10B981','#F59E0B','#F43F5E','#8B5CF6']

export function QRClient({ elections, voterUrl }: { elections: any[]; voterUrl: string }) {
  const [copied, setCopied] = useState<string|null>(null)
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({})

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  function downloadQR(e: any) {
    const canvas = canvasRefs.current[e.id]
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${e.title.replace(/\s+/g, '-')}-QR.png`
    a.click()
  }

  function printQR(e: any) {
    const link = `${voterUrl}/vote/${e.id}`
    const win = window.open('', '_blank')
    if (!win) return
    const canvas = canvasRefs.current[e.id]
    const qrDataUrl = canvas?.toDataURL('image/png') ?? ''
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${e.title} — QR Code</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
            .card { text-align: center; padding: 40px; border: 2px solid #e5e7eb; border-radius: 16px; max-width: 340px; width: 100%; }
            .logo { font-size: 28px; font-weight: 900; margin-bottom: 8px; }
            .logo span { color: #4F46E5; }
            .title { font-size: 20px; font-weight: 700; margin-bottom: 4px; color: #111; }
            .code { font-size: 13px; color: #4F46E5; font-weight: 700; margin-bottom: 20px; }
            .qr { width: 200px; height: 200px; margin: 0 auto 20px; }
            .qr img { width: 100%; height: 100%; }
            .link { font-size: 10px; color: #6b7280; word-break: break-all; margin-bottom: 16px; }
            .instruction { font-size: 12px; color: #374151; background: #f9fafb; border-radius: 8px; padding: 10px 14px; }
            @media print { body { min-height: unset; } .card { border: 2px solid #000; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">Tally<span>Vote</span></div>
            <div class="title">${e.title}</div>
            ${e.shortCode ? `<div class="code">Code: ${e.shortCode}</div>` : ''}
            <div class="qr"><img src="${qrDataUrl}" alt="QR Code"/></div>
            <div class="link">${link}</div>
            <div class="instruction">📱 Scan with your phone camera to vote</div>
          </div>
          <script>window.onload = () => { window.print(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
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

            {/* Visible SVG QR */}
            <div className="w-44 h-44 mx-auto mb-3 bg-white rounded-xl p-3 flex items-center justify-center">
              <QRCodeSVG value={link} size={152} fgColor="#0F1629" bgColor="#ffffff" level="H"/>
            </div>

            {/* Hidden Canvas QR for download/print */}
            <div className="hidden">
              <QRCodeCanvas
                value={link}
                size={400}
                fgColor="#0F1629"
                bgColor="#ffffff"
                level="H"
                ref={(el: HTMLCanvasElement | null) => { canvasRefs.current[e.id] = el }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mb-3 break-all">{link}</p>

            <div className="space-y-2">
              <button onClick={() => copy(link, e.id)}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20 transition-all">
                {copied === e.id ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => downloadQR(e)}
                  className="py-2 text-xs font-semibold rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 transition-all">
                  ⬇ Download QR
                </button>
                <button onClick={() => printQR(e)}
                  className="py-2 text-xs font-semibold rounded-lg bg-amber-600/10 text-amber-400 border border-amber-600/20 hover:bg-amber-600/20 transition-all">
                  🖨 Print QR
                </button>
              </div>
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
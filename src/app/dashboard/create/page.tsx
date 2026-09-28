// src/app/dashboard/create/page.tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TenantShell } from '@/components/tenant/TenantShell'
import { Card, Button, Input, Alert } from '@/components/ui'
import * as XLSX from 'xlsx'

interface Voter { name: string; phone: string }

export default function CreateElectionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title:'', description:'', short_code:'', starts_at:'', ends_at:'', anonymous:true, restricted:false })
  const [candidates, setCandidates] = useState(['',''])
  const [voters, setVoters] = useState<Voter[]>([{ name:'', phone:'' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState<{id:string; short_code:string; restricted:boolean}|null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [csvFileName, setCsvFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const f = (k: string, v: any) => setForm(p => ({...p, [k]:v}))

  function parseCSVText(text: string): Voter[] {
    const lines = text.split('\n').filter(Boolean)
    const parsed: Voter[] = []
    for (const line of lines) {
      const [name, phone] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
      if (name && phone && name.toLowerCase() !== 'name') parsed.push({ name, phone })
    }
    return parsed
  }

  function parseXLSX(buffer: ArrayBuffer): Voter[] {
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    const parsed: Voter[] = []
    for (const row of rows) {
      const name = String(row[0] ?? '').trim()
      const phone = String(row[1] ?? '').trim()
      if (name && phone && name.toLowerCase() !== 'name') parsed.push({ name, phone })
    }
    return parsed
  }

  function handleFile(file: File) {
    if (!file) return
    const isXLSX = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    const isCSV  = file.name.endsWith('.csv')
    if (!isXLSX && !isCSV) return

    setCsvFileName(file.name)
    const reader = new FileReader()

    if (isCSV) {
      reader.onload = ev => {
        const parsed = parseCSVText(ev.target?.result as string)
        if (parsed.length > 0) setVoters(parsed)
      }
      reader.readAsText(file)
    } else {
      reader.onload = ev => {
        const parsed = parseXLSX(ev.target?.result as ArrayBuffer)
        if (parsed.length > 0) setVoters(parsed)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  function updateVoter(i: number, k: keyof Voter, v: string) {
    setVoters(p => p.map((voter, j) => j === i ? { ...voter, [k]: v } : voter))
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setError('Title required'); return }
    if (!form.short_code) { setError('Short code required'); return }
    if (!form.ends_at) { setError('End date required'); return }
    if (candidates.filter(c => c.trim()).length < 2) { setError('At least 2 candidates required'); return }
    if (form.restricted) {
      const validVoters = voters.filter(v => v.name.trim() && v.phone.trim())
      if (validVoters.length === 0) { setError('Add at least one eligible voter'); return }
    }

    setLoading(true); setError('')
    try {
      const validVoters = voters.filter(v => v.name.trim() && v.phone.trim())
      const res = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, candidates, voters: form.restricted ? validVoters : [] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create')
      setPublished({ id: data.id, short_code: data.shortCode ?? form.short_code, restricted: form.restricted })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const inp = "w-full bg-[#1E2A47] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
  const validVoterCount = voters.filter(v => v.name.trim() && v.phone.trim()).length

  if (published) return (
    <TenantShell title="Election Published 🎉">
      <Card className="max-w-md">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-black text-lg mb-5">Election is Live!</p>
        <div className="space-y-3 mb-5">
          <div className="bg-[#1E2A47] rounded-xl p-3">
            <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">🔢 Short Code</p>
            <p className="text-2xl font-black tracking-widest">{published.short_code}</p>
          </div>
          <div className="bg-[#1E2A47] rounded-xl p-3">
            <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">🔗 Voter Link</p>
            <p className="text-xs text-indigo-400 font-mono break-all">
              {process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001'}/vote/{published.id}
            </p>
          </div>
          {published.restricted && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-[10px] text-emerald-400 uppercase font-semibold mb-1">📱 SMS Status</p>
              <p className="text-xs text-emerald-400">Sending unique vote codes to eligible voters via SMS...</p>
            </div>
          )}
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

            <Input label="Election Title *" placeholder="e.g. Presidential Election 2025" value={form.title} onChange={e => f('title', e.target.value)}/>
            <Input label="Short Code * (members type this to find the election)" placeholder="e.g. PRES25" maxLength={10} value={form.short_code} onChange={e => f('short_code', e.target.value.toUpperCase())}/>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
              <textarea className={`${inp} resize-none`} rows={3} placeholder="Tell members what they're voting for..." value={form.description} onChange={e => f('description', e.target.value)}/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" type="datetime-local" value={form.starts_at} onChange={e => f('starts_at', e.target.value)}/>
              <Input label="End Date *" type="datetime-local" value={form.ends_at} onChange={e => f('ends_at', e.target.value)}/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Candidates *</label>
              <div className="space-y-2 mb-2">
                {candidates.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inp} flex-1`} placeholder={`Candidate ${i+1}`} value={c} onChange={e => setCandidates(p => p.map((x, j) => j === i ? e.target.value : x))}/>
                    {candidates.length > 2 && (
                      <button type="button" onClick={() => setCandidates(p => p.filter((_, j) => j !== i))} className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setCandidates(p => [...p, ''])} className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">+ Add candidate</button>
            </div>

            {/* Voting Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Voting Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => f('restricted', false)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold text-left transition-all ${!form.restricted ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 text-slate-400'}`}>
                  <p className="font-bold">🌐 Open</p>
                  <p className="text-[11px] mt-0.5 opacity-70">Anyone can vote</p>
                </button>
                <button type="button" onClick={() => f('restricted', true)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold text-left transition-all ${form.restricted ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 text-slate-400'}`}>
                  <p className="font-bold">🔒 Restricted</p>
                  <p className="text-[11px] mt-0.5 opacity-70">SMS code required</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Anonymous voting?</label>
              <select className={inp} value={form.anonymous ? 'true' : 'false'} onChange={e => f('anonymous', e.target.value === 'true')}>
                <option value="true">Yes — votes are anonymous</option>
                <option value="false">No — require member ID</option>
              </select>
            </div>

            {/* Eligible Voters — only shown for restricted */}
            {form.restricted && (
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold">Eligible Voters</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Each will receive a unique SMS code</p>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed transition-all py-6 px-4 text-center"
                  style={{
                    borderColor: dragOver ? '#6366F1' : 'rgba(255,255,255,0.12)',
                    background: dragOver ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput}/>
                  <div className="text-2xl mb-2">{csvFileName ? '✅' : '📂'}</div>
                  {csvFileName ? (
                    <>
                      <p className="text-sm font-semibold text-emerald-400">{csvFileName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{validVoterCount} voter{validVoterCount !== 1 ? 's' : ''} loaded — click to replace</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-300">Drop your file here or click to browse</p>
                      <p className="text-[11px] text-slate-500 mt-1">Accepts <span className="font-mono">.csv</span> or <span className="font-mono">.xlsx</span> — columns: name, phone</p>
                    </>
                  )}
                </div>

                {/* Manual entry */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {voters.map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className={`${inp} flex-1`} placeholder="Full name" value={v.name} onChange={e => updateVoter(i, 'name', e.target.value)}/>
                      <input className={`${inp} flex-1`} placeholder="Phone e.g. 0241234567" value={v.phone} onChange={e => updateVoter(i, 'phone', e.target.value)}/>
                      {voters.length > 1 && (
                        <button type="button" onClick={() => setVoters(p => p.filter((_, j) => j !== i))} className="px-2.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs flex-shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setVoters(p => [...p, { name:'', phone:'' }])}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">
                    + Add voter manually
                  </button>
                  <p className="text-[11px] text-slate-400">
                    {validVoterCount} voter{validVoterCount !== 1 ? 's' : ''} added
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <Button variant="ghost" type="button" onClick={() => router.push('/dashboard/elections')}>Cancel</Button>
              <Button type="submit" loading={loading} className="flex-1">
                {form.restricted ? '📱 Publish & Send SMS' : 'Publish Election'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </TenantShell>
  )
}
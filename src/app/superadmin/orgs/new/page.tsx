'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { Card, Button, Input, Alert } from '@/components/ui'

export default function NewTenantPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', email:'', phone:'', plan:'free', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{orgName:string; email:string; password:string}|null>(null)
  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
  const f = (k: string, v: string) => setForm(p => ({...p, [k]:v}))

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name||!form.email||!form.password) { setError('Name, email and password required'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/orgs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, slug}) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create tenant')
      setCreated({ orgName: form.name, email: form.email, password: form.password })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (created) return (
    <SuperAdminShell title="Tenant Created 🎉">
      <Card className="max-w-md">
        <p className="text-3xl mb-3">🎉</p>
        <p className="text-lg font-black mb-1">{created.orgName} is live!</p>
        <p className="text-xs text-slate-400 mb-6">Send these credentials to your client securely.</p>
        <div className="space-y-3 mb-6">
          <div className="bg-[#1E2A47] rounded-xl p-4"><p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Login URL</p><p className="text-sm text-indigo-400 font-mono">{process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/login</p></div>
          <div className="bg-[#1E2A47] rounded-xl p-4"><p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Email</p><p className="text-sm font-semibold">{created.email}</p></div>
          <div className="bg-[#1E2A47] rounded-xl p-4"><p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Temporary Password</p><p className="text-sm font-mono font-bold text-amber-400">{created.password}</p><p className="text-[10px] text-slate-500 mt-1">Ask client to change after first login</p></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/superadmin/orgs')}>View All Tenants</Button>
          <Button variant="ghost" onClick={() => { setCreated(null); setForm({name:'',email:'',phone:'',plan:'free',password:''}) }}>Create Another</Button>
        </div>
      </Card>
    </SuperAdminShell>
  )

  return (
    <SuperAdminShell title="Create New Tenant" subtitle="Set up a new organization on TallyVote.">
      <div className="max-w-lg">
        <Card>
          <h2 className="text-lg font-black mb-1">New Organization</h2>
          <p className="text-xs text-slate-400 mb-6">Creates a login account for the org admin.</p>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <Alert type="error" message={error}/>}
            <Input label="Organization Name *" placeholder="e.g. KNUST SRC, Ridge Church" value={form.name} onChange={e => f('name',e.target.value)}/>
            {form.name && <div className="bg-[#1E2A47] rounded-lg px-3 py-2 text-xs text-slate-400">Slug: <span className="text-indigo-400 font-mono">{slug}</span></div>}
            <Input label="Admin Email *" type="email" placeholder="admin@theirorg.com" value={form.email} onChange={e => f('email',e.target.value)}/>
            <Input label="Phone (optional)" type="tel" placeholder="+233 XX XXX XXXX" value={form.phone} onChange={e => f('phone',e.target.value)}/>
            <Input label="Temporary Password *" placeholder="Min. 8 characters" value={form.password} onChange={e => f('password',e.target.value)}/>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {(['free','starter','pro'] as const).map(plan => (
                  <button key={plan} type="button" onClick={() => f('plan',plan)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.plan===plan ? 'border-indigo-500 bg-indigo-600/10 text-white' : 'border-white/10 text-slate-400 hover:border-indigo-500/40'}`}>
                    {plan}<p className="text-[10px] font-normal mt-0.5 text-slate-500">{plan==='free'?'$0/mo':plan==='starter'?'$29/mo':'$79/mo'}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button variant="ghost" type="button" onClick={() => router.push('/superadmin/orgs')}>Cancel</Button>
              <Button type="submit" loading={loading} className="flex-1">Create Tenant</Button>
            </div>
          </form>
        </Card>
      </div>
    </SuperAdminShell>
  )
}

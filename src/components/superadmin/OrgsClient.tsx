'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Card, Button, PlanBadge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Organization } from '@/types'

export function OrgsClient({ orgs }: { orgs: (Organization & { _count: { elections: number } })[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all'|'free'|'starter'|'pro'>('all')

  const filtered = orgs.filter(o =>
    (o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'all' || o.plan === filter)
  )

  async function updatePlan(orgId: string, plan: string) {
    await fetch(`/api/orgs/${orgId}/plan`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan }) })
    window.location.reload()
  }

  async function toggleStatus(orgId: string, current: boolean) {
    await fetch(`/api/orgs/${orgId}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ is_active: !current }) })
    window.location.reload()
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <input className="flex-1 bg-[#1E2A47] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 placeholder:text-slate-500 transition-colors"
          placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}/>
        <div className="flex gap-1 bg-[#151D35] p-1 rounded-xl">
          {(['all','free','starter','pro'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all', filter===t?'bg-indigo-600 text-white':'text-slate-400 hover:text-white')}>{t}</button>
          ))}
        </div>
        <Link href="/superadmin/orgs/new"><Button size="sm">+ New Tenant</Button></Link>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-slate-400 text-sm">{orgs.length===0?'No tenants yet':'No results found'}</p>
          {orgs.length===0 && <Link href="/superadmin/orgs/new"><Button className="mt-4">+ Create First Tenant</Button></Link>}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.08]">
              {['Organization','Email','Plan','Status','Elections','Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(org => (
                <tr key={org.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-xs font-black flex-shrink-0">{org.name.slice(0,2).toUpperCase()}</div>
                      <div><p className="text-sm font-semibold">{org.name}</p><p className="text-xs text-slate-400">{org.slug}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{org.email}</td>
                  <td className="px-5 py-4">
                    <select value={org.plan} onChange={e => updatePlan(org.id, e.target.value)}
                      className="bg-[#1E2A47] border border-white/10 rounded-lg px-2 py-1 text-xs font-semibold text-white outline-none cursor-pointer">
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase', org.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')}>
                      {org.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{(org as any)._count?.elections ?? 0}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(org.id, org.isActive)}
                      className={cn('text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all', org.isActive ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20')}>
                      {org.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}

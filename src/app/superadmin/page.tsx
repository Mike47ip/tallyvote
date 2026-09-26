import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { StatCard, Card, PlanBadge, StatusBadge } from '@/components/ui'
import { getPlatformStats, getAllOrgs, getAllElections } from '@/lib/db'
import { fmt } from '@/lib/utils'
import Link from 'next/link'

export const revalidate = 10

export default async function SuperAdminPage() {
  const [stats, orgs, elections] = await Promise.all([getPlatformStats(), getAllOrgs(), getAllElections()])
  const PRICES = { free:0, starter:29, pro:79 }
  const mrr = orgs.filter(o => o.isActive).reduce((s, o) => s + (PRICES[o.plan] ?? 0), 0)

  return (
    <SuperAdminShell title="Platform Overview" subtitle="Everything happening across all tenants.">
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Tenants"    value={stats.total_orgs}      change={`${stats.active_orgs} active`}                    positive color="indigo"/>
        <StatCard label="Live Elections"   value={stats.live_elections}   change={`${stats.total_elections} total`}                  positive={stats.live_elections>0} color="emerald"/>
        <StatCard label="Total Votes"      value={fmt(stats.total_votes)} change="Across all orgs"                                  positive color="amber"/>
        <StatCard label="Est. MRR"         value={`$${mrr}`}              change={`${stats.pro_orgs} pro · ${stats.starter_orgs} starter`} positive={mrr>0} color="violet"/>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-7">
        {(['free','starter','pro'] as const).map(plan => (
          <Card key={plan} className="text-center">
            <PlanBadge plan={plan}/>
            <p className="text-3xl font-black mt-3 mb-1">{stats[`${plan}_orgs`]}</p>
            <p className="text-xs text-slate-400">organizations</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold">Recent Tenants</p>
            <Link href="/superadmin/orgs" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          {orgs.length === 0 ? (
            <div className="text-center py-8"><p className="text-3xl mb-2">🏢</p><p className="text-sm text-slate-400">No tenants yet</p><Link href="/superadmin/orgs/new" className="text-xs text-indigo-400 mt-2 block">Create first tenant →</Link></div>
          ) : orgs.slice(0,5).map(org => (
            <div key={org.id} className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-xs font-black flex-shrink-0">{org.name.slice(0,2).toUpperCase()}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{org.name}</p><p className="text-xs text-slate-400">{org.email}</p></div>
              <PlanBadge plan={org.plan}/>
            </div>
          ))}
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold">Live Elections</p>
            <Link href="/superadmin/elections" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          {elections.filter(e=>e.status==='live').length === 0 ? (
            <div className="text-center py-8"><p className="text-3xl mb-2">🗳️</p><p className="text-sm text-slate-400">No live elections</p></div>
          ) : elections.filter(e=>e.status==='live').slice(0,5).map(e => (
            <div key={e.id} className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0">
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{e.title}</p><p className="text-xs text-slate-400">{(e as any).organization?.name} · {fmt(e._count?.votes??0)} votes</p></div>
              <StatusBadge status={e.status}/>
            </div>
          ))}
        </Card>
      </div>
    </SuperAdminShell>
  )
}

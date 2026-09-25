import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { StatCard, Card, PlanBadge } from '@/components/ui'
import { getAllOrgs } from '@/lib/db'
export const revalidate = 30
const PRICES = { free:0, starter:29, pro:79 }
export default async function RevenuePage() {
  const orgs = await getAllOrgs()
  const active = orgs.filter(o => o.isActive)
  const mrr = active.reduce((s, o) => s + (PRICES[o.plan]??0), 0)
  return (
    <SuperAdminShell title="Revenue" subtitle="Platform earnings overview.">
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="MRR"         value={`$${mrr}`}                              change="Monthly recurring"  positive={mrr>0}  color="emerald"/>
        <StatCard label="ARR"         value={`$${mrr*12}`}                           change="Annual projection"  positive={mrr>0}  color="indigo"/>
        <StatCard label="Paying Orgs" value={active.filter(o=>o.plan!=='free').length} change="Starter + Pro"   color="amber"/>
        <StatCard label="Free Orgs"   value={active.filter(o=>o.plan==='free').length} change="Conversion targets" color="rose"/>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.08]"><p className="font-bold">All Organizations</p></div>
        <table className="w-full">
          <thead><tr className="border-b border-white/[0.08]">
            {['Organization','Plan','MRR','Status','Joined'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orgs.map(org => (
              <tr key={org.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4"><p className="text-sm font-semibold">{org.name}</p><p className="text-xs text-slate-400">{org.email}</p></td>
                <td className="px-5 py-4"><PlanBadge plan={org.plan}/></td>
                <td className="px-5 py-4 text-sm font-bold text-emerald-400">${PRICES[org.plan]}/mo</td>
                <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${org.isActive?'bg-emerald-500/10 text-emerald-400 border-emerald-500/30':'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>{org.isActive?'Active':'Suspended'}</span></td>
                <td className="px-5 py-4 text-xs text-slate-400">{new Date(org.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </SuperAdminShell>
  )
}

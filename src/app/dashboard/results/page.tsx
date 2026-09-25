import { TenantShell } from '@/components/tenant/TenantShell'
import { Card } from '@/components/ui'
import { getSession, getOrgByOwner, getOrgElections, getVoteCounts } from '@/lib/db'
import { ResultsClient } from '@/components/tenant/ResultsClient'
import { fmt } from '@/lib/utils'
import { redirect } from 'next/navigation'
export const revalidate = 5
export default async function ResultsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/auth/login')
  const org = await getOrgByOwner((session.user as any).id)
  if (!org) redirect('/dashboard')
  const elections = await getOrgElections(org.id)
  const live = elections.filter((e: any) => e.status==='live')
  const withCounts = await Promise.all(live.map(async (e: any) => ({ ...e, counts: await getVoteCounts(e.id) })))
  return (
    <TenantShell title="Results" subtitle="Live results and analytics." org={org as any}>
      {withCounts.length===0 ? (
        <div className="text-center py-20 text-slate-400"><p className="text-4xl mb-3">📊</p><p className="text-sm">No live elections</p></div>
      ) : withCounts.map((e: any) => (
        <Card key={e.id} className="mb-5">
          <div className="flex justify-between items-start mb-5">
            <div><p className="text-lg font-bold">{e.title}</p><p className="text-xs text-slate-400 mt-1">{fmt(e._count?.votes??0)} total votes</p></div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
          </div>
          {e.counts.length>0 ? <ResultsClient electionId={e.id} initialCounts={e.counts}/> : <p className="text-xs text-slate-500 text-center py-6">No votes yet</p>}
        </Card>
      ))}
    </TenantShell>
  )
}

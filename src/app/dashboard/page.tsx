import { TenantShell } from '@/components/tenant/TenantShell'
import { StatCard, Card } from '@/components/ui'
import { CandidateBar } from '@/components/tenant/CandidateBar'
import { VotesChart } from '@/components/charts/VotesChart'
import { getSession, getOrgByOwner, getOrgElections, getVoteCounts } from '@/lib/db'
import { fmt } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
export const revalidate = 10

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/auth/login')
  const org = await getOrgByOwner((session.user as any).id)
  if (!org) return <TenantShell title="Dashboard"><div className="text-center py-20"><p className="text-slate-400">No organization found. Contact support.</p></div></TenantShell>

  const elections = await getOrgElections(org.id)
  const liveElections = elections.filter((e: any) => e.status === 'live')
  const totalVotes = elections.reduce((s: number, e: any) => s + (e._count?.votes ?? 0), 0)
  const topElection = liveElections[0] ?? null
  const voteCounts = topElection ? await getVoteCounts(topElection.id) : []

  return (
    <TenantShell title="Dashboard" subtitle={`Welcome back — ${org.name}`} org={org as any}>
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Votes"     value={fmt(totalVotes)}        change={totalVotes>0?'↑ Live counting':'No votes yet'} positive={totalVotes>0} color="indigo"/>
        <StatCard label="Active Elections" value={liveElections.length}   change={liveElections.length>0?'Live now':'None active'} color="emerald"/>
        <StatCard label="Total Elections"  value={elections.length}       color="amber"/>
        <StatCard label="Plan"             value={org.plan.toUpperCase()} change={org.plan==='free'?'Upgrade for more':'Active'} color="violet"/>
      </div>
      <Card className="mb-7">
        <p className="text-base font-bold mb-1">Votes Over Time</p>
        <p className="text-xs text-slate-400 mb-5">{topElection?.title ?? 'No active elections'}</p>
        <VotesChart/>
      </Card>
      <div className="grid grid-cols-2 gap-5">
        {topElection ? (
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold">{topElection.title}</p>
                <p className="text-xs text-slate-400 mt-1">{fmt(topElection._count?.votes??0)} votes · closes {new Date(topElection.endsAt).toLocaleDateString()}</p>
                {topElection.shortCode && <p className="text-xs text-indigo-400 mt-0.5 font-semibold">Code: {topElection.shortCode}</p>}
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
            </div>
            {voteCounts.length>0 ? voteCounts.map((v,i) => <CandidateBar key={v.candidate_id} name={v.candidate_name} pct={Number(v.percentage)||0} index={i} leading={i===0}/>)
              : <p className="text-xs text-slate-500 text-center py-4">No votes yet — share the voting link!</p>}
          </Card>
        ) : (
          <Card className="flex items-center justify-center text-center py-12">
            <div><p className="text-3xl mb-2">🗳️</p><p className="font-bold text-sm mb-1">No active elections</p><Link href="/dashboard/create" className="text-xs text-indigo-400 mt-2 block">+ Create Election →</Link></div>
          </Card>
        )}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold">Recent Elections</p>
            <Link href="/dashboard/elections" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          {elections.length===0 ? (
            <div className="text-center py-8 text-slate-400"><p className="text-3xl mb-2">📋</p><p className="text-xs">No elections yet</p></div>
          ) : (elections as any[]).slice(0,5).map(e => (
            <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
              <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{e.title}</p><p className="text-[11px] text-slate-400">{fmt(e._count?.votes??0)} votes</p></div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${e.status==='live'?'bg-emerald-500/10 text-emerald-400 border-emerald-500/30':e.status==='draft'?'bg-amber-500/10 text-amber-400 border-amber-500/30':'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{e.status}</span>
            </div>
          ))}
        </Card>
      </div>
    </TenantShell>
  )
}

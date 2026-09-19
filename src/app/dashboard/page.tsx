import { AppShell } from '@/components/layout/AppShell'
import { StatCard, Card } from '@/components/ui'
import { CandidateBar } from '@/components/elections/CandidateBar'
import { ActivityFeed } from '@/components/elections/ActivityFeed'
import { VotesChart } from '@/components/charts/VotesChart'

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Welcome back — here's what's happening.">
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Votes Cast"  value="1,284" change="↑ +128 in last hour" positive color="indigo"/>
        <StatCard label="Active Elections"  value="2"     change="1 closing today" color="emerald"/>
        <StatCard label="Voter Turnout"     value="68%"   change="↑ Above average" positive color="amber"/>
        <StatCard label="Orgs Onboard"      value="1"     change="My Organization" color="rose"/>
      </div>
      <Card className="mb-7">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-base font-bold">Votes Over Time</p>
            <p className="text-xs text-slate-400 mt-1">Presidential Election — Today</p>
          </div>
        </div>
        <VotesChart/>
      </Card>
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div><p className="font-bold">Presidential Election</p><p className="text-xs text-slate-400 mt-1">842 votes · closes 5pm</p></div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
          </div>
          <CandidateBar name="Ama Owusu"    pct={44} index={0} leading/>
          <CandidateBar name="Kofi Mensah"  pct={33} index={1}/>
          <CandidateBar name="Abena Asante" pct={23} index={2}/>
        </Card>
        <ActivityFeed/>
      </div>
    </AppShell>
  )
}

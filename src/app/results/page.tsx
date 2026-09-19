import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui'
import { CandidateBar } from '@/components/elections/CandidateBar'
import { VotesChart } from '@/components/charts/VotesChart'

export default function ResultsPage() {
  return (
    <AppShell title="Results" subtitle="Live results and analytics.">
      <div className="grid grid-cols-2 gap-5 mb-7">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div><p className="font-bold">Presidential Election</p><p className="text-xs text-slate-400 mt-1">842 total · 68% turnout</p></div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
          </div>
          <CandidateBar name="Ama Owusu"    pct={44} index={0} leading/>
          <CandidateBar name="Kofi Mensah"  pct={33} index={1}/>
          <CandidateBar name="Abena Asante" pct={23} index={2}/>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div><p className="font-bold">Community Rep Election</p><p className="text-xs text-slate-400 mt-1">442 total · 54% turnout</p></div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
          </div>
          <CandidateBar name="Efua Kumi" pct={57} index={3} leading/>
          <CandidateBar name="Yaw Asare" pct={43} index={1}/>
        </Card>
      </div>
      <Card>
        <p className="font-bold mb-1">Hourly Vote Distribution</p>
        <p className="text-xs text-slate-400 mb-5">All elections combined</p>
        <VotesChart/>
      </Card>
    </AppShell>
  )
}

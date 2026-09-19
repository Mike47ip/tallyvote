import { Card } from '@/components/ui'
const items = [
  {color:'bg-indigo-400', text:<><strong>+12 votes</strong> in last 5 min</>, time:'now'},
  {color:'bg-emerald-400', text:<>QR scan from <strong>Block C</strong></>, time:'2m'},
  {color:'bg-indigo-400', text:<><strong>50% turnout</strong> milestone</>, time:'14m'},
  {color:'bg-amber-400', text:<>New election <strong>Q3 Review</strong> published</>, time:'1h'},
  {color:'bg-indigo-400', text:<>Voting opened for <strong>Presidential</strong></>, time:'3h'},
]
export function ActivityFeed() {
  return (
    <Card>
      <p className="text-base font-bold mb-4">Live Activity</p>
      {items.map((a,i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${a.color}`}/>
          <p className="text-xs flex-1">{a.text}</p>
          <span className="text-[11px] text-slate-500">{a.time}</span>
        </div>
      ))}
    </Card>
  )
}

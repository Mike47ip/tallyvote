import { GRADIENTS, initials } from '@/lib/utils'
const COLORS = ['bg-indigo-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-violet-500']
export function CandidateBar({ name, pct, index, leading }: { name:string; pct:number; index:number; leading?:boolean }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{background:GRADIENTS[index%GRADIENTS.length]}}>{initials(name)}</span>
          {name} {leading && '👑'}
        </div>
        <span className="text-sm font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${COLORS[index%COLORS.length]}`} style={{width:`${pct}%`}}/>
      </div>
    </div>
  )
}

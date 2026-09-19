import { cn } from '@/lib/utils'
import type { ElectionStatus } from '@/types'
import { ButtonHTMLAttributes } from 'react'

// Badge
const badgeStyles: Record<ElectionStatus,string> = {
  live:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  draft:  'bg-amber-500/10 text-amber-400 border-amber-500/30',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}
export function Badge({ status }: { status: ElectionStatus }) {
  return <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border', badgeStyles[status])}>{status}</span>
}

// Button
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?:'primary'|'ghost'|'danger'; size?:'sm'|'md' }
const btnV = { primary:'bg-indigo-600 text-white hover:bg-indigo-500', ghost:'bg-transparent text-slate-400 border border-white/10 hover:text-white hover:border-slate-400', danger:'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' }
const btnS = { sm:'px-3 py-1.5 text-xs rounded-md', md:'px-4 py-2 text-sm rounded-lg' }
export function Button({ variant='primary', size='md', className, children, ...props }: BtnProps) {
  return <button className={cn('font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px', btnV[variant], btnS[size], className)} {...props}>{children}</button>
}

// Card
export function Card({ className, children }: { className?:string; children:React.ReactNode }) {
  return <div className={cn('bg-[#151D35] border border-white/[0.08] rounded-2xl p-5', className)}>{children}</div>
}

// StatCard
export function StatCard({ label, value, change, positive, color='indigo' }: { label:string; value:string|number; change?:string; positive?:boolean; color?:'indigo'|'emerald'|'amber'|'rose' }) {
  const c = { indigo:'text-indigo-400', emerald:'text-emerald-400', amber:'text-amber-400', rose:'text-rose-400' }
  return (
    <Card>
      <p className="text-xs text-slate-400 font-medium mb-2">{label}</p>
      <p className={cn('text-4xl font-black leading-none', c[color])}>{value}</p>
      {change && <p className={cn('text-[11px] mt-1.5', positive ? 'text-emerald-400' : 'text-slate-400')}>{change}</p>}
    </Card>
  )
}

// LiveDot
export function LiveDot() {
  return (
    <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot" />Live
    </span>
  )
}

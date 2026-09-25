'use client'
import { cn } from '@/lib/utils'
import type { ElectionStatus, PlanTier } from '@/types'
import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('bg-[#151D35] border border-white/[0.08] rounded-2xl p-5', className)}>{children}</div>
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success'; size?: 'sm' | 'md' | 'lg'; loading?: boolean
}
const bv = { primary:'bg-indigo-600 text-white hover:bg-indigo-500', ghost:'bg-transparent text-slate-400 border border-white/10 hover:text-white hover:border-slate-400', danger:'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20', success:'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' }
const bs = { sm:'px-3 py-1.5 text-xs rounded-lg', md:'px-4 py-2.5 text-sm rounded-xl', lg:'px-6 py-3.5 text-base rounded-xl' }
export function Button({ variant='primary', size='md', loading, className, children, disabled, ...props }: BtnProps) {
  return (
    <button disabled={disabled||loading} className={cn('font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px', bv[variant], bs[size], className)} {...props}>
      {loading ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"/>Loading...</span> : children}
    </button>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string }
export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>}
      <input className={cn('w-full bg-[#1E2A47] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500', error && 'border-rose-500/50', className)} {...props}/>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  )
}

const statusStyles: Record<ElectionStatus, string> = {
  live:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  draft:  'bg-amber-500/10 text-amber-400 border-amber-500/30',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}
export function StatusBadge({ status }: { status: ElectionStatus }) {
  return <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border', statusStyles[status])}>{status}</span>
}

const planStyles: Record<PlanTier, string> = {
  free:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
  starter: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  pro:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
}
export function PlanBadge({ plan }: { plan: PlanTier }) {
  return <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border', planStyles[plan])}>{plan}</span>
}

export function StatCard({ label, value, change, positive, color='indigo' }: { label:string; value:string|number; change?:string; positive?:boolean; color?:'indigo'|'emerald'|'amber'|'rose'|'violet' }) {
  const c = { indigo:'text-indigo-400', emerald:'text-emerald-400', amber:'text-amber-400', rose:'text-rose-400', violet:'text-violet-400' }
  return (
    <Card>
      <p className="text-xs text-slate-400 font-medium mb-2">{label}</p>
      <p className={cn('text-4xl font-black leading-none', c[color])}>{value}</p>
      {change && <p className={cn('text-[11px] mt-1.5', positive ? 'text-emerald-400' : 'text-slate-400')}>{change}</p>}
    </Card>
  )
}

export function Alert({ type='error', message }: { type?:'error'|'success'|'warning'; message:string }) {
  const s = { error:'bg-rose-500/10 border-rose-500/20 text-rose-400', success:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', warning:'bg-amber-500/10 border-amber-500/20 text-amber-400' }
  return <div className={cn('border rounded-xl px-4 py-3 text-sm', s[type])}>{message}</div>
}

export function LiveDot() {
  return (
    <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot"/>Live
    </span>
  )
}

// src/components/tenant/TenantShell.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn, VOTER_URL } from '@/lib/utils'
import { LayoutDashboard, ClipboardList, Trophy, Plus, QrCode, LogOut, ExternalLink, ChevronRight } from 'lucide-react'
import type { Organization } from '@/types'

const nav = [
  { href:'/dashboard',           icon:LayoutDashboard, label:'Dashboard'        },
  { href:'/dashboard/elections', icon:ClipboardList,   label:'Elections'        },
  { href:'/dashboard/results',   icon:Trophy,          label:'Results'          },
  { href:'/dashboard/create',    icon:Plus,            label:'Create Election'  },
  { href:'/dashboard/qr',        icon:QrCode,          label:'QR Codes'         },
]

const planColors = { free:'bg-slate-500/10 text-slate-400 border-slate-500/20', starter:'bg-amber-500/10 text-amber-400 border-amber-500/20', pro:'bg-violet-500/10 text-violet-400 border-violet-500/20' }

export function TenantShell({ children, title, subtitle, org }: { children:React.ReactNode; title:string; subtitle?:string; org?: Organization }) {
  const path = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-60 bg-[#151D35] border-r border-white/[0.08] flex flex-col z-50">
        <div className="px-5 py-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg">🗳️</span>
            <p className="text-xl font-black">Tally<span className="text-indigo-400">Vote</span></p>
          </div>
          {org && <span className={cn('mt-3 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize', planColors[org.plan])}>{org.plan}</span>}
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {nav.map(({ href, icon:Icon, label }) => (
            <Link key={href} href={href} className={cn('flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5', path===href ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-[#1E2A47] hover:text-white')}>
              <Icon size={16} className="shrink-0"/>{label}
              {path===href && <ChevronRight size={14} className="ml-auto opacity-50"/>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <a href={VOTER_URL} target="_blank" rel="noopener" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/20 transition-all">
            <ExternalLink size={13}/>Open Voter Portal ↗
          </a>
          {org && (
            <div className="flex items-center gap-2.5 bg-[#1E2A47] px-3 py-2.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-xs font-black">{org.name.slice(0,2).toUpperCase()}</div>
              <div className="min-w-0"><p className="text-xs font-semibold truncate">{org.name}</p><p className="text-[10px] text-slate-500">Admin</p></div>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full">
            <LogOut size={14}/>Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-60 flex flex-col">
        <header className="sticky top-0 z-40 bg-[#0F1629] border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot"/>Live
            </span>
            <Link href="/dashboard/create" className="px-4 py-2 text-sm font-semibold text-slate-400 border border-white/10 rounded-lg hover:text-white hover:border-slate-400 transition-all">+ New Election</Link>
            <a href={VOTER_URL} target="_blank" rel="noopener" className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all">Open Voter Portal ↗</a>
          </div>
        </header>
        <main className="flex-1 p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}
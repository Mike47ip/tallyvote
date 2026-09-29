// src/components/superadmin/SuperAdminShell.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Building2, Trophy, DollarSign, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react'

const nav = [
  { href:'/superadmin',           icon:LayoutDashboard, label:'Overview'      },
  { href:'/superadmin/orgs',      icon:Building2,       label:'Organizations' },
  { href:'/superadmin/elections', icon:Trophy,          label:'All Elections' },
  { href:'/superadmin/revenue',   icon:DollarSign,      label:'Revenue'       },
  { href:'/superadmin/settings',  icon:Settings,        label:'Settings'      },
]

export function SuperAdminShell({ children, title, subtitle }: { children:React.ReactNode; title:string; subtitle?:string }) {
  const path = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const Sidebar = () => (
    <aside className={cn(
      'fixed inset-y-0 left-0 w-60 bg-[#151D35] border-r border-white/[0.08] flex flex-col z-50 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    )}>
      <div className="px-5 py-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg">🗳️</span>
            <p className="text-xl font-black">Tally<span className="text-indigo-400">Vote</span></p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={20}/>
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg w-fit">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"/>
          <span className="text-xs font-bold text-violet-400">Super Admin</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {nav.map(({ href, icon:Icon, label }) => (
          <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5', path===href ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-[#1E2A47] hover:text-white')}>
            <Icon size={16} className="shrink-0"/>{label}
            {path===href && <ChevronRight size={14} className="ml-auto opacity-50"/>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/[0.08]">
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full">
          <LogOut size={16}/>Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      <Sidebar/>

      <div className="flex-1 md:ml-60 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-[#0F1629] border-b border-white/[0.08] px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white flex-shrink-0">
              <Menu size={22}/>
            </button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 md:px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot"/>Platform Live
            </span>
            <Link href="/superadmin/orgs/new" className="px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all">+ New Tenant</Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}
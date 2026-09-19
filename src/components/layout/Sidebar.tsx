'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, VOTER_URL } from '@/lib/utils'
import { LayoutDashboard, ClipboardList, Trophy, Plus, QrCode, ExternalLink } from 'lucide-react'

const nav = [
  { section:'Overview', items:[
    { href:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { href:'/elections',  icon:ClipboardList,  label:'Elections', badge:2 },
    { href:'/results',    icon:Trophy,         label:'Results' },
  ]},
  { section:'Admin', items:[
    { href:'/create', icon:Plus,   label:'Create Election' },
    { href:'/qr',     icon:QrCode, label:'QR Codes' },
  ]},
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[#151D35] border-r border-white/[0.08] flex flex-col z-50">
      <div className="px-5 py-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg">🗳️</span>
          <p className="text-xl font-black tracking-tight">Tally<span className="text-indigo-400">Vote</span></p>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {nav.map(s => (
          <div key={s.section}>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">{s.section}</p>
            {s.items.map(({ href, icon:Icon, label, badge }) => (
              <Link key={href} href={href} className={cn(
                'flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5',
                path===href ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-[#1E2A47] hover:text-white'
              )}>
                <Icon size={16} className="shrink-0" />
                {label}
                {badge && <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Link to voter app */}
      <div className="p-4 border-t border-white/[0.08] space-y-3">
        <a href={VOTER_URL} target="_blank" rel="noopener"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/20 transition-all">
          <ExternalLink size={13} /> Open Voter Portal ↗
        </a>
        <div className="flex items-center gap-2.5 bg-[#1E2A47] px-3 py-2.5 rounded-xl">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-sm font-black">O</span>
          <div><p className="text-xs font-semibold">My Organization</p><p className="text-[10px] text-slate-500">Admin</p></div>
        </div>
      </div>
    </aside>
  )
}

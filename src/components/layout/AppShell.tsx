import { Sidebar } from './Sidebar'
import { LiveDot } from '@/components/ui'
import Link from 'next/link'
import { VOTER_URL } from '@/lib/utils'

interface Props { title:string; subtitle?:string; children:React.ReactNode }

export function AppShell({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <header className="sticky top-0 z-40 bg-[#0F1629] border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <LiveDot />
            <Link href="/create" className="px-4 py-2 text-sm font-semibold text-slate-400 border border-white/10 rounded-lg hover:text-white hover:border-slate-400 transition-all">+ New Election</Link>
            <a href={VOTER_URL} target="_blank" rel="noopener" className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all">Open Voter Portal ↗</a>
          </div>
        </header>
        <main className="flex-1 p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}

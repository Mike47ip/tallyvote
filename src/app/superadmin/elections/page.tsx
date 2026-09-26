import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { Card, StatusBadge } from '@/components/ui'
import { getAllElections } from '@/lib/db'
import { fmt } from '@/lib/utils'
export const revalidate = 10
export default async function SuperElectionsPage() {
  const elections = await getAllElections()
  return (
    <SuperAdminShell title="All Elections" subtitle="Every election across all tenants.">
      {elections.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><p className="text-4xl mb-3">🗳️</p><p className="text-sm">No elections yet</p></div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.08]">
              {['Election','Organization','Votes','Code','Status','Closes'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {elections.map(e => (
                <tr key={e.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm font-semibold">{e.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{(e as any).organization?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm font-semibold">{fmt((e as any)._count?.votes ?? 0)}</td>
                  <td className="px-5 py-4">{e.shortCode ? <span className="text-xs font-mono text-indigo-400 bg-indigo-600/10 px-2 py-1 rounded-lg">{e.shortCode}</span> : <span className="text-xs text-slate-500">—</span>}</td>
                  <td className="px-5 py-4"><StatusBadge status={e.status}/></td>
                  <td className="px-5 py-4 text-xs text-slate-400">{new Date(e.endsAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </SuperAdminShell>
  )
}

import { TenantShell } from '@/components/tenant/TenantShell'
import { getSession, getOrgByOwner, getOrgElections } from '@/lib/db'
import { QRClient } from '@/components/tenant/QRClient'
import { redirect } from 'next/navigation'
export const revalidate = 30
export default async function QRPage() {
  const session = await getSession()
  if (!session?.user) redirect('/auth/login')
  const org = await getOrgByOwner((session.user as any).id)
  if (!org) redirect('/dashboard')
  const elections = await getOrgElections(org.id)
  const active = elections.filter((e: any) => e.status==='live'||e.status==='draft')
  return (
    <TenantShell title="QR Codes" subtitle="Share these to let members vote instantly." org={org as any}>
      <QRClient elections={active as any} voterUrl={process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001'}/>
    </TenantShell>
  )
}

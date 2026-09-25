import { TenantShell } from '@/components/tenant/TenantShell'
import { getSession, getOrgByOwner, getOrgElections } from '@/lib/db'
import { TenantElectionsClient } from '@/components/tenant/TenantElectionsClient'
import { redirect } from 'next/navigation'
export const revalidate = 10
export default async function ElectionsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/auth/login')
  const org = await getOrgByOwner((session.user as any).id)
  if (!org) redirect('/dashboard')
  const elections = await getOrgElections(org.id)
  return (
    <TenantShell title="Elections" subtitle="Manage your organization's elections." org={org as any}>
      <TenantElectionsClient elections={elections as any} voterUrl={process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001'}/>
    </TenantShell>
  )
}

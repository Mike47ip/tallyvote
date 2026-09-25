import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { OrgsClient } from '@/components/superadmin/OrgsClient'
import { getAllOrgs } from '@/lib/db'
export const revalidate = 5
export default async function OrgsPage() {
  const orgs = await getAllOrgs()
  return (
    <SuperAdminShell title="Organizations" subtitle="All tenants on the platform.">
      <OrgsClient orgs={orgs as any}/>
    </SuperAdminShell>
  )
}

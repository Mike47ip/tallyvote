import { SuperAdminShell } from '@/components/superadmin/SuperAdminShell'
import { Card } from '@/components/ui'
export default function SettingsPage() {
  return (
    <SuperAdminShell title="Settings" subtitle="Platform configuration.">
      <Card className="max-w-lg">
        <p className="font-bold mb-1">Platform Settings</p>
        <p className="text-sm text-slate-400">Coming soon — USSD config, email templates, billing integration.</p>
      </Card>
    </SuperAdminShell>
  )
}

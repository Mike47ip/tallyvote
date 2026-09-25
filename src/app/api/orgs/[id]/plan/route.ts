import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateOrgPlan } from '@/lib/db'
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { plan } = await req.json()
  await updateOrgPlan(params.id, plan)
  return NextResponse.json({ success: true })
}

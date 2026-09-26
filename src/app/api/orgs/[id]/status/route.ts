import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { toggleOrgStatus } from '@/lib/db'
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { is_active } = await req.json()
  await toggleOrgStatus(params.id, is_active)
  return NextResponse.json({ success: true })
}

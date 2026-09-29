// src/app/api/orgs/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, toggleOrgStatus } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { is_active } = await req.json()
    await toggleOrgStatus(params.id, is_active)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Toggle status error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
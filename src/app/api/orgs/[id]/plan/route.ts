// src/app/api/orgs/[id]/plan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, updateOrgPlan } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { plan } = await req.json()
    await updateOrgPlan(params.id, plan)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Update plan error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
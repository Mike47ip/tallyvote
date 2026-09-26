import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { updateOrgPlan } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { plan } = await req.json()
    await updateOrgPlan(params.id, plan)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Update plan error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
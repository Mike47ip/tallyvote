import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { toggleOrgStatus } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { is_active } = await req.json()
    await toggleOrgStatus(params.id, is_active)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Toggle status error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
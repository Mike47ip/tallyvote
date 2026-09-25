import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createOrg } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const body = await req.json()
    const result = await createOrg(body)
    return NextResponse.json(result)
  } catch (e: any) {
    if (e.code==='P2002') return NextResponse.json({ error: 'Email or slug already exists' }, { status: 409 })
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}

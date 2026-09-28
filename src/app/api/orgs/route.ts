// src/app/api/orgs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, createOrg } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const result = await createOrg(body)
    return NextResponse.json(result)
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Email or slug already exists' }, { status: 409 })
    console.error('Create org error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
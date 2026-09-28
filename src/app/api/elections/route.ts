// src/app/api/elections/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, getOrgByOwner, createElection } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const org = await getOrgByOwner(session.id)
    if (!org) return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    if (!org.isActive) return NextResponse.json({ error: 'Organization is suspended' }, { status: 403 })
    const body = await req.json()
    const { title, short_code, ends_at, candidates } = body
    if (!title || !short_code || !ends_at) return NextResponse.json({ error: 'Title, short code and end date required' }, { status: 400 })
    if (!candidates || candidates.filter((c: string) => c.trim()).length < 2) return NextResponse.json({ error: 'At least 2 candidates required' }, { status: 400 })
    const election = await createElection({ ...body, org_id: org.id, starts_at: body.starts_at || new Date().toISOString() })
    return NextResponse.json(election)
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Short code already in use' }, { status: 409 })
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
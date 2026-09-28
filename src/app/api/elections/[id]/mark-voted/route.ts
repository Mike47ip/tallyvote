// src/app/api/elections/[id]/mark-voted/route.ts  (tallyvote app)
import { NextRequest, NextResponse } from 'next/server'
import { markVoterAsVoted } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { vote_code } = await req.json()
    if (!vote_code) return NextResponse.json({ error: 'Code required' }, { status: 400 })
    await markVoterAsVoted(params.id, vote_code)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
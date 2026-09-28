// src/app/api/elections/[id]/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyVoteCode } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { vote_code } = await req.json()
    if (!vote_code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const result = await verifyVoteCode(params.id, vote_code)
    if (!result.valid) {
      if (result.reason === 'ALREADY_VOTED')
        return NextResponse.json({ error: 'ALREADY_VOTED' }, { status: 409 })
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    return NextResponse.json({ valid: true, voter_name: (result.voter as any).name })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
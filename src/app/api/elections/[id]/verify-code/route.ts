export const dynamic = 'force-dynamic'

// src/app/api/elections/[id]/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyVoteCode } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { vote_code } = await req.json()
    if (!vote_code) return NextResponse.json({ error: 'Code required' }, { status: 400, headers: corsHeaders })

    const result = await verifyVoteCode(params.id, vote_code)
    if (!result.valid) {
      if (result.reason === 'ALREADY_VOTED')
        return NextResponse.json({ error: 'ALREADY_VOTED' }, { status: 409, headers: corsHeaders })
      return NextResponse.json({ error: 'Invalid code' }, { status: 401, headers: corsHeaders })
    }

    return NextResponse.json({ valid: true, voter_name: (result.voter as any).name }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders })
  }
}
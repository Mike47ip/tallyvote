// src/app/api/elections/[id]/mark-voted/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { markVoterAsVoted } from '@/lib/db'

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
    await markVoterAsVoted(params.id, vote_code)
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders })
  }
}
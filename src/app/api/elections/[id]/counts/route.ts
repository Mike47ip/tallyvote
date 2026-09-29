// tallyvote: src/app/api/elections/[id]/counts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVoteCounts } from '@/lib/db'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const counts = await getVoteCounts(params.id)
  return NextResponse.json(counts, { headers: corsHeaders })
}
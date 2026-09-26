import { NextRequest, NextResponse } from 'next/server'
import { getVoteCounts } from '@/lib/db'
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const counts = await getVoteCounts(params.id)
  return NextResponse.json(counts)
}

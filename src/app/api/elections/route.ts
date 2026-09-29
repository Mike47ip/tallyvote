export const dynamic = 'force-dynamic'

// src/app/api/elections/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, getOrgByOwner, createElection, createEligibleVoters, getEligibleVoters, markSMSSent } from '@/lib/db'
import { sendSMS, buildVoteSMS } from '@/lib/termii'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const org = await getOrgByOwner(session.id)
    if (!org) return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    if (!org.isActive) return NextResponse.json({ error: 'Organization is suspended' }, { status: 403 })

    const body = await req.json()
    const { title, short_code, ends_at, candidates, restricted, voters } = body

    if (!title || !short_code || !ends_at)
      return NextResponse.json({ error: 'Title, short code and end date required' }, { status: 400 })
    if (!candidates || candidates.filter((c: string) => c.trim()).length < 2)
      return NextResponse.json({ error: 'At least 2 candidates required' }, { status: 400 })
    if (restricted && (!voters || voters.length === 0))
      return NextResponse.json({ error: 'Restricted elections require at least one eligible voter' }, { status: 400 })

    const election = await createElection({
      ...body,
      org_id:     org.id,
      restricted: !!restricted,
      starts_at:  body.starts_at || new Date().toISOString(),
    })

    // For restricted elections: save voters and send SMS
    if (restricted && voters?.length > 0) {
      await createEligibleVoters(election.id, voters)

      const eligibleVoters = await getEligibleVoters(election.id)
      const voterAppUrl = process.env.NEXT_PUBLIC_VOTER_APP_URL ?? 'http://localhost:3001'
      const voteUrl = `${voterAppUrl}/vote/${election.id}`

      // Send SMS to each voter (fire and forget — don't block response)
      Promise.allSettled(
        eligibleVoters.map(async voter => {
          const message = buildVoteSMS(voter.name, election.title, voter.voteCode, voteUrl)
          const sent = await sendSMS(voter.phone, message)
          if (sent) await markSMSSent(voter.id)
        })
      )
    }

    return NextResponse.json(election)
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'Short code already in use' }, { status: 409 })
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
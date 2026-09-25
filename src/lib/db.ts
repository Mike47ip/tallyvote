import { prisma } from './prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import type { PlatformStats, VoteCount } from '@/types'

export async function getSession() { return getServerSession(authOptions) }

// ── SUPERADMIN ──
export async function getPlatformStats(): Promise<PlatformStats> {
  const [orgs, elections, totalVotes] = await Promise.all([
    prisma.organization.findMany({ select: { plan: true, isActive: true } }),
    prisma.election.findMany({ select: { status: true } }),
    prisma.vote.count(),
  ])
  return {
    total_orgs:      orgs.length,
    active_orgs:     orgs.filter(o => o.isActive).length,
    total_elections: elections.length,
    live_elections:  elections.filter(e => e.status === 'live').length,
    total_votes:     totalVotes,
    free_orgs:       orgs.filter(o => o.plan === 'free').length,
    starter_orgs:    orgs.filter(o => o.plan === 'starter').length,
    pro_orgs:        orgs.filter(o => o.plan === 'pro').length,
  }
}

export async function getAllOrgs() {
  return prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { elections: true } } },
  })
}

export async function getAllElections() {
  return prisma.election.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { name: true } },
      _count: { select: { votes: true } },
    },
  })
}

export async function createOrg(payload: {
  name: string; email: string; phone?: string
  plan: string; slug: string; password: string
}) {
  const bcrypt = await import('bcryptjs')
  const passwordHash = await bcrypt.hash(payload.password, 10)

  return prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: { email: payload.email.toLowerCase(), passwordHash },
    })
    const org = await tx.organization.create({
      data: {
        name: payload.name, slug: payload.slug,
        email: payload.email.toLowerCase(), phone: payload.phone,
        plan: payload.plan as any, isActive: true, ownerId: user.id,
      },
    })
    await tx.profile.create({
      data: { id: user.id, role: 'org_admin', orgId: org.id, fullName: payload.name },
    })
    const freeMethods = ['qr','shortcode','link']
    const allMethods  = ['qr','shortcode','link','email','sms','ussd']
    await tx.orgVotingMethod.createMany({
      data: allMethods.map(method => ({
        orgId: org.id, method: method as any,
        enabled: freeMethods.includes(method),
      })),
    })
    return { org, user }
  })
}

export async function updateOrgPlan(orgId: string, plan: string) {
  return prisma.organization.update({ where: { id: orgId }, data: { plan: plan as any } })
}

export async function toggleOrgStatus(orgId: string, isActive: boolean) {
  return prisma.organization.update({ where: { id: orgId }, data: { isActive } })
}

// ── TENANT ──
export async function getOrgByOwner(userId: string) {
  return prisma.organization.findFirst({ where: { ownerId: userId } })
}

export async function getOrgElections(orgId: string) {
  return prisma.election.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    include: {
      candidates: { orderBy: { position: 'asc' } },
      _count: { select: { votes: true } },
    },
  })
}

export async function getVoteCounts(electionId: string): Promise<VoteCount[]> {
  const candidates = await prisma.candidate.findMany({
    where: { electionId },
    orderBy: { position: 'asc' },
    include: { _count: { select: { votes: true } } },
  })
  const total = candidates.reduce((s, c) => s + c._count.votes, 0)
  return candidates.map(c => ({
    candidate_id:   c.id,
    candidate_name: c.name,
    election_id:    electionId,
    count:          c._count.votes,
    percentage:     total > 0 ? Math.round((c._count.votes / total) * 1000) / 10 : 0,
  }))
}

export async function createElection(payload: {
  org_id: string; title: string; description?: string
  starts_at: string; ends_at: string; anonymous: boolean
  short_code: string; candidates: string[]
}) {
  return prisma.$transaction(async tx => {
    const election = await tx.election.create({
      data: {
        orgId: payload.org_id, title: payload.title,
        description: payload.description, status: 'live',
        anonymous: payload.anonymous,
        shortCode: payload.short_code.toUpperCase(),
        startsAt: new Date(payload.starts_at),
        endsAt: new Date(payload.ends_at),
      },
    })
    await tx.candidate.createMany({
      data: payload.candidates.filter(c => c.trim()).map((name, i) => ({
        electionId: election.id, name: name.trim(), position: i + 1,
      })),
    })
    return election
  })
}

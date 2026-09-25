export type PlanTier = 'free' | 'starter' | 'pro'
export type ElectionStatus = 'draft' | 'live' | 'closed'
export type UserRole = 'superadmin' | 'org_admin'

export interface Organization {
  id: string; name: string; slug: string; email: string
  phone?: string; logoUrl?: string; plan: PlanTier
  isActive: boolean; ownerId?: string; createdAt: string
}

export interface Election {
  id: string; orgId: string; title: string; description?: string
  status: ElectionStatus; anonymous: boolean; shortCode?: string
  startsAt: string; endsAt: string; createdAt: string
  candidates?: Candidate[]
  _count?: { votes: number }
}

export interface Candidate {
  id: string; electionId: string; name: string
  bio?: string; avatarUrl?: string; position?: number
}

export interface VoteCount {
  candidate_id: string; candidate_name: string
  election_id: string; count: number; percentage: number
}

export interface PlatformStats {
  total_orgs: number; active_orgs: number
  total_elections: number; live_elections: number
  total_votes: number; free_orgs: number
  starter_orgs: number; pro_orgs: number
}

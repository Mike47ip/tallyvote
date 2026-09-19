import { createClient } from './supabase/server'
import type { Election, VoteCount } from '@/types'

export async function getElections(): Promise<Election[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('elections')
    .select('*, candidates(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getElection(id: string): Promise<Election | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('elections')
    .select('*, candidates(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getVoteCounts(electionId: string): Promise<VoteCount[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('vote_counts')
    .select('*')
    .eq('election_id', electionId)
    .order('count', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getDashboardStats() {
  const supabase = createClient()
  const [votes, elections] = await Promise.all([
    supabase.from('votes').select('id', { count: 'exact', head: true }),
    supabase.from('elections').select('id, status'),
  ])
  return {
    total_votes: votes.count ?? 0,
    active_elections: elections.data?.filter(e => e.status === 'live').length ?? 0,
    total_elections: elections.data?.length ?? 0,
  }
}

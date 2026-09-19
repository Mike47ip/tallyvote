'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { VoteCount } from '@/types'

export function useRealtimeVotes(electionId: string, initial: VoteCount[]) {
  const [counts, setCounts] = useState<VoteCount[]>(initial)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`votes:${electionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `election_id=eq.${electionId}`,
      }, async () => {
        // Re-fetch vote counts when a new vote lands
        const { data } = await supabase
          .from('vote_counts')
          .select('*')
          .eq('election_id', electionId)
          .order('count', { ascending: false })
        if (data) setCounts(data)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [electionId])

  return counts
}

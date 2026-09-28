// src/lib/termii.ts
const TERMII_API_KEY = process.env.TERMII_API_KEY!
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID ?? 'TallyVote'
const TERMII_BASE_URL = 'https://api.ng.termii.com/api'

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    // Normalize phone: ensure it starts with country code
    const phone = to.startsWith('+') ? to.slice(1) : to.startsWith('0') ? `233${to.slice(1)}` : to

    const res = await fetch(`${TERMII_BASE_URL}/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone,
        from: TERMII_SENDER_ID,
        sms: message,
        type: 'plain',
        api_key: TERMII_API_KEY,
        channel: 'generic',
      }),
    })
    const data = await res.json()
    return data.code === 'ok' || res.ok
  } catch {
    return false
  }
}

export function buildVoteSMS(voterName: string, electionTitle: string, voteCode: string, voteUrl: string): string {
  return `Hi ${voterName}, you are invited to vote in "${electionTitle}". Your unique code is: ${voteCode}. Vote here: ${voteUrl}. This code is for your use only.`
}
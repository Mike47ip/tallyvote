import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  id: string
  email: string
  role: 'superadmin' | 'org_admin'
  org_id: string | null
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!, // 32+ char random string
  cookieName: 'tallyvote-session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
}

export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}
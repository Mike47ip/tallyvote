import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createOrg } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log('TOKEN:', JSON.stringify(token))

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (token.role !== 'superadmin') {
      console.log('Role check failed, got:', token.role)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const result = await createOrg(body)
    return NextResponse.json(result)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Email or slug already exists' }, { status: 409 })
    }
    console.error('Create org error:', e)
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 })
  }
}
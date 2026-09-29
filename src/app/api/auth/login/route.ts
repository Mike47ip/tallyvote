export const dynamic = 'force-dynamic'

// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    })

    if (!user || !await bcrypt.compare(password, user.passwordHash))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    if (user.profile?.role === 'org_admin' && user.profile?.orgId) {
      const org = await prisma.organization.findUnique({
        where: { id: user.profile.orgId },
        select: { isActive: true },
      })
      if (!org?.isActive)
        return NextResponse.json({ error: 'Organization is suspended.' }, { status: 403 })
    }

    const session = await getSession()
    session.id     = user.id
    session.email  = user.email
    session.role   = user.profile?.role ?? 'org_admin'
    session.org_id = user.profile?.orgId ?? null
    await session.save()

    return NextResponse.json({ ok: true, role: session.role })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
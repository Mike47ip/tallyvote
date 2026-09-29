// src/lib/auth.ts

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

type Role = 'superadmin' | 'org_admin'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login', error: '/auth/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where:   { email: credentials.email.toLowerCase() },
          include: { profile: true },
        })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        if (user.profile?.role === 'org_admin' && user.profile?.orgId) {
          const org = await prisma.organization.findUnique({
            where: { id: user.profile.orgId }, select: { isActive: true },
          })
          if (!org?.isActive) throw new Error('Organization is suspended.')
        }

        return {
          id:     user.id,
          email:  user.email,
          name:   user.profile?.fullName ?? user.email,
          role:   (user.profile?.role ?? 'org_admin') as Role,
          org_id: user.profile?.orgId ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only present on sign-in; copy custom fields onto the token
      if (user) {
        token.sub    = user.id // sub is the standard JWT user ID field
        token.role   = user.role
        token.org_id = user.org_id
      }
      return token
    },
    async session({ session, token }) {
      // Copy custom fields from the token onto session.user.
      // Typed via src/types/next-auth.d.ts, so no `as any` is needed.
      if (session.user) {
        session.user.id     = token.sub as string
        session.user.role   = token.role
        session.user.org_id = token.org_id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
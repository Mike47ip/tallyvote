import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

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
          role:   user.profile?.role ?? 'org_admin',
          org_id: user.profile?.orgId ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub    = user.id           // sub is the standard JWT user ID field
        token.role   = (user as any).role
        token.org_id = (user as any).org_id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id     = token.sub    // read from sub
        (session.user as any).role   = token.role
        (session.user as any).org_id = token.org_id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
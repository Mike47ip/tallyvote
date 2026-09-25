import { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: 'superadmin' | 'org_admin'
      org_id: string | null
    }
  }
  interface User {
    role: 'superadmin' | 'org_admin'
    org_id: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'superadmin' | 'org_admin'
    org_id: string | null
  }
}

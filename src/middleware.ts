import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname === '/') {
      if (token?.role === 'superadmin') return NextResponse.redirect(new URL('/superadmin', req.url))
      if (token?.role === 'org_admin')  return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (pathname.startsWith('/superadmin') && token?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (pathname.startsWith('/dashboard') && token?.role === 'superadmin') {
      return NextResponse.redirect(new URL('/superadmin', req.url))
    }
    return NextResponse.next()
  },
  { callbacks: { authorized: ({ token }) => !!token } }
)

export const config = {
  matcher: ['/((?!auth|api|_next/static|_next/image|favicon.ico).*)',],
}

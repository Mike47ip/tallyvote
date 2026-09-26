// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const cookie = req.cookies.get('tallyvote-session')

  if (!cookie?.value) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Let the page-level getSession() handle full verification and role checks.
  // Here we just confirm the cookie exists so unauthenticated users can't access protected routes.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!auth|api|_next/static|_next/image|favicon.ico).*)',],
}
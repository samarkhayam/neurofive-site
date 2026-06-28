import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Always allow these
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|svg|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  const PUBLIC_PATHS = ['/', '/login', '/about', '/tracks', '/contact']
  const isPublic = PUBLIC_PATHS.includes(pathname)

  // Not signed in — protect non-public routes
  if (!session && !isPublic) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Signed in — check onboarding via a custom session flag
  // full_name check happens in the onboarding page & dashboard layout (server-side)
  // Middleware only handles the unauthenticated redirect to keep Edge runtime happy

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
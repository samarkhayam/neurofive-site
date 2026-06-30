import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Only these path prefixes require login — everything else is public by default
const PROTECTED_PREFIXES = ['/dashboard', '/apply']

export default auth(async (req) => {
  const { pathname } = req.nextUrl

  // Always allow static files and auth endpoints
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|webp|woff|woff2)$/)
  ) {
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  let session = null
  try {
    session = req.auth
  } catch {
    if (!isProtected) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!session && isProtected) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
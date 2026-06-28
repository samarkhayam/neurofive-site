import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/login', '/about', '/tracks', '/contact']

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

  const isPublic = PUBLIC_PATHS.includes(pathname)

  // If auth wrapper failed (no AUTH_SECRET etc), don't block public pages
  let session = null
  try {
    session = req.auth
  } catch {
    if (isPublic) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Not signed in — only block protected routes
  if (!session && !isPublic) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
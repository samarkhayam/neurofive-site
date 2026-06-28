'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

const LINKS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About' },
  { href: '/tracks', label: 'Tracks' },
  // { href: '/contact', label: 'Contact' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [fullName, setFullName] = useState(null)
  const pathname = usePathname()
  const { data: session } = useSession()
  const menuRef = useRef(null)

  useEffect(() => {
    setIsOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // Fetch full_name from users table
  useEffect(() => {
    if (session?.user?.email) {
      supabase
        .from('users')
        .select('full_name')
        .eq('email', session.user.email)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setFullName(data.full_name)
        })
    }
  }, [session?.user?.email])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const linkClass = (href, exact) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href)
    return `relative text-sm lg:text-md font-medium transition-colors ${
      isActive ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-text'
    }`
  }

  const mobileLinkClass = (href, exact) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href)
    return `block rounded-lg px-4 py-2.5 ${
      isActive
        ? 'bg-brand-card text-brand-accent'
        : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
    }`
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border">
      <div className="pointer-events-none absolute inset-0 bg-brand-surface/80 backdrop-blur-md" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="shrink-0 text-brand-accent">
            <Image
              src="/NFS.png"
              alt="NeuroFiveSolutions"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href, l.exact)}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              /* User avatar + dropdown */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-card px-3 py-1.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/20 text-xs font-bold text-brand-accent">
                      {(fullName || session.user.name || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-[120px] truncate">
                    {fullName || session.user.name}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down text-xs text-brand-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-xl">
                    <div className="mb-1.5 px-3 py-2 border-b border-brand-border">
                      <p className="text-xs font-semibold text-brand-text truncate">
                        {fullName || session.user.name}
                      </p>
                      <p className="text-xs text-brand-muted truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-muted hover:bg-brand-card hover:text-brand-text transition-colors"
                    >
                      <i className="fa-solid fa-gauge w-4 text-center" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href="/apply"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-muted hover:bg-brand-card hover:text-brand-text transition-colors"
                    >
                      <i className="fa-solid fa-file-pen w-4 text-center" aria-hidden="true" />
                      My Application
                    </Link>
                    <div className="mt-1.5 border-t border-brand-border pt-1.5">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not signed in */
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-text"
                >
                  Sign in
                </Link>
                <Link
                  href="/apply"
                  className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-brand-bg shadow-sm transition-all hover:opacity-90"
                >
                  Apply Fast
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-7 w-7 rounded-full object-cover border border-brand-border"
              />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="p-2 text-2xl text-brand-muted hover:text-brand-text"
            >
              <i
                className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed left-0 top-16 z-50 w-full space-y-1 border-b border-brand-border bg-brand-surface p-4 shadow-lg md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={mobileLinkClass(l.href, l.exact)}>
              {l.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-brand-border pt-3 space-y-1">
            {session ? (
              <>
                {/* Signed in user info */}
                <div className="flex items-center gap-3 rounded-lg bg-brand-card px-4 py-3 mb-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/20 text-sm font-bold text-brand-accent">
                      {(fullName || session.user.name || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-text">
                      {fullName || session.user.name}
                    </p>
                    <p className="truncate text-xs text-brand-muted">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-brand-muted hover:bg-brand-card hover:text-brand-text"
                >
                  Sign in
                </Link>
                <Link
                  href="/apply"
                  className="block w-full rounded-lg bg-brand-accent py-2.5 text-center font-bold text-brand-bg"
                >
                  Apply Fast
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
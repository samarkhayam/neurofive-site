'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

const LINKS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About' },
  { href: '/tracks', label: 'Tracks' },
  { href: '/contact', label: 'Contact' },
]

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [fullName, setFullName] = useState(null)
  const [internees, setInternees] = useState([])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const menuRef = useRef(null)

  useEffect(() => {
    setIsOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch full_name and all internee cohorts
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

      supabase
        .from('internees')
        .select('id, field, status, cohort_id, cohorts(name, is_active)')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setInternees(data)
        })
    }
  }, [session?.user?.email])

  const displayName = fullName || session?.user?.name

  const linkClass = (href, exact) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href)
    return `relative text-sm font-medium transition-colors ${
      isActive ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-text'
    }`
  }

  const mobileLinkClass = (href, exact) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href)
    return `block rounded-lg px-4 py-2.5 text-sm ${
      isActive
        ? 'bg-brand-card text-brand-accent'
        : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
    }`
  }

  const isDashboard = pathname.startsWith('/dashboard')
  const currentCohortId = searchParams.get('cohort') || internees[0]?.id

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border">
      <div className="pointer-events-none absolute inset-0 bg-brand-surface/80 backdrop-blur-md" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="shrink-0">
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

            {/* Dashboard link — shows cohort submenu if multiple */}
            {session && internees.length > 0 && (
              internees.length === 1 ? (
                <Link
                  href={`/dashboard?cohort=${internees[0].id}`}
                  className={linkClass('/dashboard', false)}
                >
                  Dashboard
                </Link>
              ) : (
                <div className="group relative">
                  <button className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isDashboard ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-text'
                  }`}>
                    Dashboard
                    <i className="fa-solid fa-chevron-down text-xs transition-transform group-hover:rotate-180" aria-hidden="true" />
                  </button>
                  <div className="invisible absolute left-0 top-full mt-2 w-52 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-xl opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    {internees.map((i) => (
                      <Link
                        key={i.id}
                        href={`/dashboard?cohort=${i.id}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-card"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-brand-text">{i.cohorts?.name || 'Cohort'}</p>
                          <p className="truncate text-xs text-brand-muted">{i.field}</p>
                        </div>
                        {i.cohorts?.is_active ? (
                          <span className="flex-shrink-0 rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-xs font-semibold text-brand-accent">Active</span>
                        ) : (
                          <i className="fa-solid fa-certificate flex-shrink-0 text-xs text-brand-muted" aria-hidden="true" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Desktop right — user menu or sign in */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-card px-3 py-1.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={displayName} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/20 text-xs font-bold text-brand-accent">
                      {(displayName || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <i className={`fa-solid fa-chevron-down text-xs text-brand-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-xl">
                    {/* User info */}
                    <div className="mb-1.5 px-3 py-2 border-b border-brand-border">
                      <p className="text-xs font-semibold text-brand-text truncate">{displayName}</p>
                      <p className="text-xs text-brand-muted truncate">{session.user.email}</p>
                    </div>

                    {/* Cohort links */}
                    {internees.length > 0 && (
                      <>
                        <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                          My Cohorts
                        </p>
                        {internees.map((i) => (
                          <Link
                            key={i.id}
                            href={`/dashboard?cohort=${i.id}`}
                            onClick={() => setUserMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-brand-card ${
                              currentCohortId === i.id && isDashboard ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-text'
                            }`}
                          >
                            <i className="fa-solid fa-gauge w-4 text-center" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{i.cohorts?.name || 'Cohort'}</p>
                              <p className="truncate text-xs opacity-70">{i.field}</p>
                            </div>
                            {i.cohorts?.is_active && (
                              <span className="flex-shrink-0 rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-xs font-bold text-brand-accent">Active</span>
                            )}
                          </Link>
                        ))}
                        <div className="my-1.5 border-t border-brand-border" />
                      </>
                    )}

                    <Link
                      href="/apply"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-muted hover:bg-brand-card hover:text-brand-text transition-colors"
                    >
                      <i className="fa-solid fa-file-pen w-4 text-center" aria-hidden="true" />
                      Apply to Cohort
                    </Link>

                    <div className="mt-1 border-t border-brand-border pt-1">
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
              <>
                <Link href="/login" className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-text">
                  Sign in
                </Link>
                <Link href="/apply" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-brand-bg shadow-sm transition-all hover:opacity-90">
                  Apply Fast
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {session?.user?.image && (
              <img src={session.user.image} alt={displayName} className="h-7 w-7 rounded-full object-cover border border-brand-border" />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="p-2 text-2xl text-brand-muted hover:text-brand-text"
            >
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed left-0 top-16 z-50 w-full border-b border-brand-border bg-brand-surface p-4 shadow-lg md:hidden">
          <div className="space-y-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={mobileLinkClass(l.href, l.exact)}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Cohorts section on mobile */}
          {session && internees.length > 0 && (
            <div className="mt-3 border-t border-brand-border pt-3">
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                My Cohorts
              </p>
              {internees.map((i) => (
                <Link
                  key={i.id}
                  href={`/dashboard?cohort=${i.id}`}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-brand-muted hover:bg-brand-card hover:text-brand-text transition-colors"
                >
                  <i className="fa-solid fa-gauge text-brand-accent" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-text">{i.cohorts?.name || 'Cohort'}</p>
                    <p className="truncate text-xs">{i.field}</p>
                  </div>
                  {i.cohorts?.is_active && (
                    <span className="flex-shrink-0 rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-xs font-bold text-brand-accent">Active</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-3 border-t border-brand-border pt-3 space-y-1">
            {session ? (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-brand-card px-4 py-3 mb-2">
                  {session.user.image ? (
                    <img src={session.user.image} alt={displayName} className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/20 text-sm font-bold text-brand-accent">
                      {(displayName || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-text">{displayName}</p>
                    <p className="truncate text-xs text-brand-muted">{session.user.email}</p>
                  </div>
                </div>
                <Link href="/apply" className="block rounded-lg px-4 py-2.5 text-sm text-brand-muted hover:bg-brand-card hover:text-brand-text transition-colors">
                  Apply to Cohort
                </Link>
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
                <Link href="/login" className="block rounded-lg px-4 py-2.5 text-sm font-medium text-brand-muted hover:bg-brand-card hover:text-brand-text">
                  Sign in
                </Link>
                <Link href="/apply" className="block w-full rounded-lg bg-brand-accent py-2.5 text-center font-bold text-brand-bg">
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

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="sticky top-0 z-50 h-16 border-b border-brand-border bg-brand-surface/80" />}>
      <NavbarContent />
    </Suspense>
  )
}
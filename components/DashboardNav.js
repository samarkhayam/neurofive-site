'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState, Suspense } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: 'fa-solid fa-gauge', exact: true },
  { href: '/dashboard/tasks', label: 'Tasks', icon: 'fa-solid fa-list-check' },
  { href: '/dashboard/certificate', label: 'Certificate', icon: 'fa-solid fa-certificate' },
]

function NavContent({ internees, user }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cohortMenuOpen, setCohortMenuOpen] = useState(false)

  // Active internee = from URL param, fallback to first
  const activeId = searchParams.get('cohort') || internees[0]?.id
  const active = internees.find((i) => i.id === activeId) || internees[0]

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href)

  const buildHref = (href) => {
    const params = new URLSearchParams(searchParams)
    if (active?.id) params.set('cohort', active.id)
    return `${href}?${params.toString()}`
  }

  const switchCohort = (interneeId) => {
    const params = new URLSearchParams(searchParams)
    params.set('cohort', interneeId)
    router.push(`${pathname}?${params.toString()}`)
    setCohortMenuOpen(false)
  }

  const sidebarLinkClass = (href, exact) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive(href, exact)
        ? 'bg-brand-accent/10 text-brand-accent'
        : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
    }`

  const CohortSwitcher = () => {
    if (internees.length <= 1) return null
    return (
      <div className="relative mb-4">
        <button
          onClick={() => setCohortMenuOpen(!cohortMenuOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm transition-colors hover:border-brand-accent"
        >
          <div className="min-w-0 text-left">
            <p className="text-xs text-brand-muted">Cohort</p>
            <p className="truncate font-medium text-brand-text">
              {active?.cohort?.name || 'Unknown'}
            </p>
          </div>
          <i className={`fa-solid fa-chevron-down text-xs text-brand-muted transition-transform ${cohortMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {cohortMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-xl">
            {internees.map((i) => (
              <button
                key={i.id}
                onClick={() => switchCohort(i.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i.id === active?.id
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.cohort?.name || 'Unknown Cohort'}</p>
                  <p className="text-xs opacity-70">{i.field}</p>
                </div>
                {i.cohort?.is_active && (
                  <span className="flex-shrink-0 rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-xs font-semibold text-brand-accent">
                    Active
                  </span>
                )}
                {!i.cohort?.is_active && i.cert_paid && (
                  <i className="fa-solid fa-certificate flex-shrink-0 text-xs text-brand-gold" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col p-4">
      {/* User card */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-card p-3">
        {user.image ? (
          <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent font-bold text-sm">
            {(user.name || 'U')[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-text">{user.name}</p>
          <p className="truncate text-xs text-brand-muted">{active?.field}</p>
        </div>
      </div>

      {/* Cohort switcher (only if multiple cohorts) */}
      <CohortSwitcher />

      {/* Internee ID */}
      {active?.internee_id && (
        <div className="mb-4 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-center">
          <p className="text-xs text-brand-muted">Internee ID</p>
          <p className="font-display text-sm font-bold text-brand-accent">{active.internee_id}</p>
        </div>
      )}

      {/* Nav — completed cohorts only show certificate */}
      <nav className="flex-1 space-y-1">
        {NAV.filter((item) => {
          // For ended cohorts, only show certificate
          if (!active?.cohort?.is_active && item.href !== '/dashboard/certificate') return false
          return true
        }).map((item) => (
          <Link key={item.href} href={buildHref(item.href)} className={sidebarLinkClass(item.href, item.exact)}>
            <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Status */}
      <div className="mt-4 rounded-lg border border-brand-border bg-brand-card px-3 py-2">
        <p className="mb-1 text-xs text-brand-muted">Status</p>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold capitalize ${
          active?.cohort?.is_active ? 'text-brand-accent' : 'text-brand-muted'
        }`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${
            active?.cohort?.is_active ? 'bg-brand-accent' : 'bg-brand-muted'
          }`} />
          {active?.cohort?.is_active ? active?.status : 'Completed'}
        </span>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" aria-hidden="true" />
        Sign out
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-brand-border">
        <SidebarContent />
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-brand-border bg-brand-surface">
        {NAV.filter((item) => {
          if (!active?.cohort?.is_active && item.href !== '/dashboard/certificate') return false
          return true
        }).map((item) => {
          const act = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={buildHref(item.href)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                act ? 'text-brand-accent' : 'text-brand-muted'
              }`}
            >
              <i className={`${item.icon} text-lg`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-brand-muted"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-lg" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </nav>
    </>
  )
}

export default function DashboardNav({ internees, user }) {
  return (
    <Suspense fallback={null}>
      <NavContent internees={internees} user={user} />
    </Suspense>
  )
}
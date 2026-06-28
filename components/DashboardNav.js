'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: 'fa-solid fa-gauge', exact: true },
  { href: '/dashboard/tasks', label: 'Tasks', icon: 'fa-solid fa-list-check' },
  { href: '/dashboard/certificate', label: 'Certificate', icon: 'fa-solid fa-certificate' },
]

export default function DashboardNav({ internee, user }) {
  const pathname = usePathname()

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname.startsWith(href)

  const sidebarLinkClass = (href, exact) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive(href, exact)
        ? 'bg-brand-accent/10 text-brand-accent'
        : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
    }`

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col border-r border-brand-border">
        <div className="flex h-full flex-col p-4">
          {/* User card */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-card p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.full_name || user.name}
                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent font-bold text-sm">
                {(user.full_name || user.name || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-text">
                {user.full_name || user.name}
              </p>
              <p className="truncate text-xs text-brand-muted">{internee.field}</p>
            </div>
          </div>

          {/* Internee ID */}
          {internee.internee_id && (
            <div className="mb-5 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-center">
              <p className="text-xs text-brand-muted">Internee ID</p>
              <p className="font-display text-sm font-bold text-brand-accent">
                {internee.internee_id}
              </p>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 space-y-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={sidebarLinkClass(item.href, item.exact)}>
                <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Status */}
          <div className="mt-4 rounded-lg border border-brand-border bg-brand-card px-3 py-2">
            <p className="mb-1 text-xs text-brand-muted">Status</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold capitalize ${
              internee.status === 'active' ? 'text-brand-accent' : 'text-yellow-400'
            }`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                internee.status === 'active' ? 'bg-brand-accent' : 'bg-yellow-400'
              }`} />
              {internee.status}
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
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-brand-border bg-brand-surface safe-bottom">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                active ? 'text-brand-accent' : 'text-brand-muted'
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
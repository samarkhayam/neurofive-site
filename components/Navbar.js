'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const LINKS = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About' },
  { href: '/tracks', label: 'Tracks' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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
      {/* Blur background as a separate layer so it doesn't trap the dropdown in its stacking context */}
      <div className="pointer-events-none absolute inset-0 bg-brand-surface/80 backdrop-blur-md" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href, l.exact)}>
                {l.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-brand-bg shadow-sm transition-all hover:opacity-90"
            >
              Apply Fast
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="p-2 text-2xl text-brand-muted hover:text-brand-text"
            >
              <i
                className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed left-0 top-16 z-50 w-full space-y-2 border-b border-brand-border bg-brand-surface p-4 shadow-lg md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={mobileLinkClass(l.href, l.exact)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="block w-full rounded-lg bg-brand-accent py-2.5 text-center font-bold text-brand-bg"
          >
            Apply Fast
          </Link>
        </div>
      )}
    </nav>
  )
}
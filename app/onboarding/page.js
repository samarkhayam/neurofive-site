'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(true)
  const [error, setError] = useState('')

  // Sync Google user into Supabase on first load
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      // Call sync-user to upsert into users table
      fetch('/api/auth/sync-user', { method: 'POST' })
        .then((r) => r.json())
        .then(({ user }) => {
          // If they already have a full_name, skip onboarding
          if (user?.full_name) {
            router.replace('/dashboard')
          } else {
            setSyncing(false)
          }
        })
        .catch(() => setSyncing(false))
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) return
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase
      .from('users')
      .update({ full_name: fullName.trim() })
      .eq('email', session?.user?.email)

    if (dbError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (status === 'loading' || syncing) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-accent" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Image src="/NFS.png" alt="NeuroFive Solutions" width={100} height={34} priority />
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl">
          {session?.user?.image && (
            <div className="mb-5 flex justify-center">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-14 w-14 rounded-full border-2 border-brand-accent object-cover"
              />
            </div>
          )}

          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-brand-text">One last thing</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
              Enter your full name exactly as you&apos;d like it to appear on your{' '}
              <span className="font-medium text-brand-text">certificate</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-brand-muted">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Muhammad Ali Khan"
                autoFocus
                className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <p className="mt-1.5 text-xs text-brand-muted">
                <i className="fa-solid fa-circle-info mr-1 text-brand-gold" aria-hidden="true" />
                This will be printed on your certificate and cannot be changed later.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
              ) : (
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              )}
              {loading ? 'Saving...' : 'Go to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
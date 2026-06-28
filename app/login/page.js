'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  // Always go through onboarding first — it will skip to dashboard if name already set
  const callbackUrl = searchParams.get('callbackUrl') || '/onboarding'

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Image src="/NFS.png" alt="NeuroFive Solutions" width={100} height={34} priority />
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-brand-text">Welcome back</h1>
            <p className="mt-1.5 text-sm text-brand-muted">
              Sign in to access your internee dashboard
            </p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-brand-border bg-brand-card px-4 py-3 text-sm font-semibold text-brand-text transition-all hover:border-brand-accent hover:bg-brand-card/80"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs leading-relaxed text-brand-muted">
            Only internees and applicants can sign in.
            <br />
            Don&apos;t have access yet?{' '}
            <a href="/apply" className="text-brand-accent hover:underline">
              Apply to the cohort
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
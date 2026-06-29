import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'

export const metadata = { title: 'Dashboard' }

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  // Fetch ALL internee records for this user (one per cohort)
  const { data: internees } = await supabase
    .from('internees')
    .select('id, full_name, field, status, internee_id, cohort_id, cert_paid, start_date, end_date')
    .eq('email', session.user.email)
    .order('created_at', { ascending: false })

  if (!internees || internees.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400 text-2xl">
            <i className="fa-solid fa-lock" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-text">Not an internee yet</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            Your account <span className="text-brand-text">{session.user.email}</span> isn&apos;t
            linked to an active internee record. If you&apos;ve been accepted, make sure you&apos;re
            signed in with the same email.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/apply"
              className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
            >
              Apply to a cohort
            </a>
            <a
              href="/"
              className="rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Fetch cohort names for all internee records
  const cohortIds = [...new Set(internees.map((i) => i.cohort_id).filter(Boolean))]
  let cohorts = []
  if (cohortIds.length > 0) {
    const { data } = await supabase
      .from('cohorts')
      .select('id, name, is_active')
      .in('id', cohortIds)
    cohorts = data || []
  }

  // Attach cohort info to each internee
  const interneesWithCohort = internees.map((i) => ({
    ...i,
    cohort: cohorts.find((c) => c.id === i.cohort_id) || null,
  }))

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardNav
        internees={interneesWithCohort}
        user={session.user}
      />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
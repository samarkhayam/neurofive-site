import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage({ searchParams }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { cohort: cohortParam } = await searchParams

  // Get all internees for this user
  const { data: internees } = await supabase
    .from('internees')
    .select('id, full_name, field, status, start_date, end_date, cohort_id, cert_paid')
    .eq('email', session.user.email)
    .order('created_at', { ascending: false })

  if (!internees || internees.length === 0) redirect('/login')

  // Pick active internee from param or default to first
  const internee = internees.find((i) => i.id === cohortParam) || internees[0]

  // Fetch cohort info
  let cohort = null
  if (internee.cohort_id) {
    const { data } = await supabase
      .from('cohorts')
      .select('id, name, is_active')
      .eq('id', internee.cohort_id)
      .single()
    cohort = data
  }

  const isActiveCohort = cohort?.is_active ?? true

  // Fetch task stats
  const { data: taskRows } = await supabase
    .from('internee_tasks')
    .select('status')
    .eq('internee_id', internee.id)

  const tasks = taskRows || []
  const total = tasks.length
  const approved = tasks.filter((t) => t.status === 'approved').length
  const submitted = tasks.filter((t) => t.status === 'submitted').length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const progress = total > 0 ? Math.round((approved / total) * 100) : 0
  const allApproved = total > 0 && approved === total && internee.cert_paid === true

  const cohortHref = (path) => `${path}?cohort=${internee.id}`

  const stats = [
    { label: 'Total Tasks', value: total, icon: 'fa-solid fa-list-check', color: 'text-brand-muted' },
    { label: 'Approved', value: approved, icon: 'fa-solid fa-circle-check', color: 'text-brand-accent' },
    { label: 'Submitted', value: submitted, icon: 'fa-solid fa-paper-plane', color: 'text-blue-400' },
    { label: 'Pending', value: pending, icon: 'fa-solid fa-hourglass-half', color: 'text-yellow-400' },
  ]

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-brand-muted">Welcome back</p>
        <h1 className="font-display text-3xl font-bold text-brand-text">
          {internee.full_name || session.user.name} 👋
        </h1>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-brand-accent font-medium">{internee.field}</span>
          {cohort && (
            <>
              <span className="text-brand-border">·</span>
              <span className="text-sm text-brand-muted">{cohort.name}</span>
            </>
          )}
          {!isActiveCohort && (
            <span className="rounded-full border border-brand-border bg-brand-card px-2 py-0.5 text-xs text-brand-muted">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Completed cohort — only show cert link */}
      {!isActiveCohort ? (
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 text-center max-w-md">
          <i className="fa-solid fa-certificate text-3xl text-brand-accent mb-3" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold text-brand-text">Cohort Completed</h2>
          <p className="mt-2 text-sm text-brand-muted">
            This cohort has ended. You can still access your certificate below.
          </p>
          <Link
            href={cohortHref('/dashboard/certificate')}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
          >
            <i className="fa-solid fa-certificate" aria-hidden="true" />
            View Certificate
          </Link>
        </div>
      ) : (
        <>
          {/* Cert ready banner */}
          {allApproved && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-brand-accent/30 bg-brand-accent/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-certificate text-xl text-brand-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-brand-text">Your certificate is ready!</p>
                  <p className="text-xs text-brand-muted">All tasks approved</p>
                </div>
              </div>
              <Link
                href={cohortHref('/dashboard/certificate')}
                className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-brand-bg transition-all hover:opacity-90 flex-shrink-0"
              >
                Download
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-brand-border bg-brand-surface p-4">
                <div className={`mb-2 text-lg ${s.color}`}>
                  <i className={s.icon} aria-hidden="true" />
                </div>
                <p className="font-display text-2xl font-bold text-brand-text">{s.value}</p>
                <p className="text-xs text-brand-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-8 rounded-xl border border-brand-border bg-brand-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-text">Overall Progress</p>
              <span className="font-display text-sm font-bold text-brand-accent">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-card">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-brand-muted">{approved} of {total} tasks approved</p>
          </div>

          {/* Quick links */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={cohortHref('/dashboard/tasks')}
              className="group flex items-center justify-between rounded-xl border border-brand-border bg-brand-surface p-5 transition-colors hover:border-brand-accent"
            >
              <div>
                <p className="font-semibold text-brand-text">View Tasks</p>
                <p className="mt-0.5 text-sm text-brand-muted">
                  {submitted > 0 ? `${submitted} awaiting review` : 'See all assigned work'}
                </p>
              </div>
              <i className="fa-solid fa-arrow-right text-brand-muted transition-colors group-hover:text-brand-accent" aria-hidden="true" />
            </Link>

            <Link
              href={cohortHref('/dashboard/certificate')}
              className={`group flex items-center justify-between rounded-xl border p-5 transition-colors ${
                allApproved
                  ? 'border-brand-accent/40 bg-brand-accent/5 hover:border-brand-accent'
                  : 'border-brand-border bg-brand-surface hover:border-brand-accent'
              }`}
            >
              <div>
                <p className="font-semibold text-brand-text">Certificate</p>
                <p className="mt-0.5 text-sm text-brand-muted">
                  {allApproved ? 'Ready to download' : `${total - approved} tasks remaining`}
                </p>
              </div>
              <i
                className={`fa-solid ${allApproved ? 'fa-certificate text-brand-accent' : 'fa-lock text-brand-muted'}`}
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Internship dates */}
          {(internee.start_date || internee.end_date) && (
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-5">
              <p className="mb-3 text-sm font-semibold text-brand-text">Internship Period</p>
              <div className="flex flex-wrap gap-6">
                {internee.start_date && (
                  <div>
                    <p className="text-xs text-brand-muted">Start Date</p>
                    <p className="text-sm font-medium text-brand-text">
                      {new Date(internee.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
                {internee.end_date && (
                  <div>
                    <p className="text-xs text-brand-muted">End Date</p>
                    <p className="text-sm font-medium text-brand-text">
                      {new Date(internee.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
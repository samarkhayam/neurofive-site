import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Certificate' }

export default async function CertificatePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { data: internee } = await supabase
    .from('internees')
    .select('id, full_name, field, cohort_id, cert_id, start_date, end_date, grade, cert_paid')
    .eq('email', session.user.email)
    .single()

  if (!internee) redirect('/dashboard')

  const { data: taskRows } = await supabase
    .from('internee_tasks')
    .select('status')
    .eq('internee_id', internee.id)

  const tasks = taskRows || []
  const total = tasks.length
  const approved = tasks.filter((t) => t.status === 'approved').length
  const allApproved = total > 0 && approved === total && internee.cert_paid === true
  const progress = total > 0 ? Math.round((approved / total) * 100) : 0

  // Certificate also requires internship end date to have passed
  const endDate = internee.end_date ? new Date(internee.end_date) : null
  const internshipEnded = endDate ? new Date() >= endDate : false
  const certUnlocked = allApproved && internshipEnded

  // Fetch cohort name
  let cohortName = null
  if (internee.cohort_id) {
    const { data: cohort } = await supabase
      .from('cohorts')
      .select('name')
      .eq('id', internee.cohort_id)
      .single()
    cohortName = cohort?.name
  }

  if (!certUnlocked) {
    return (
      <div className="px-6 py-8 lg:px-10 pb-24 lg:pb-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-brand-text">Certificate</h1>
          <p className="mt-1 text-sm text-brand-muted">
            Complete all assigned tasks to unlock your certificate.
          </p>
        </div>

        <div className="max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 text-center">
          <div className={`mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            approved === total && total > 0
              ? 'bg-brand-accent/10 text-brand-accent'
              : 'bg-brand-card text-brand-muted'
          }`}>
            <i className={`fa-solid ${approved === total && total > 0 ? 'fa-hourglass-half' : 'fa-lock'}`} aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-bold text-brand-text">
            {approved === total && total > 0 ? 'Awaiting Issuance' : 'Not unlocked yet'}
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            {approved === total && total > 0
              ? "All tasks completed. Your certificate is being processed — your cohort manager will issue it shortly."
              : `${approved} of ${total} tasks approved. Get all tasks approved to unlock your certificate.`}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-brand-muted">
              <span>Progress</span>
              <span className="font-bold text-brand-accent">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-card">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            href="/dashboard/tasks"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
          >
            <i className="fa-solid fa-list-check" aria-hidden="true" />
            View Tasks
          </Link>
        </div>
      </div>
    )
  }

  // All tasks approved — show certificate details
  return (
    <div className="px-6 py-8 lg:px-10 pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">Certificate</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Congratulations — all tasks approved!
        </p>
      </div>

      {/* Celebration banner */}
      <div className="mb-6 rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-xl text-brand-accent">
            <i className="fa-solid fa-trophy" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-brand-text">You&apos;ve completed the internship!</p>
            <p className="text-sm text-brand-muted">
              All {total} tasks approved — your certificate is ready.
            </p>
          </div>
        </div>
      </div>

      {/* Certificate info card */}
      <div className="mb-6 max-w-lg rounded-2xl border border-brand-border bg-brand-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <i className="fa-solid fa-certificate text-2xl text-brand-accent" aria-hidden="true" />
          <div>
            <p className="font-display text-lg font-bold text-brand-text">Internship Certificate</p>
            <p className="text-xs text-brand-muted">NeuroFive Solutions</p>
          </div>
        </div>

        <dl className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-brand-muted">Name</dt>
            <dd className="text-sm font-semibold text-brand-text text-right">{internee.full_name}</dd>
          </div>
          <div className="h-px bg-brand-border" />
          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-brand-muted">Track</dt>
            <dd className="text-sm font-semibold text-brand-text text-right">{internee.field}</dd>
          </div>
          {cohortName && (
            <>
              <div className="h-px bg-brand-border" />
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-brand-muted">Cohort</dt>
                <dd className="text-sm font-semibold text-brand-text text-right">{cohortName}</dd>
              </div>
            </>
          )}
          {internee.grade && (
            <>
              <div className="h-px bg-brand-border" />
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-brand-muted">Grade</dt>
                <dd className="text-sm font-semibold text-brand-accent text-right">{internee.grade}</dd>
              </div>
            </>
          )}
          {internee.cert_id && (
            <>
              <div className="h-px bg-brand-border" />
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-brand-muted">Certificate ID</dt>
                <dd className="font-mono text-xs text-brand-muted text-right">{internee.cert_id}</dd>
              </div>
            </>
          )}
          {(internee.start_date || internee.end_date) && (
            <>
              <div className="h-px bg-brand-border" />
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-brand-muted">Period</dt>
                <dd className="text-sm font-semibold text-brand-text text-right">
                  {internee.start_date && new Date(internee.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {internee.start_date && internee.end_date && ' – '}
                  {internee.end_date && new Date(internee.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>

      {/* Download / contact note */}
      <div className="max-w-lg rounded-xl border border-brand-border bg-brand-card p-4 text-sm text-brand-muted">
        <i className="fa-solid fa-circle-info mr-2 text-brand-gold" aria-hidden="true" />
        Your certificate will be sent to your registered email. If you haven&apos;t received it within 48 hours, contact your cohort manager.
      </div>
    </div>
  )
}
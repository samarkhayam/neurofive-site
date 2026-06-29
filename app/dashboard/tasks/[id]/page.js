import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import TaskSubmitForm from '@/components/TaskSubmitForm'
import Link from 'next/link'

export async function generateMetadata() {
  return { title: 'Task Detail' }
}

const STATUS_CONFIG = {
  approved: { label: 'Approved', icon: 'fa-circle-check', color: 'text-brand-accent' },
  submitted: { label: 'Under Review', icon: 'fa-clock', color: 'text-blue-400' },
  rejected: { label: 'Rejected — Resubmit', icon: 'fa-circle-xmark', color: 'text-red-400' },
  pending: { label: 'Not Submitted', icon: 'fa-hourglass-half', color: 'text-yellow-400' },
}

function getUnlockedWeeks(startDate) {
  if (!startDate) return 999 // no start date = all unlocked
  const start = new Date(startDate)
  const now = new Date()
  const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return Math.max(1, Math.floor(daysPassed / 7) + 1)
}

export default async function TaskDetailPage({ params }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/login')

  const { data: internee } = await supabase
    .from('internees')
    .select('id, start_date')
    .eq('email', session.user.email)
    .single()

  if (!internee) redirect('/dashboard')

  const { data: row } = await supabase
    .from('internee_tasks')
    .select(`
      id,
      status,
      submission_url,
      feedback,
      submitted_at,
      reviewed_at,
      tasks (
        id,
        title,
        description,
        week_number,
        track
      )
    `)
    .eq('id', id)
    .eq('internee_id', internee.id)
    .single()

  if (!row) notFound()

  const unlockedWeeks = getUnlockedWeeks(internee.start_date)
  const weekLocked = (row.tasks?.week_number || 1) > unlockedWeeks
  const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending
  const canSubmit = !weekLocked && (row.status === 'pending' || row.status === 'rejected')

  return (
    <div className="px-6 py-8 lg:px-10 pb-24 lg:pb-8 max-w-2xl">
      {/* Back */}
      <Link
        href="/dashboard/tasks"
        className="mb-6 inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        All Tasks
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-brand-muted">
          <span>Week {row.tasks?.week_number}</span>
          <span>·</span>
          <span>{row.tasks?.track}</span>
          {weekLocked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-border bg-brand-card px-2 py-0.5 text-xs text-brand-muted">
              <i className="fa-solid fa-lock text-[10px]" aria-hidden="true" />
              Locked
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-text">{row.tasks?.title}</h1>

        {!weekLocked && (
          <div className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${cfg.color}`}>
            <i className={`fa-solid ${cfg.icon}`} aria-hidden="true" />
            {cfg.label}
          </div>
        )}
      </div>

      {/* Week locked */}
      {weekLocked && (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-8 text-center">
          <i className="fa-solid fa-lock text-3xl text-brand-muted mb-3" aria-hidden="true" />
          <p className="font-semibold text-brand-text">Task Locked</p>
          <p className="mt-1 text-sm text-brand-muted">
            This task is part of Week {row.tasks?.week_number} and hasn&apos;t unlocked yet.
            Check back when that week begins.
          </p>
        </div>
      )}

      {!weekLocked && (
        <>
          {/* Description */}
          {row.tasks?.description && (
            <div className="mb-6 rounded-xl border border-brand-border bg-brand-surface p-5">
              <p className="text-sm font-semibold text-brand-muted mb-2">Task Description</p>
              <p className="text-sm leading-relaxed text-brand-text whitespace-pre-wrap">
                {row.tasks.description}
              </p>
            </div>
          )}

          {/* Feedback on rejection */}
          {row.feedback && row.status === 'rejected' && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-400 mb-1">
                <i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true" />
                Reviewer Feedback
              </p>
              <p className="text-sm text-red-300">{row.feedback}</p>
            </div>
          )}

          {/* Current submission */}
          {row.submission_url && (
            <div className="mb-6 rounded-xl border border-brand-border bg-brand-surface p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                {row.status === 'approved' ? 'Approved Submission' : 'Current Submission'}
              </p>
              <a
                href={row.submission_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-accent hover:underline break-all"
              >
                <i className="fa-brands fa-github flex-shrink-0" aria-hidden="true" />
                {row.submission_url}
              </a>
              {row.submitted_at && (
                <p className="mt-1 text-xs text-brand-muted">
                  Submitted {new Date(row.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {/* Approved */}
          {row.status === 'approved' && (
            <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-5 text-center">
              <i className="fa-solid fa-circle-check text-2xl text-brand-accent mb-2" aria-hidden="true" />
              <p className="font-semibold text-brand-text">Task Approved</p>
              {row.reviewed_at && (
                <p className="mt-1 text-xs text-brand-muted">
                  Reviewed on {new Date(row.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {/* Under review */}
          {row.status === 'submitted' && (
            <div className="rounded-xl border border-blue-400/30 bg-blue-400/5 p-5 text-center">
              <i className="fa-solid fa-clock text-2xl text-blue-400 mb-2" aria-hidden="true" />
              <p className="font-semibold text-brand-text">Under Review</p>
              <p className="mt-1 text-xs text-brand-muted">Your submission is being reviewed. Check back soon.</p>
            </div>
          )}

          {/* Submit / Resubmit */}
          {canSubmit && (
            <TaskSubmitForm
              interneeTaskId={row.id}
              currentUrl={row.submission_url || ''}
              isResubmit={row.status === 'rejected'}
            />
          )}
        </>
      )}
    </div>
  )
}
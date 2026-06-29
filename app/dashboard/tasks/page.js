import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'My Tasks' }

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: 'text-brand-accent bg-brand-accent/10 border-brand-accent/30' },
  submitted: { label: 'Submitted', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
}

function getUnlockedWeeks(startDate) {
  if (!startDate) return 1
  const start = new Date(startDate)
  const now = new Date()
  const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  // Week 1 is always unlocked, each subsequent week unlocks after 7 days
  return Math.max(1, Math.floor(daysPassed / 7) + 1)
}

export default async function TasksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { data: internee } = await supabase
    .from('internees')
    .select('id, start_date')
    .eq('email', session.user.email)
    .single()

  if (!internee) redirect('/dashboard')

  const unlockedWeeks = getUnlockedWeeks(internee.start_date)

  const { data: internee_tasks } = await supabase
    .from('internee_tasks')
    .select(`
      id,
      status,
      submission_url,
      submitted_at,
      reviewed_at,
      feedback,
      tasks (
        id,
        title,
        description,
        week_number,
        order_index,
        track
      )
    `)
    .eq('internee_id', internee.id)
    .order('created_at', { ascending: true })

  const rows = internee_tasks || []

  // Group by week
  const byWeek = rows.reduce((acc, row) => {
    const week = row.tasks?.week_number || 1
    if (!acc[week]) acc[week] = []
    acc[week].push(row)
    return acc
  }, {})

  const weeks = Object.keys(byWeek).sort((a, b) => Number(a) - Number(b))
  const totalWeeks = weeks.length

  return (
    <div className="px-6 py-8 lg:px-10 pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">Tasks</h1>
        <p className="mt-1 text-sm text-brand-muted">
          New tasks unlock every week. Submit your work using a GitHub or deployment link.
        </p>
      </div>

      {/* Week unlock progress */}
      <div className="mb-6 rounded-xl border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-brand-text">Weeks Unlocked</p>
          <span className="text-sm font-bold text-brand-accent">
            {Math.min(unlockedWeeks, totalWeeks)} / {totalWeeks}
          </span>
        </div>
        <div className="flex gap-1.5">
          {weeks.map((week) => {
            const locked = Number(week) > unlockedWeeks
            return (
              <div
                key={week}
                className={`h-1.5 flex-1 rounded-full ${
                  locked ? 'bg-brand-border' : 'bg-brand-accent'
                }`}
              />
            )
          })}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-10 text-center">
          <i className="fa-solid fa-inbox text-3xl text-brand-muted mb-3" aria-hidden="true" />
          <p className="font-semibold text-brand-text">No tasks assigned yet</p>
          <p className="mt-1 text-sm text-brand-muted">Check back after your cohort kicks off.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map((week) => {
            const weekNum = Number(week)
            const locked = weekNum > unlockedWeeks
            const unlocksIn = locked ? (weekNum - unlockedWeeks) : 0

            return (
              <div key={week}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-brand-border" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                      Week {week}
                    </span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand-border bg-brand-card px-2 py-0.5 text-xs text-brand-muted">
                        <i className="fa-solid fa-lock text-[10px]" aria-hidden="true" />
                        Unlocks in {unlocksIn} week{unlocksIn > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="h-px flex-1 bg-brand-border" />
                </div>

                <div className="space-y-3">
                  {byWeek[week].map((row) => {
                    const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending

                    if (locked) {
                      return (
                        <div
                          key={row.id}
                          className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-surface/50 p-4 opacity-50"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-brand-muted">
                              {row.tasks?.title || 'Task'}
                            </p>
                            {row.tasks?.description && (
                              <p className="mt-0.5 truncate text-sm text-brand-muted/60">
                                {row.tasks.description}
                              </p>
                            )}
                          </div>
                          <i className="fa-solid fa-lock ml-4 text-sm text-brand-muted" aria-hidden="true" />
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={row.id}
                        href={`/dashboard/tasks/${row.id}`}
                        className="group flex items-center justify-between rounded-xl border border-brand-border bg-brand-surface p-4 transition-colors hover:border-brand-accent"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-brand-text group-hover:text-brand-accent transition-colors">
                            {row.tasks?.title || 'Task'}
                          </p>
                          {row.tasks?.description && (
                            <p className="mt-0.5 truncate text-sm text-brand-muted">
                              {row.tasks.description}
                            </p>
                          )}
                          {row.feedback && row.status === 'rejected' && (
                            <p className="mt-1 text-xs text-red-400">
                              <i className="fa-solid fa-circle-xmark mr-1" aria-hidden="true" />
                              {row.feedback}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex flex-shrink-0 items-center gap-3">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <i className="fa-solid fa-chevron-right text-xs text-brand-muted group-hover:text-brand-accent transition-colors" aria-hidden="true" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
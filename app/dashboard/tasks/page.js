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

export default async function TasksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { data: internee } = await supabase
    .from('internees')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!internee) redirect('/dashboard')

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

  return (
    <div className="px-6 py-8 lg:px-10 pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">Tasks</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Submit your work for each task using a GitHub repo or deployment link.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-10 text-center">
          <i className="fa-solid fa-inbox text-3xl text-brand-muted mb-3" aria-hidden="true" />
          <p className="font-semibold text-brand-text">No tasks assigned yet</p>
          <p className="mt-1 text-sm text-brand-muted">Check back after your cohort kicks off.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map((week) => (
            <div key={week}>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-brand-border" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                  Week {week}
                </span>
                <div className="h-px flex-1 bg-brand-border" />
              </div>

              <div className="space-y-3">
                {byWeek[week].map((row) => {
                  const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending
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
          ))}
        </div>
      )}
    </div>
  )
}
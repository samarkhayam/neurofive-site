'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TaskSubmitForm({ interneeTaskId, currentUrl, isResubmit }) {
  const router = useRouter()
  const [url, setUrl] = useState(currentUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase
      .from('internee_tasks')
      .update({
        submission_url: url.trim(),
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        feedback: null,
      })
      .eq('id', interneeTaskId)

    setLoading(false)

    if (dbError) {
      setError('Failed to submit. Please try again.')
      return
    }

    setSuccess(true)
    setTimeout(() => router.refresh(), 1200)
  }

  if (success) {
    return (
      <div className="mt-6 rounded-xl border border-blue-400/30 bg-blue-400/5 p-5 text-center animate-fade-up">
        <i className="fa-solid fa-paper-plane text-2xl text-blue-400 mb-2" aria-hidden="true" />
        <p className="font-semibold text-brand-text">Submitted!</p>
        <p className="mt-1 text-xs text-brand-muted">Your work is now under review.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-5">
      <p className="mb-4 text-sm font-semibold text-brand-text">
        {isResubmit ? 'Resubmit Your Work' : 'Submit Your Work'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="submission_url" className="mb-2 block text-sm font-medium text-brand-muted">
            GitHub / Deployment URL <span className="text-red-400">*</span>
          </label>
          <input
            id="submission_url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/yourname/repo"
            className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <p className="mt-1.5 text-xs text-brand-muted">
            Paste a public GitHub repo or live deployment URL.
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
          disabled={loading || !url.trim()}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
          ) : (
            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
          )}
          {loading ? 'Submitting...' : isResubmit ? 'Resubmit for Review' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
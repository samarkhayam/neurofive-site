'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DownloadCertificateButton } from '@/components/DownloadCertificateButton'
import Link from 'next/link'
import Image from 'next/image'

export default function CertificatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const cohortParam = searchParams.get('cohort')

  const [loading, setLoading] = useState(true)
  const [internees, setInternees] = useState([])
  const [selectedInternee, setSelectedInternee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router, cohortParam])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      // 1. Get all internees for this user
      const { data: interneesData, error: interneeError } = await supabase
        .from('internees')
        .select(`
          id,
          full_name,
          field,
          grade,
          cert_id,
          cert_paid,
          internee_id,
          start_date,
          end_date,
          status,
          cohort_id,
          cohorts (id, name)
        `)
        .eq('email', session.user.email)
        .order('created_at', { ascending: false })

      if (interneeError) throw interneeError

      setInternees(interneesData || [])

      // 2. Select the right internee
      let selected = null
      if (cohortParam) {
        selected = interneesData?.find(i => i.id === cohortParam) || null
      }
      if (!selected && interneesData?.length > 0) {
        selected = interneesData[0]
      }
      setSelectedInternee(selected)

      // 3. If selected, get tasks
      if (selected) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('internee_tasks')
          .select('status')
          .eq('internee_id', selected.id)

        if (!tasksError) {
          setTasks(tasksData || [])
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load certificate data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-accent" aria-hidden="true" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-8 lg:px-10 max-w-4xl mx-auto">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true" />
          {error}
        </div>
      </div>
    )
  }

  if (internees.length === 0) {
    return (
      <div className="px-6 py-8 lg:px-10 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <i className="fa-solid fa-certificate text-5xl text-brand-muted/30 block mb-4" />
          <h1 className="text-2xl font-bold text-brand-text">No Certificates Found</h1>
          <p className="text-brand-muted mt-2">
            You haven't completed any cohorts yet. Complete an internship to earn your certificate.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedInternee) {
    return (
      <div className="px-6 py-8 lg:px-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-text">Select a Cohort</h1>
        <p className="text-brand-muted mt-1">Choose which certificate you want to view.</p>
        <div className="mt-4 space-y-2">
          {internees.map((i) => (
            <Link
              key={i.id}
              href={`/certificate?cohort=${i.id}`}
              className="block rounded-lg border border-brand-border bg-brand-surface p-4 hover:border-brand-accent transition-colors"
            >
              <p className="font-semibold text-brand-text">{i.cohorts?.name || 'Cohort'}</p>
              <p className="text-sm text-brand-muted">{i.field}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const total = tasks.length
  const approved = tasks.filter(t => t.status === 'approved').length
  const allApproved = total > 0 && approved === total
  const progress = total > 0 ? Math.round((approved / total) * 100) : 0

  return (
    <div className="px-6 py-8 lg:px-10 max-w-4xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-brand-text">Certificate</h1>
        <p className="mt-1 text-sm text-brand-muted">
          {selectedInternee.cohorts?.name || 'Cohort'} — {selectedInternee.field}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-xl border border-brand-border bg-brand-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted">Progress</p>
            <p className="font-semibold text-brand-text">
              {approved}/{total} tasks approved
            </p>
          </div>
          <span className="text-lg font-bold text-brand-accent">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-card">
          <div
            className="h-full rounded-full bg-brand-accent transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Certificate Status */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 md:p-8">
        {allApproved && selectedInternee.cert_paid ? (
          // Unlocked
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
                <i className="fa-solid fa-certificate" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-brand-text">Certificate Unlocked!</p>
                <p className="text-sm text-brand-muted">All tasks completed. Download your certificate below.</p>
              </div>
            </div>

            {/* Certificate preview card */}
            <div className="mb-6 rounded-xl border border-brand-border bg-brand-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/10">
                  <Image src="/NFS.png" alt="NFS" width={40} height={40} />
                </div>
                <div>
                  <p className="font-semibold text-brand-text">{selectedInternee.full_name}</p>
                  <p className="text-sm text-brand-muted">{selectedInternee.field}</p>
                  {selectedInternee.grade && (
                    <p className="text-sm text-brand-accent">Grade: {selectedInternee.grade}</p>
                  )}
                  {selectedInternee.cert_id && (
                    <p className="text-xs text-brand-muted font-mono">ID: {selectedInternee.cert_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Download button */}
            <DownloadCertificateButton interneeId={selectedInternee.id}>
              <i className="fa-solid fa-download mr-2" aria-hidden="true" />
              Download Certificate (PDF)
            </DownloadCertificateButton>

            <p className="mt-3 text-xs text-brand-muted">
              <i className="fa-solid fa-circle-info mr-1 text-brand-gold" aria-hidden="true" />
              PDF will generate and download immediately.
            </p>
          </div>
        ) : allApproved && !selectedInternee.cert_paid ? (
          // Approved but not paid
          <div className="text-center py-6">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-3xl text-yellow-500">
              <i className="fa-solid fa-hourglass-half" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-text">Payment Required</h2>
            <p className="mt-2 text-sm text-brand-muted max-w-md mx-auto">
              All tasks are approved! Please complete the certificate fee payment to unlock your certificate.
            </p>
            <p className="mt-2 text-sm text-brand-muted">
              Contact your cohort manager for payment details.
            </p>
          </div>
        ) : (
          // Locked
          <div className="text-center py-6">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-card text-3xl text-brand-muted">
              <i className="fa-solid fa-lock" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-text">Not Unlocked Yet</h2>
            <p className="mt-2 text-sm text-brand-muted max-w-md mx-auto">
              Complete all {total} tasks to unlock your certificate.
              {` `}
              <span className="text-brand-accent">{approved} of {total} tasks approved.</span>
            </p>
            <Link
              href="/dashboard/tasks"
              className="mt-6 inline-block rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
            >
              <i className="fa-solid fa-list-check mr-2" aria-hidden="true" />
              View Tasks
            </Link>
          </div>
        )}
      </div>

      {/* Switch cohort */}
      {internees.length > 1 && (
        <div className="mt-6">
          <p className="text-sm text-brand-muted mb-2">Switch to another cohort:</p>
          <div className="flex flex-wrap gap-2">
            {internees.map((i) => (
              <Link
                key={i.id}
                href={`/certificate?cohort=${i.id}`}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  i.id === selectedInternee.id
                    ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                    : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-accent'
                }`}
              >
                {i.cohorts?.name || 'Cohort'}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
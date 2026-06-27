'use client'

import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { supabase } from '@/lib/supabase'

export default function VerifyCertificate() {
  const [certId, setCertId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // null | 'valid' | 'invalid'
  const [internee, setInternee] = useState(null)

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setInternee(null)

    const { data, error } = await supabase
      .from('internees')
      .select('full_name, field, cohort_id, status, cert_paid')
      .eq('internee_id', certId.trim())
      .eq('status', 'completed')
      .eq('cert_paid', true)
      .single()

    setLoading(false)

    if (error || !data) {
      setResult('invalid')
      return
    }

    setInternee(data)
    setResult('valid')
  }

  const reset = () => {
    setCertId('')
    setResult(null)
    setInternee(null)
  }

  return (
    <>
      <PageHeader
        eyebrow="Certificate Verification"
        title="Verify a certificate"
        subtitle="Enter the certificate ID printed on the document to confirm its authenticity."
      />

      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 md:p-10">

            {/* Form */}
            {result === null && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label htmlFor="certId" className="mb-2 block text-sm font-medium text-brand-muted">
                    Certificate ID
                  </label>
                  <input
                    id="certId"
                    type="text"
                    required
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="e.g. NFS-2026-00123"
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 font-mono text-brand-text placeholder:text-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  <p className="mt-2 text-xs text-brand-muted">
                    The ID is printed at the bottom of the certificate.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {loading
                    ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Verifying...</>
                    : <><i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> Verify Certificate</>
                  }
                </button>
              </form>
            )}

            {/* Valid */}
            {result === 'valid' && internee && (
              <div className="animate-fade-up flex flex-col items-center text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-3xl text-brand-accent">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                </div>
                <h2 className="font-display text-2xl font-bold text-brand-text">Certificate Valid</h2>
                <p className="mt-1 text-sm text-brand-muted">This certificate is authentic and issued by NeuroFive.</p>

                <div className="mt-8 w-full rounded-xl border border-brand-border bg-brand-card p-6 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <span className="text-xs uppercase tracking-wider text-brand-muted">Certificate ID</span>
                    <span className="font-mono text-sm font-semibold text-brand-accent">{certId.trim()}</span>
                  </div>
                  <Row label="Name" value={internee.full_name} />
                  <Row label="Track" value={internee.field} />
                  <Row label="Status" value={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent">
                      <i className="fa-solid fa-circle-dot text-[8px]" aria-hidden="true"></i> Completed
                    </span>
                  } />
                </div>

                <button onClick={reset} className="mt-8 rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent">
                  Verify another
                </button>
              </div>
            )}

            {/* Invalid */}
            {result === 'invalid' && (
              <div className="animate-fade-up flex flex-col items-center text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
                  <i className="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                </div>
                <h2 className="font-display text-2xl font-bold text-brand-text">Not Found</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">
                  No valid certificate found for ID{' '}
                  <span className="font-mono font-semibold text-brand-text">{certId.trim()}</span>.
                  Double-check the ID or contact us if you believe this is an error.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={reset} className="rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent">
                    Try again
                  </button>
                  <a
                    href="mailto:team@neurofive.dev"
                    className="rounded-lg bg-brand-accent px-5 py-2.5 text-center text-sm font-bold text-brand-bg transition-all hover:opacity-90"
                  >
                    Contact us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-brand-muted">{label}</span>
      <span className="text-sm font-medium text-brand-text">{value}</span>
    </div>
  )
}
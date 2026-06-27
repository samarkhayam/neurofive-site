'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { supabase } from '@/lib/supabase'

export default function Certificate() {
  const [formData, setFormData] = useState({ email: '', interneeId: '', cohortId: '' })
  const [submitted, setSubmitted] = useState(false)
  const [cohorts, setCohorts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    async function fetchEndedCohorts() {
      const { data, error } = await supabase
        .from('cohorts')
        .select('id, name')
        .eq('is_active', false)
        .order('end_date', { ascending: false })

      if (!error) setCohorts(data || [])
    }
    fetchEndedCohorts()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // All three must match — email + internee_id + cohort_id
      // Never reveal which field is wrong to prevent guessing
      const { data: internee, error: interneeError } = await supabase
        .from('internees')
        .select('id, status, cert_paid, full_name, last_cert_requested_at, email')
        .eq('email', formData.email)
        .eq('internee_id', formData.interneeId.toUpperCase().trim())
        .eq('cohort_id', formData.cohortId)
        .single()

      if (interneeError) {
        setMessage({ type: 'error', text: 'Details do not match our records. Please check your email, internee ID, and cohort.' })
        setLoading(false)
        return
      }

      if (internee.status !== 'completed') {
        setMessage({ type: 'error', text: 'Your internship is not marked as completed yet. Contact admin if you think this is an error.' })
        setLoading(false)
        return
      }

      if (!internee.cert_paid) {
        setMessage({ type: 'error', text: 'Certificate fee not paid yet. Please complete the payment of PKR 500 via JazzCash and contact us to confirm.' })
        setLoading(false)
        return
      }

      if (internee.last_cert_requested_at) {
        const hoursDiff = (new Date() - new Date(internee.last_cert_requested_at)) / (1000 * 60 * 60)
        if (hoursDiff < 24) {
          const hoursLeft = Math.ceil(24 - hoursDiff)
          setMessage({ type: 'error', text: `Certificate already generated. Try again in ${hoursLeft} hour(s).` })
          setLoading(false)
          return
        }
      }

      const { error: updateError } = await supabase
        .from('internees')
        .update({ last_cert_requested_at: new Date().toISOString() })
        .eq('id', internee.id)

      if (updateError) {
        setMessage({ type: 'error', text: 'Error processing request. Please try again.' })
        setLoading(false)
        return
      }

      // TODO: generate PDF in browser using jsPDF and trigger download
      console.log('[Certificate] Generating for:', internee.full_name, formData.interneeId)

      setSubmitted(true)

    } catch (err) {
      console.error('Error:', err)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    }

    setLoading(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Your Achievement"
        title="Get your certificate"
        subtitle="Enter your details below. Your internee ID was sent to you in your approval email."
      />

      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
                  <i className="fa-solid fa-certificate" aria-hidden="true"></i>
                </div>
                <h2 className="font-display text-2xl font-bold text-brand-text">
                  Certificate Ready
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">
                  Your certificate has been generated and downloaded. Check your downloads folder.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ email: '', interneeId: '', cohortId: '' })
                    setMessage({ type: '', text: '' })
                  }}
                  className="mt-8 rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
                >
                  Download again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-muted">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email" type="email" required
                    name="email" value={formData.email} onChange={handleChange}
                    placeholder="The email you applied with"
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>

                {/* Internee ID */}
                <div>
                  <label htmlFor="interneeId" className="mb-2 block text-sm font-medium text-brand-muted">
                    Internee ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="interneeId" type="text" required
                    name="interneeId" value={formData.interneeId} onChange={handleChange}
                    placeholder="e.g. NFS-2607-0001"
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono"
                  />
                  <p className="mt-1.5 text-xs text-brand-muted">
                    Sent to you in your approval email.
                  </p>
                </div>

                {/* Cohort */}
                <div>
                  <label htmlFor="cohortId" className="mb-2 block text-sm font-medium text-brand-muted">
                    Cohort <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="cohortId" required
                    name="cohortId" value={formData.cohortId} onChange={handleChange}
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="" disabled>Select your cohort...</option>
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Info note */}
                <div className="rounded-xl border border-brand-border bg-brand-card p-4 text-sm text-brand-muted leading-relaxed hidden">
                  <i className="fa-solid fa-circle-info mr-2 text-brand-gold" aria-hidden="true"></i>
                  Certificate is only available once your internship is marked{' '}
                  <span className="font-semibold text-brand-text">completed</span> and
                  certificate fee of{' '}
                  <span className="font-semibold text-brand-text">PKR 500</span> is paid.
                </div>

                {/* Error message */}
                {message.type === 'error' && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    <i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true"></i>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {loading
                    ? <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                    : <i className="fa-solid fa-download" aria-hidden="true"></i>
                  }
                  {loading ? 'Verifying...' : 'Download Certificate'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
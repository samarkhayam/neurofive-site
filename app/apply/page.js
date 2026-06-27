'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import { TRACKS } from '@/data/tracks'
import { supabase } from '@/lib/supabase'

const PERKS = [
  { icon: 'fa-solid fa-clock', text: 'Under 60 seconds' },
  { icon: 'fa-solid fa-file-circle-xmark', text: 'No resume required' },
  { icon: 'fa-solid fa-user-slash', text: 'No account needed' },
]

export default function Apply() {
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    skills: '',
    field: '',
    linkedinProfile: '',
    coverNote: '',
  })
  const [popup, setPopup] = useState(null)
  const [existingApp, setExistingApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const field = searchParams.get('field') || searchParams.get('role')
    if (field) setFormData((prev) => ({ ...prev, field }))
  }, [searchParams])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const insertApplication = async (cohortId) => {
    const { error } = await supabase.from('applications').insert({
      email: formData.email,
      full_name: formData.fullName,
      phone: formData.phone,
      education: formData.education,
      skills: formData.skills,
      field: formData.field,
      linkedin_profile: formData.linkedinProfile,
      cover_note: formData.coverNote,
      cohort_id: cohortId,
      status: 'pending',
    })
    return error
  }

  const updateApplication = async (appId) => {
    const { error } = await supabase
      .from('applications')
      .update({
        field: formData.field,
        full_name: formData.fullName,
        phone: formData.phone,
        education: formData.education,
        skills: formData.skills,
        linkedin_profile: formData.linkedinProfile,
        cover_note: formData.coverNote,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
    return error
  }

  const handleConfirmSwitch = async () => {
    setLoading(true)
    const err = await updateApplication(existingApp.id)
    setLoading(false)
    if (err) {
      setError('Error updating application. Please try again.')
      setPopup(null)
      return
    }
    setPopup(null)
    setSubmitted(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: cohortData, error: cohortError } = await supabase
      .from('cohorts')
      .select('id')
      .eq('is_active', true)
      .single()

    if (cohortError) {
      setError('No active cohort found. Applications are currently closed.')
      setLoading(false)
      return
    }

    const { data: sameField } = await supabase
      .from('applications')
      .select('id, field')
      .eq('email', formData.email)
      .eq('field', formData.field)
      .eq('cohort_id', cohortData.id)

    if (sameField && sameField.length > 0) {
      setLoading(false)
      setPopup('duplicate')
      return
    }

    const { data: diffField } = await supabase
      .from('applications')
      .select('id, field')
      .eq('email', formData.email)
      .eq('cohort_id', cohortData.id)

    if (diffField && diffField.length > 0) {
      setExistingApp({ id: diffField[0].id, field: diffField[0].field, cohortId: cohortData.id })
      setLoading(false)
      setPopup('switch')
      return
    }

    const err = await insertApplication(cohortData.id)
    setLoading(false)
    if (err) {
      setError('Error submitting application. Please try again.')
      return
    }
    setSubmitted(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Frictionless Entry"
        title="Apply to the cohort"
        subtitle="No resumes, no accounts. Tell us who you are and which track you want — we'll take it from there."
      />

      {/* Duplicate popup */}
      {popup === 'duplicate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
              <i className="fa-solid fa-triangle-exclamation text-xl" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-bold text-brand-text">Already applied</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              You&apos;ve already applied for{' '}
              <span className="font-semibold text-brand-text">{formData.field}</span> in the current
              cohort. Only one application per field is allowed.
            </p>
            <button
              onClick={() => setPopup(null)}
              className="mt-6 w-full rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Switch popup */}
      {popup === 'switch' && existingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
              <i className="fa-solid fa-arrow-right-arrow-left text-xl" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-bold text-brand-text">Switch your track?</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              You previously applied for{' '}
              <span className="font-semibold text-brand-text">{existingApp.field}</span>. Do you
              want to switch to{' '}
              <span className="font-semibold text-brand-text">{formData.field}</span> instead? Your
              previous application will be replaced.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setPopup(null); setExistingApp(null) }}
                className="flex-1 rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
              >
                No, keep {existingApp.field}
              </button>
              <button
                onClick={handleConfirmSwitch}
                disabled={loading}
                className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                ) : (
                  'Yes, switch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-brand-bg py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <h2 className="font-display text-lg font-bold text-brand-text">Why it&apos;s fast</h2>
              <ul className="mt-4 space-y-3">
                {PERKS.map((p) => (
                  <li key={p.text} className="flex items-center gap-3 text-sm text-brand-muted">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                      <i className={p.icon} aria-hidden="true"></i>
                    </span>
                    {p.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-border bg-brand-card p-6 text-sm leading-relaxed text-brand-muted">
              <i className="fa-solid fa-circle-info mr-2 text-brand-gold" aria-hidden="true"></i>
              Not sure which track fits?{' '}
              <Link href="/tracks" className="font-semibold text-brand-accent hover:underline">
                Compare all tracks
              </Link>{' '}
              before you apply.
            </div>
          </aside>

          <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                </div>
                <h2 className="font-display text-2xl font-bold text-brand-text">
                  You&apos;re in the stream!
                </h2>
                <p className="mt-2 max-w-sm text-sm text-brand-muted">
                  Thanks {formData.fullName || 'there'} — your application for{' '}
                  <span className="text-brand-text">{formData.field || 'the cohort'}</span> has been
                  received. We&apos;ll reach out at{' '}
                  <span className="text-brand-text">{formData.email}</span>.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ fullName: '', email: '', phone: '', education: '', skills: '', field: '', linkedinProfile: '', coverNote: '' })
                    }}
                    className="rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
                  >
                    Submit another
                  </button>
                  <Link
                    href="/"
                    className="rounded-lg bg-brand-accent px-5 py-2.5 text-center text-sm font-bold text-brand-bg transition-all hover:opacity-90"
                  >
                    Back home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-brand-muted">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="fullName" type="text" required
                      name="fullName" value={formData.fullName} onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-muted">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email" type="email" required
                      name="email" value={formData.email} onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-brand-muted">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="phone" type="tel" required
                      name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="education" className="mb-2 block text-sm font-medium text-brand-muted">
                      Education <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="education" type="text" required
                      name="education" value={formData.education} onChange={handleChange}
                      placeholder="BSc CS — FAST-NUCES, 2026"
                      className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="skills" className="mb-2 block text-sm font-medium text-brand-muted">
                    Skills
                  </label>
                  <input
                    id="skills" type="text"
                    name="skills" value={formData.skills} onChange={handleChange}
                    placeholder="React, Python, Figma (comma-separated)"
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>

                <div>
                  <label htmlFor="field" className="mb-2 block text-sm font-medium text-brand-muted">
                    Choose Your Track <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="field" required
                    name="field" value={formData.field} onChange={handleChange}
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  >
                    <option value="" disabled>Select a track...</option>
                    {TRACKS.map((t) => (
                      <option key={t.id} value={t.title}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="linkedinProfile" className="mb-2 block text-sm font-medium text-brand-muted">
                    LinkedIn Profile <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="linkedinProfile" type="url" required
                    name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>

                <div>
                  <label htmlFor="coverNote" className="mb-2 block text-sm font-medium text-brand-muted">
                    Why this track?{' '}
                    <span className="text-xs text-brand-muted/50">(optional)</span>
                  </label>
                  <textarea
                    id="coverNote" rows={3}
                    name="coverNote" value={formData.coverNote} onChange={handleChange}
                    placeholder="A short note on why you're interested and what you hope to build..."
                    className="w-full resize-none rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    <i className="fa-solid fa-circle-xmark mr-2" aria-hidden="true" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                  ) : (
                    <i className="fa-solid fa-bolt" aria-hidden="true" />
                  )}
                  {loading ? 'Submitting...' : 'Join the Cohort'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

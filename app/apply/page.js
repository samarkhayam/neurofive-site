'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { TRACKS } from '@/data/tracks'
import { supabase } from '@/lib/supabase'

const PERKS = [
  { icon: 'fa-solid fa-clock', text: 'Under 60 seconds' },
  { icon: 'fa-solid fa-file-circle-xmark', text: 'No resume required' },
  { icon: 'fa-solid fa-shield-halved', text: 'Pre-filled from your account' },
]

export default function Apply() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
      <ApplyForm />
    </Suspense>
  )
}

function ApplyForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [submitted, setSubmitted] = useState(false)
  const [approvedApp, setApprovedApp] = useState(null)
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

  // Redirect to login if not signed in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/apply')
    }
  }, [status, router])

  // Sync user into Supabase then pre-fill from users table
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // First ensure user exists in Supabase
      fetch('/api/auth/sync-user', { method: 'POST' })
        .then((r) => r.json())
        .then(({ user }) => {
          setFormData((prev) => ({
            ...prev,
            email: session.user.email || '',
            fullName: user?.full_name || session.user.name || '',
          }))
        })
        .catch(() => {
          setFormData((prev) => ({
            ...prev,
            email: session.user.email || '',
            fullName: session.user.name || '',
          }))
        })

      // Check if user has an approved application in the CURRENT active cohort only
      supabase
        .from('cohorts')
        .select('id')
        .eq('is_active', true)
        .maybeSingle()
        .then(({ data: activeCohort }) => {
          if (!activeCohort) return
          supabase
            .from('applications')
            .select('id, field, status')
            .eq('email', session.user.email)
            .eq('status', 'approved')
            .eq('cohort_id', activeCohort.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) setApprovedApp(data)
            })
        })
    }
  }, [status, session])

  useEffect(() => {
    const field = searchParams.get('field') || searchParams.get('role')
    if (field) setFormData((prev) => ({ ...prev, field }))
  }, [searchParams])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen bg-brand-bg" />
  }

  const handleChange = (e) => {
    // Only email is locked now — fullName is editable
    if (e.target.name === "email") return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const insertApplication = async (cohortId) => {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', formData.email)
      .single()

    const { error } = await supabase.from('applications').insert({
      user_id: userData?.id || null,
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
    const { data, error } = await supabase
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
      .select()
    
    if (error) return error
    // If no rows returned, RLS blocked the update
    if (!data || data.length === 0) {
      return { message: 'Update blocked — check Supabase RLS policies for the applications table.' }
    }
    return null
  }

  const handleConfirmSwitch = async () => {
    setLoading(true)
    const err = await updateApplication(existingApp.id)
    setLoading(false)
    if (err) {
      console.error('Switch update error:', err)
      setError(`Error updating application: ${err.message}`)
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

  const lockedInputClass =
    'w-full rounded-lg border border-brand-border bg-brand-card/50 px-4 py-2.5 text-brand-muted cursor-not-allowed select-none focus:outline-none'
  const inputClass =
    'w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent'

  return (
    <>
      <PageHeader
        eyebrow="Frictionless Entry"
        title="Apply to the cohort"
        subtitle="No resumes, no accounts. Tell us who you are and which track you want — we'll take it from there."
      />

      {/* Duplicate popup */}
      {popup === "duplicate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
              <i
                className="fa-solid fa-triangle-exclamation text-xl"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-lg font-bold text-brand-text">
              Already applied
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              You&apos;ve already applied for{" "}
              <span className="font-semibold text-brand-text">
                {formData.field}
              </span>{" "}
              in the current cohort. Only one application per field is allowed.
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
      {popup === "switch" && existingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
              <i
                className="fa-solid fa-arrow-right-arrow-left text-xl"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-display text-lg font-bold text-brand-text">
              Switch your track?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              You already have an application for{" "}
              <span className="font-semibold text-brand-text">
                {existingApp.field}
              </span>
              . Switching will update your existing application to{" "}
              <span className="font-semibold text-brand-text">
                {formData.field}
              </span>
              .
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPopup(null)}
                className="flex-1 rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSwitch}
                disabled={loading}
                className="flex-1 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Switch Track"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8 lg:py-20">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Why apply here
            </p>
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li
                  key={p.text}
                  className="flex items-center gap-3 text-sm text-brand-text"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                    <i className={p.icon} aria-hidden="true"></i>
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-border bg-brand-card p-6 text-sm leading-relaxed text-brand-muted">
            <i
              className="fa-solid fa-circle-info mr-2 text-brand-gold"
              aria-hidden="true"
            ></i>
            Not sure which track fits?{" "}
            <Link
              href="/tracks"
              className="font-semibold text-brand-accent hover:underline"
            >
              Compare all tracks
            </Link>{" "}
            before you apply.
          </div>

          {/* Signed-in notice */}
          <div className="rounded-2xl border border-brand-accent/20 bg-brand-accent/5 p-4 text-sm text-brand-muted">
            <i
              className="fa-solid fa-user-check mr-2 text-brand-accent"
              aria-hidden="true"
            />
            Signed in as{" "}
            <span className="font-semibold text-brand-text">
              {session?.user?.email}
            </span>
            . Name and email are locked to your account.
          </div>
        </aside>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 md:p-10">
          {approvedApp ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
                <i className="fa-solid fa-circle-check" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-text">
                You&apos;re already in!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-brand-muted">
                Your application for{" "}
                <span className="font-semibold text-brand-text">
                  {approvedApp.field}
                </span>{" "}
                has been{" "}
                <span className="text-brand-accent font-semibold">
                  approved
                </span>{" "}
                in the current cohort. You can apply again when a new cohort
                opens.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-brand-accent px-5 py-2.5 text-center text-sm font-bold text-brand-bg transition-all hover:opacity-90"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/"
                  className="rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-center text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
                >
                  Back home
                </Link>
              </div>
            </div>
          ) : submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
                <i className="fa-solid fa-check" aria-hidden="true"></i>
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-text">
                You&apos;re in the stream!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-brand-muted">
                Thanks {formData.fullName || "there"} — your application for{" "}
                <span className="text-brand-text">
                  {formData.field || "the cohort"}
                </span>{" "}
                has been received. We&apos;ll reach out at{" "}
                <span className="text-brand-text">{formData.email}</span>.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData((prev) => ({
                      ...prev,
                      phone: "",
                      education: "",
                      skills: "",
                      field: "",
                      linkedinProfile: "",
                      coverNote: "",
                    }));
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
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-brand-muted"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name as you want it on your certificate"
                    maxLength={50} // Prevents paragraphs
                    pattern="[A-Za-z ]+" // Only letters and spaces
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-brand-muted">
                    <i
                      className="fa-solid fa-circle-info mr-1 text-brand-gold"
                      aria-hidden="true"
                    />
                    This will appear on your certificate. Use your legal name.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-brand-muted"
                  >
                    Email Address{" "}
                    <span className="ml-1 rounded bg-brand-card px-1.5 py-0.5 text-xs text-brand-muted">
                      <i
                        className="fa-solid fa-lock mr-1 text-[10px]"
                        aria-hidden="true"
                      />
                      locked
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    tabIndex={-1}
                    className={lockedInputClass}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-brand-muted"
                  >
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="education"
                    className="mb-2 block text-sm font-medium text-brand-muted"
                  >
                    Education <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="education"
                    type="text"
                    required
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="BSc CS — FAST-NUCES, 2026"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-medium text-brand-muted"
                >
                  Skills
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Python, Figma (comma-separated)"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="field"
                  className="mb-2 block text-sm font-medium text-brand-muted"
                >
                  Choose Your Track <span className="text-red-400">*</span>
                </label>
                <select
                  id="field"
                  required
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a track...
                  </option>
                  {TRACKS.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="linkedinProfile"
                  className="mb-2 block text-sm font-medium text-brand-muted"
                >
                  LinkedIn Profile <span className="text-red-400">*</span>
                </label>
                <input
                  id="linkedinProfile"
                  type="url"
                  required
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="coverNote"
                  className="mb-2 block text-sm font-medium text-brand-muted"
                >
                  Why this track?{" "}
                  <span className="text-xs text-brand-muted/50">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="coverNote"
                  rows={3}
                  name="coverNote"
                  value={formData.coverNote}
                  onChange={handleChange}
                  placeholder="A short note on why you're interested and what you hope to build..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  <i
                    className="fa-solid fa-circle-xmark mr-2"
                    aria-hidden="true"
                  />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <i className="fa-solid fa-bolt" aria-hidden="true" />
                )}
                {loading ? "Submitting..." : "Join the Cohort"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
import Link from 'next/link'
import { TRACKS } from '@/data/tracks'

export const metadata = {
  title: 'NeuroFive Solutions — Build the stack, ship to real users',
  description:
    'NeuroFive is an elite builder ecosystem. Claim an active development track, ship features to real users, and grow into a core engineering role.',
  alternates: { canonical: '/' },
}

const STATS = [
  { value: '100%', label: 'Practical work' },
  { value: `${TRACKS.length}`, label: 'Active tracks' },
  { value: '60s', label: 'To apply' },
  { value: '2026', label: 'Summer cohort' },
]

const FEATURES = [
  {
    icon: 'fa-solid fa-code-branch',
    title: 'Ship Real Features',
    body: 'Claim an active development branch and deploy directly to staging environments users actually touch.',
  },
  {
    icon: 'fa-solid fa-cubes',
    title: 'Product Sync',
    body: 'Get early access to internal projects and roadmaps before they launch to the public.',
  },
  {
    icon: 'fa-solid fa-terminal',
    title: 'Modern Dev Tools',
    body: 'Master a production stack: React, Tailwind, TypeScript, Node, and Supabase.',
  },
  {
    icon: 'fa-solid fa-rocket',
    title: 'Future Careers',
    body: 'High-performing interns transition straight into core engineering roles.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-brand-border bg-brand-bg">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true"></div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-gold">
            <i className="fa-solid fa-circle-dot animate-pulse text-[8px] text-brand-accent" aria-hidden="true"></i>
            <span>Cohort Summer 2026 — Live Openings</span>
          </div>

          <h1 className="animate-fade-up mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-text text-balance sm:text-5xl md:text-6xl">
            Stop studying the stack.{' '}
            <span className="bg-gradient-to-r from-brand-accent to-brand-gold bg-clip-text text-transparent">
              Start building it.
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-muted text-pretty sm:text-lg">
            Skip the endless loops of online tutorials. Join an agile environment, claim an active
            development branch, and deploy features to real users.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/tracks"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent px-8 py-3 font-bold text-brand-bg shadow-lg shadow-brand-accent/10 transition-all hover:opacity-90 sm:w-auto"
            >
              Explore Tracks <i className="fa-solid fa-arrow-right text-sm" aria-hidden="true"></i>
            </Link>
            <Link
              href="/about"
              className="flex w-full items-center justify-center rounded-xl border border-brand-border bg-brand-surface px-8 py-3 font-medium text-brand-text transition-all hover:bg-brand-card sm:w-auto"
            >
              Our Vision
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-brand-border bg-brand-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-4 py-12 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-brand-accent sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-brand-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Why NeuroFive
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-text text-balance sm:text-4xl">
              A builder ecosystem, not a classroom
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-brand-border bg-brand-card p-6 transition-colors hover:border-brand-accent/40"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 text-lg text-brand-accent transition-transform group-hover:-translate-y-0.5">
                  <i className={f.icon} aria-hidden="true"></i>
                </div>
                <h3 className="font-semibold text-brand-text">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="border-y border-brand-border bg-brand-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Open positions
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-brand-text sm:text-4xl">
                Featured tracks
              </h2>
            </div>
            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline"
            >
              View all tracks <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TRACKS.slice(2, 4).map((job) => (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-card p-6 transition-colors hover:border-brand-accent/40"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                        <i className={job.icon} aria-hidden="true"></i>
                      </span>
                      <h3 className="font-display text-xl font-bold text-brand-text">{job.title}</h3>
                    </div>
                    <span className="rounded-full border border-brand-gold/20 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-brand-muted">{job.description}</p>
                </div>
                <Link
                  href="/apply"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 font-medium text-brand-text transition-colors hover:border-brand-accent"
                >
                  Apply Now <i className="fa-solid fa-arrow-right text-xs text-brand-accent" aria-hidden="true"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-surface p-10 text-center sm:p-14">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true"></div>
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-brand-text text-balance sm:text-4xl">
                Ready to claim your branch?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-muted text-pretty">
                No resumes, no accounts. Complete the frictionless application in under 60 seconds.
              </p>
              <Link
                href="/apply"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-8 py-3 font-bold text-brand-bg transition-all hover:opacity-90"
              >
                <i className="fa-solid fa-bolt" aria-hidden="true"></i> Join the Cohort
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

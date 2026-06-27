import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { TRACKS } from '@/data/tracks'

export const metadata = {
  title: 'Tracks',
  description:
    'Browse all available internship tracks at NeuroFive. Zero friction — claim your track and start shipping to real users this cohort.',
  alternates: { canonical: '/tracks' },
}

export default function Tracks() {
  return (
    <>
      <PageHeader
        eyebrow="Open Positions"
        title="Available Tracks"
        subtitle="Zero friction. Claim your track and start shipping to real users this cohort."
      />

      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {TRACKS.map((job) => (
              <article
                key={job.id}
                className="flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-card p-7 transition-colors hover:border-brand-accent/40"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 text-lg text-brand-accent">
                        <i className={job.icon} aria-hidden="true"></i>
                      </span>
                      <h2 className="font-display text-xl font-bold text-brand-text">{job.title}</h2>
                    </div>
                    <span className="shrink-0 rounded-full border border-brand-gold/20 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-brand-muted">{job.description}</p>

                  <ul className="mt-5 space-y-2">
                    {job.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-brand-muted">
                        <i className="fa-solid fa-check mt-1 text-xs text-brand-accent" aria-hidden="true"></i>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-4 border-t border-brand-border pt-5 text-sm text-brand-muted">
                    <span>
                      <i className="fa-solid fa-calendar-days mr-2 text-brand-accent" aria-hidden="true"></i>
                      {job.duration}
                    </span>
                    <div className="ml-auto flex gap-3 text-2xl">
                      {job.tech.map((icon, idx) => (
                        <i key={idx} className={icon} aria-hidden="true"></i>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/apply?role=${encodeURIComponent(job.title)}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 font-bold text-brand-bg transition-all hover:opacity-90"
                >
                  Apply Now <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

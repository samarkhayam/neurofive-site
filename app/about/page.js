import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'About',
  description:
    'NeuroFive is an early-stage ecosystem gathering bright, aggressive learners to build alongside us as we roll out our software products.',
  alternates: { canonical: '/about' },
}

const PILLARS = [
  {
    icon: 'fa-solid fa-code-branch',
    color: 'text-brand-accent',
    title: '100% Practical',
    body: 'Ship features directly to staging environments instead of building throwaway demos.',
  },
  {
    icon: 'fa-solid fa-cubes',
    color: 'text-brand-gold',
    title: 'Product Sync',
    body: 'Get early access to internal projects and roadmaps before launch.',
  },
  {
    icon: 'fa-solid fa-terminal',
    color: 'text-brand-accent',
    title: 'Modern Dev Tools',
    body: 'Master React, Tailwind, TypeScript, Node, and Supabase on real codebases.',
  },
  {
    icon: 'fa-solid fa-rocket',
    color: 'text-brand-gold',
    title: 'Future Careers',
    body: 'High-performing interns transition into core engineering roles.',
  },
]

const VALUES = [
  { icon: 'fa-solid fa-bolt', title: 'Bias for shipping', body: 'We value working software over perfect plans. Deploy, learn, iterate.' },
  { icon: 'fa-solid fa-people-group', title: 'Radical ownership', body: 'Every intern owns a branch end-to-end, from idea to production.' },
  { icon: 'fa-solid fa-seedling', title: 'Grow in public', body: 'Code reviews, pairing, and feedback are continuous and transparent.' },
]

const TIMELINE = [
  { phase: 'Phase 01', title: 'Onboard', body: 'Set up your environment, meet your pod, and claim your first branch.' },
  { phase: 'Phase 02', title: 'Build', body: 'Ship features to staging with weekly reviews and mentorship.' },
  { phase: 'Phase 03', title: 'Launch', body: 'Deploy to production and own the metrics behind your work.' },
  { phase: 'Phase 04', title: 'Grow', body: 'Top performers convert to core engineering roles.' },
]

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="Our Strategy"
        title="Building talent today, deploying solutions tomorrow."
        subtitle="NeuroFive is an early-stage ecosystem gathering bright, aggressive learners to build alongside us as we roll out our software products."
      />

      {/* Mission */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                The Mission
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-brand-text text-balance">
                Our interns are our baseline engineering force.
              </h2>
              <p className="mt-4 leading-relaxed text-brand-muted">
                We are an early-stage ecosystem. Right now, our core focus is gathering bright,
                aggressive learners to build alongside us.
              </p>
              <p className="mt-4 leading-relaxed text-brand-muted">
                As we prepare to roll out our software products and services, our interns will be
                the engineering force that takes them from staging to production.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-brand-border bg-brand-card p-6 transition-colors hover:border-brand-accent/30"
                >
                  <div className={`mb-3 text-2xl ${p.color}`}>
                    <i className={p.icon} aria-hidden="true"></i>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-brand-text">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-brand-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-brand-border bg-brand-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              What we value
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-text">
              Principles we build by
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-brand-border bg-brand-card p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/10 text-xl text-brand-accent">
                  <i className={v.icon} aria-hidden="true"></i>
                </div>
                <h3 className="font-display text-lg font-bold text-brand-text">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              The Journey
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-text">
              How a cohort works
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <div key={t.phase} className="relative rounded-2xl border border-brand-border bg-brand-card p-6">
                <span className="font-display text-sm font-bold text-brand-gold">{t.phase}</span>
                <h3 className="mt-2 text-lg font-semibold text-brand-text">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-8 py-3 font-bold text-brand-bg transition-all hover:opacity-90"
            >
              <i className="fa-solid fa-bolt" aria-hidden="true"></i> Start your application
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

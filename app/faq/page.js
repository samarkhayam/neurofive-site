import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import FaqAccordion from './FaqAccordion'

export const metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about joining the NeuroFive cohort. Learn about experience requirements, tech stack, remote work, and more.',
  alternates: { canonical: '/faq' },
}

export const FAQS = [
  {
    q: 'Do I need prior professional experience?',
    a: 'No. We care about how you think and how fast you build. If you can demonstrate curiosity and ship code, you can apply — no resume required.',
  },
  {
    q: 'Is the internship paid?',
    a: 'Tracks are structured as a builder cohort focused on real product work and mentorship. Compensation details are shared with shortlisted candidates per track.',
  },
  {
    q: 'How much time do I need to commit?',
    a: 'Tracks range from 3 to 6 months. We expect consistent weekly contributions, but the schedule is flexible and async-friendly.',
  },
  {
    q: 'What tech stack will I work with?',
    a: 'Primarily React, Tailwind, and TypeScript on the frontend, with Node and Supabase/PostgreSQL on the backend. DevOps tracks work with Docker, GitHub Actions, and cloud tooling.',
  },
  {
    q: 'Can I work remotely?',
    a: "Yes. Most tracks are fully remote, with a few hybrid options. You'll collaborate through pull requests, reviews, and regular syncs.",
  },
  {
    q: 'What happens after the cohort ends?',
    a: 'High-performing interns are invited to transition into core engineering roles as we scale our product offerings.',
  },
]

export default function Faq() {
  return (
    <>
      <PageHeader
        eyebrow="Questions"
        title="Frequently asked questions"
        subtitle="Everything you need to know about joining the NeuroFive cohort."
      />

      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-3xl px-4">
          <FaqAccordion faqs={FAQS} />

          <div className="mt-12 rounded-2xl border border-brand-border bg-brand-surface p-8 text-center">
            <h2 className="font-display text-xl font-bold text-brand-text">Still have a question?</h2>
            <p className="mt-2 text-sm text-brand-muted">Reach out and we&apos;ll get back to you quickly.</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-7 py-3 font-bold text-brand-bg transition-all hover:opacity-90"
            >
              <i className="fa-solid fa-envelope" aria-hidden="true"></i> Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

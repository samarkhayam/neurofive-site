import PageHeader from '@/components/PageHeader'
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with the NeuroFive team. Questions about a track, partnerships, or the cohort? Send us a message.',
  alternates: { canonical: '/contact' },
}

const CHANNELS = [
  { icon: 'fa-solid fa-envelope', label: 'Email', value: 'team@neurofive.dev', href: 'mailto:team@neurofive.dev' },
  { icon: 'fa-brands fa-facebook', label: 'Facebook', value: 'facebook.com/neurofive', href: 'https://facebook.com' },
  { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', value: 'linkedin.com/company/neurofive', href: 'https://linkedin.com' },
]

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        subtitle="Questions about a track, partnerships, or the cohort? Send us a message."
      />

      <section className="bg-brand-bg py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-accent/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 text-lg text-brand-accent">
                  <i className={c.icon} aria-hidden="true"></i>
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-brand-muted">{c.label}</span>
                  <span className="block text-sm font-medium text-brand-text">{c.value}</span>
                </span>
              </a>
            ))}
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 text-sm leading-relaxed text-brand-muted">
              <i className="fa-solid fa-clock mr-2 text-brand-gold" aria-hidden="true"></i>
              We typically respond within 1–2 business days.
            </div>
          </aside>

          <ContactForm />
        </div>
      </section>
    </>
  )
}

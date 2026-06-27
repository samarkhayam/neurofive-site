import Link from 'next/link'

const NAV = [
  { href: '/about', label: 'About', icon: 'fa-regular fa-address-card' },
  { href: '/tracks', label: 'Tracks', icon: 'fa-solid fa-code-branch' },
  { href: '/get-certificate', label: 'Get Certificate', icon: 'fa-solid fa-certificate' },
  { href: '/verify-certificate', label: 'Verify', icon: 'fa-regular fa-circle-check' },
  { href: '/faq', label: 'FAQ', icon: 'fa-regular fa-circle-question' },
  { href: '/contact', label: 'Contact', icon: 'fa-regular fa-envelope' },
]

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-surface text-brand-muted">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-text">
              <i className="fa-solid fa-layer-group text-brand-accent" aria-hidden="true"></i>
              <span>NeuroFive Studio</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              An elite builder ecosystem staging real product tracks. Skip the tutorials and ship to
              production.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-text">
              Navigate
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 transition-colors hover:text-brand-accent">
                    <i className={l.icon} aria-hidden="true"></i>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider brand-text">
              Connect
            </h3>
            <div className="flex gap-4 text-lg">
              <a
                href="https://www.facebook.com/profile.php?id=61591236217927"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-brand-accent"
              >
                <i className="fa-brands fa-facebook" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/neurofivesolutions"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-brand-accent"
              >
                <i className="fa-brands fa-linkedin-in" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.instagram.com/neurofive_solutions1?igsh=Z25ldTVwazJrdnNv"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-brand-accent"
              >
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
            <Link
              href="/apply"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-bold text-brand-bg transition-all hover:opacity-90"
            >
              <i className="fa-solid fa-bolt" aria-hidden="true"></i> Join the Cohort
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-border pt-6 text-center text-xs text-brand-muted/60">
          &copy; {new Date().getFullYear()} NeuroFive. Frictionless open entry.
        </div>
      </div>
    </footer>
  )
}
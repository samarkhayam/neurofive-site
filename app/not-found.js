import Link from 'next/link'

export const metadata = {
  title: '404 — Branch not found',
}

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-brand-bg px-4">
      <div className="text-center">
        <span className="font-display text-6xl font-extrabold text-brand-accent">404</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-brand-text">Branch not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-brand-muted">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-accent px-7 py-3 font-bold text-brand-bg transition-all hover:opacity-90"
        >
          <i className="fa-solid fa-house" aria-hidden="true"></i> Back home
        </Link>
      </div>
    </section>
  )
}

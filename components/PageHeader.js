export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-surface">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"></div>
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
        {eyebrow && (
          <span className="animate-fade-up text-xs font-semibold uppercase tracking-wider text-brand-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="animate-fade-up mt-3 font-display text-4xl font-extrabold tracking-tight text-brand-text text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-up mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-muted text-pretty">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

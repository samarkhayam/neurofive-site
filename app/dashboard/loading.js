export default function DashboardLoading() {
  return (
    <div className="px-6 py-8 lg:px-10 animate-pulse">
      <div className="mb-6">
        <div className="h-4 w-24 rounded bg-brand-card mb-2" />
        <div className="h-8 w-48 rounded bg-brand-card" />
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-brand-border bg-brand-surface p-4">
            <div className="h-5 w-5 rounded bg-brand-card mb-2" />
            <div className="h-7 w-12 rounded bg-brand-card mb-1" />
            <div className="h-3 w-20 rounded bg-brand-card" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-brand-border bg-brand-surface p-5 mb-8">
        <div className="h-2 w-full rounded-full bg-brand-card" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5 h-20" />
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5 h-20" />
      </div>
    </div>
  )
}
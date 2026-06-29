export default function TasksLoading() {
  return (
    <div className="px-6 py-8 lg:px-10 animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-24 rounded bg-brand-card mb-2" />
        <div className="h-4 w-64 rounded bg-brand-card" />
      </div>
      <div className="rounded-xl border border-brand-border bg-brand-surface p-4 mb-6">
        <div className="h-1.5 w-full rounded-full bg-brand-card" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-brand-border bg-brand-surface p-4">
            <div className="h-4 w-48 rounded bg-brand-card mb-2" />
            <div className="h-3 w-72 rounded bg-brand-card" />
          </div>
        ))}
      </div>
    </div>
  )
}
export default function CertificateLoading() {
  return (
    <div className="px-6 py-8 lg:px-10 animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-32 rounded bg-brand-card mb-2" />
        <div className="h-4 w-48 rounded bg-brand-card" />
      </div>
      <div className="max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8">
        <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-brand-card" />
        <div className="mx-auto h-6 w-40 rounded bg-brand-card mb-3" />
        <div className="mx-auto h-4 w-64 rounded bg-brand-card" />
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to Supabase / email service
    console.log('[Contact] message:', form)
    setSubmitted(true)
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 md:p-10">
      {submitted ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-2xl text-brand-accent">
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-text">Message sent</h2>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">
            Thanks {form.name || 'there'} — we&apos;ve received your message and will reply to{' '}
            {form.email} soon.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ name: '', email: '', message: '' })
            }}
            className="mt-8 rounded-lg border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-accent"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-muted">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="cemail" className="mb-2 block text-sm font-medium text-brand-muted">
                Email
              </label>
              <input
                id="cemail"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-brand-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              className="w-full resize-none rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-3 font-bold text-brand-bg transition-all hover:opacity-90"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i> Send message
          </button>
        </form>
      )}
    </div>
  )
}

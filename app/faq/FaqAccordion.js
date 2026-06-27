'use client'

import { useState } from 'react'

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-card transition-colors hover:border-brand-accent/30">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-brand-text">{item.q}</span>
        <i
          className={`fa-solid fa-chevron-down text-sm text-brand-accent transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        ></i>
      </button>
      {isOpen && (
        <p className="animate-fade-up px-5 pb-5 text-sm leading-relaxed text-brand-muted">
          {item.a}
        </p>
      )}
    </div>
  )
}

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-4">
      {faqs.map((item, i) => (
        <FaqItem
          key={item.q}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  )
}

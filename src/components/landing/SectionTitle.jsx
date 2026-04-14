import React from 'react'

export default function SectionTitle({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-[#1A73E8] to-[#0097A7] bg-clip-text text-transparent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0D1B2A]">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-gray-500 ${center ? 'mx-auto max-w-2xl' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

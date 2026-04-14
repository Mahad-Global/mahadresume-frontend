import React from 'react'
import Container from './Container'

export default function Trusted() {
  const companies = ['Emirates NBD', 'ADNOC', 'Etisalat', 'Dubai Holding', 'Emaar', 'Al Futtaim']

  return (
    <section className="border-y border-gray-100 py-8 bg-white">
      <Container>
        <p className="text-center text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">
          Our users have been hired by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map(name => (
            <span key={name} className="text-gray-300 font-bold text-lg tracking-tight select-none">
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}

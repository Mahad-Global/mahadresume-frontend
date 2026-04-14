import React from 'react'
import Container from './Container'
import SectionTitle from './SectionTitle'
import { testimonials } from './data'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 overflow-hidden relative">
      <Container>
        <SectionTitle
          center
          eyebrow="Testimonials"
          title="Loved by Gulf professionals"
          subtitle="Join thousands who landed their dream job with MahadResume."
        />

        <div className="mt-12 relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          <motion.div
            className="flex gap-8"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          >
            {[...testimonials, ...testimonials].map((t, idx) => (
              <motion.figure
                key={idx}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="flex-none w-[280px] sm:w-[340px] rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6"
              >
                <Quote className="w-5 h-5 text-[#1A73E8] mb-3" />

                <blockquote className="text-sm text-gray-800 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex mt-4 text-[#1A73E8]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 mr-0.5 fill-current" />
                  ))}
                </div>

                <figcaption className="mt-3 text-sm font-medium text-[#1A73E8]">
                  {t.name}{' '}
                  <span className="text-gray-500 font-normal">&middot; {t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

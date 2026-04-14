import React from 'react'
import { Link } from 'react-router-dom'
import Container from './Container'
import { motion } from 'framer-motion'

const templateImages = [
  '/templates/Professional.png',
  '/templates/ModernTemplate.png',
  '/templates/Creative.png',
  '/templates/Corporate.png',
  '/templates/Elegant.png',
]

const wrapVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

const positions = [
  { top: '10%', left: '85%', rotate: 0 },
  { top: '10%', left: '65%', rotate: 10 },
  { top: '10%', left: '5%', rotate: -6 },
  { top: '20%', left: '25%', rotate: 6 },
  { top: '30%', left: '45%', rotate: -4 },
]

export default function TemplatesPreview() {
  return (
    <section
      id="templates"
      className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        {positions.map((pos, i) => (
          <motion.img
            key={i}
            src={templateImages[i % templateImages.length]}
            alt={`Resume template ${i + 1}`}
            className="absolute w-32 sm:w-40 md:w-48 opacity-30 rounded-lg shadow-lg"
            style={{
              top: pos.top,
              left: pos.left,
              rotate: `${pos.rotate}deg`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.25, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: i * 0.2,
              type: 'spring',
              stiffness: 100,
            }}
            viewport={{ once: true, amount: 0.3 }}
          />
        ))}
      </div>

      <Container>
        <motion.div
          className="relative z-10 mx-auto max-w-2xl text-center"
          variants={wrapVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0D1B2A] to-[#1A73E8] bg-clip-text text-transparent"
            variants={fadeUp}
          >
            29+ Professional Templates
          </motion.h2>

          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-600"
            variants={fadeUp}
          >
            From blue collar to executive, pick a template that matches your industry and career level.
          </motion.p>

          <motion.div className="mt-6" variants={fadeUp}>
            <Link
              to="/register"
              className="inline-flex items-center bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
            >
              Start Building Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

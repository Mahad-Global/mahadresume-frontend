import React from 'react'
import Container from './Container'
import SectionTitle from './SectionTitle'
import { motion } from 'framer-motion'

const fadeUpContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 20 } },
}

const steps = [
  {
    step: 1,
    title: 'Upload your CV',
    desc: 'Drag and drop your old PDF, paste your work history, or send it via WhatsApp.',
  },
  {
    step: 2,
    title: 'AI enhances it',
    desc: 'GPT-4o rewrites every section for impact, adds missing keywords, and formats beautifully.',
  },
  {
    step: 3,
    title: 'Download & apply',
    desc: 'Save your resume and cover letter in PDF or DOCX and apply with confidence.',
  },
]

export default function Steps() {
  return (
    <section
      id="get-started"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-blue-50 to-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <Container>
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeUp}>
            <SectionTitle
              center
              eyebrow="How it works"
              title="Ready in 3 simple steps"
              subtitle="From old CV to job-ready resume in under 2 minutes."
            />
          </motion.div>
        </motion.div>

        <motion.ol
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3"
        >
          {steps.map((s, idx) => (
            <motion.li
              key={s.step}
              variants={itemVariant}
              className="relative flex flex-col items-center text-center"
            >
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-[#1A73E8] to-[#00D4FF] z-0" />
              )}

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#00D4FF] text-white font-bold text-lg shadow-lg">
                {s.step}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0D1B2A]">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">{s.desc}</p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  )
}

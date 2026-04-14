import React from 'react'
import { Link } from 'react-router-dom'
import Container from './Container'
import { motion } from 'framer-motion'

const wrapVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

export default function CTA() {
  return (
    <section className="bg-[#0D1B2A] py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A73E8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0097A7]/10 rounded-full blur-3xl" />
      </div>

      <Container>
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          variants={wrapVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6" variants={fadeUp}>
            Your next job starts with a better resume.
          </motion.h2>

          <motion.p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto" variants={fadeUp}>
            Join 50,000+ Gulf professionals who built their winning resume with MahadResume. Start free, upgrade when you need more.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeUp}>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-[#1A73E8] hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-blue-900/50 hover:-translate-y-0.5"
            >
              Build My Free Resume
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/register?role=employer"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              I&apos;m an Employer
            </Link>
          </motion.div>

          <motion.p className="text-gray-500 text-sm mt-6" variants={fadeUp}>
            No credit card required &middot; Cancel anytime
          </motion.p>
        </motion.div>
      </Container>
    </section>
  )
}

import React from 'react'
import Container from './Container'
import SectionTitle from './SectionTitle'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const fadeUpContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(2px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

const listContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

const qa = [
  {
    q: 'Is it really ATS-friendly?',
    a: 'Yes. Our templates use clean structure and standard fonts so parsers extract content reliably.',
  },
  {
    q: 'Can I switch templates later?',
    a: 'Absolutely. Your content is reusable across designs without losing formatting.',
  },
  {
    q: 'Do you support Arabic?',
    a: 'Yes. RTL layout and font pairing on supported templates.',
  },
  {
    q: 'What happens to my data?',
    a: 'We store only what\'s needed. You can export and delete anytime.',
  },
  {
    q: 'How does the WhatsApp bot work?',
    a: 'Send your old CV to our WhatsApp number. Our AI processes it and sends back a polished resume in minutes. No login needed.',
  },
  {
    q: 'Can employers use MahadResume?',
    a: 'Yes. Our Employer Portal lets you post hiring campaigns, share invite links, and screen candidates with knockout questions.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -left-32 w-36 h-36 rounded-t-full bg-gradient-to-r from-[#00D4FF] to-[#1A73E8] opacity-20 blur-3xl"
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-40 h-40 rounded-b-full bg-gradient-to-r from-[#1A73E8] to-[#7B2FF7] opacity-20 blur-3xl"
        animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container>
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeUp}>
            <SectionTitle center title="Frequently asked questions" />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-8 max-w-3xl space-y-4"
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {qa.map((item, idx) => (
            <motion.details
              key={idx}
              variants={itemVariant}
              className="group p-6 rounded-xl border border-blue-200 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-blue-50/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-[#0D1B2A] font-semibold">
                <span>{item.q}</span>
                <ChevronDown className="w-5 h-5 text-[#1A73E8] transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                {item.a}
              </p>
            </motion.details>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

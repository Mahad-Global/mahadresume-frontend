import React from 'react'
import { useNavigate } from 'react-router-dom'
import Container from './Container'
import SectionTitle from './SectionTitle'
import { features } from './data'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

const Icons = {
  ai: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 3l1.6 3.6L17 8.2l-3.4 1.6L12 13l-1.6-3.2L7 8.2l3.4-1.6L12 3z" />
      <path d="M18.5 13l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6z" />
    </svg>
  ),
  ats: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  export: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 3v10m0 0l-3-3m3 3l3-3" />
      <path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
    </svg>
  ),
  bot: (props) => <Bot {...props} />,
  star: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 17.3l-6.18 3.25 1.18-6.88L1 8.97l6.91-1L12 1.5l4.09 6.47L23 8.97l-5 4.7 1.18 6.88z" />
    </svg>
  ),
}

const container = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const card = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 18 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: 'blur(2px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 160, damping: 18 } },
}

export default function Features() {
  const navigate = useNavigate()

  const handleFeatureClick = (title) => {
    if (title.includes('Templates')) {
      navigate('/templates')
    } else if (title.includes('REX')) {
      navigate('/dashboard/ats')
    }
  }

  return (
    <section id="features" className="pt-16 sm:pt-20 lg:pt-24 bg-transparent">
      <Container>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle
            center
            eyebrow="Why choose us"
            title="Interview-winning features. Only on Mahad Resume"
            subtitle="Everything you need to craft a clean, ATS-friendly resume that actually gets seen."
          />
        </motion.div>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((f) => {
            const Icon = Icons[f.icon] || Icons.star
            return (
              <motion.div
                key={f.title}
                variants={card}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => handleFeatureClick(f.title)}
              >
                <div className="absolute inset-0">
                  <div className="absolute w-[600px] h-[700px] bg-gradient-to-tr from-[#00D4FF] via-[#1A73E8] to-[#7B2FF7] opacity-60 rounded-[40%] animate-spin-slow -left-1/2 -top-2/3" />
                  <div className="absolute w-[600px] h-[700px] bg-gradient-to-tr from-[#00D4FF] via-[#1A73E8] to-[#7B2FF7] opacity-60 rounded-[40%] animate-spin-slower top-1/3 -left-1/2" />
                  <div className="absolute w-[600px] h-[700px] bg-gradient-to-tr from-[#00D4FF] via-[#1A73E8] to-[#7B2FF7] opacity-60 rounded-[40%] animate-spin-slowest top-1/2 -left-1/2" />
                </div>

                <div className="relative z-10 p-6 text-center text-white">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/30 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/90">{f.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin 30s linear infinite; }
        .animate-spin-slower { animation: spin 45s linear infinite; }
        .animate-spin-slowest { animation: spin 60s linear infinite; }
      `}</style>
    </section>
  )
}

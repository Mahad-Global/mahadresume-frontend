import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from './Container'
import { motion } from 'framer-motion'
import { Bot, Gauge } from 'lucide-react'

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 18 } },
}

const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

const floatBadge = {
  initial: { y: 0 },
  animate: { y: [0, -2, 0], transition: { repeat: Infinity, repeatType: 'loop', duration: 3 } },
}

export default function Hero() {
  const navigate = useNavigate()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file) {
      navigate('/dashboard/resume/new', { state: { file } })
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files?.length) {
      handleFileSelect(files[0])
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#A7C7E7] via-white to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute -bottom-40 left-1/3 w-50 h-50 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <Container className="pt-16 sm:pt-20 lg:pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left column */}
          <motion.div
            className="lg:col-span-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-120px' }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-lg"
              variants={fadeUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-500"
                variants={floatBadge}
                initial="initial"
                animate="animate"
              />
              <span>AI Resume Builder &middot; ATS-Friendly</span>
            </motion.div>

            <motion.h1
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0D1B2A]"
              variants={fadeUp}
            >
              Build a job-winning resume with{' '}
              <span className="bg-gradient-to-r from-[#00D4FF] via-[#1A73E8] to-[#7B2FF7] bg-clip-text text-transparent">
                Mahad Resume
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 text-lg text-gray-500 max-w-xl"
              variants={fadeUp}
            >
              Only 2% of resumes pass ATS systems. Upload your old CV and our AI transforms it into a job-winning resume in under 2 minutes.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3"
              variants={fadeUp}
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-blue-200"
                >
                  Get Started
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust stats */}
            <motion.div className="mt-6 flex flex-wrap items-center gap-6 text-sm" variants={fadeUp}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600"><strong className="text-gray-900">39%</strong> more likely to land the job</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500'].map((c, i) => (
                    <div key={i} className={`w-6 h-6 ${c} rounded-full border-2 border-white text-white text-[8px] font-bold flex items-center justify-center`}>
                      {['A', 'F', 'R', 'S'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-gray-600"><strong className="text-gray-900">50,000+</strong> professionals trust us</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Upload card */}
          <motion.div
            className="lg:col-span-6"
            variants={slideInRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-120px' }}
          >
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              className={`relative rounded-3xl border ${isDragOver ? 'border-[#1A73E8]' : 'border-blue-200'} bg-white p-6 shadow-xl`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0D1B2A]">Start from your old resume</h3>
                  <p className="text-sm text-gray-500">
                    Drop a PDF/Docx here and let AI extract everything.
                  </p>
                </div>

                <motion.button
                  className="rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-blue-300 hover:bg-gray-50 text-[#1A73E8]"
                  onClick={() => fileRef.current?.click()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  Upload
                </motion.button>
              </div>

              <motion.div
                className={`mt-4 grid place-items-center rounded-2xl border border-dashed cursor-pointer ${
                  isDragOver ? 'border-[#1A73E8] bg-blue-50' : 'border-blue-300'
                } p-8`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragOver(false)
                  const files = e.dataTransfer.files
                  if (files.length > 0) handleFileSelect(files[0])
                }}
                animate={isDragOver ? { scale: 1.01 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              >
                <motion.svg
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A73E8"
                  strokeWidth=".5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                >
                  <path d="M12 16V4m0 0l-3 3m3-3l3 3" />
                  <rect x="3" y="12" width="18" height="8" rx="2" />
                </motion.svg>

                <p className="mt-3 text-sm text-gray-500">
                  Drag & drop here, or <span className="font-semibold text-[#1A73E8]">browse</span> to upload
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) handleFileSelect(e.target.files[0])
                  }}
                />
              </motion.div>

              {/* Two info boxes */}
              <motion.div
                className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
                }}
              >
                <motion.div className="sm:col-span-7 rounded-2xl p-5 border border-blue-200" variants={fadeUp}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-blue-100 text-[#1A73E8]">
                      <Bot size={18} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">AI Resume Analysis</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Our AI reads your resume to highlight missing skills and structure suggestions.
                  </p>
                </motion.div>

                <motion.div className="sm:col-span-5 rounded-2xl p-5 border border-blue-200" variants={fadeUp}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <Gauge size={18} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">ATS Score Checker</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Instantly view how well your resume performs against ATS and receive a score.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

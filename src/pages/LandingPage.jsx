import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

// ââ Feature Cards âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const FEATURES = [
  {
    icon: 'ð¤',
    title: 'AI Resume Builder',
    desc: 'Upload your old CV. Our GPT-4o engine rewrites, enhances, and formats it into a stunning professional resume in minutes.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: 'ð¯',
    title: 'ATS Score Checker',
    desc: 'Paste a job description and instantly see how your resume scores. Get keyword suggestions to beat the bots.',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
  },
  {
    icon: 'ð¼',
    title: 'Smart Job Match',
    desc: 'We scan thousands of UAE & Gulf jobs and rank them by match percentage to your resume profile.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
  },
  {
    icon: 'âï¸',
    title: 'Cover Letter AI',
    desc: 'Generate tailored, professional cover letters for any job in seconds. Personalized to the company and role.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: 'ð¬',
    title: 'WhatsApp Bot',
    desc: 'Send your old CV to our WhatsApp number. Get a polished resume back â no app, no login needed.',
    color: 'bg-yellow-50 border-yellow-100',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: 'ð¢',
    title: 'Employer Portal',
    desc: 'Post hiring campaigns, share invite links, screen candidates with knockout questions, and hire faster.',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
  },
]

// ââ Pricing Data ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const PRICING = {
  bluecollar: {
    label: 'Blue Collar',
    plans: [
      {
        name: 'Basic',
        price: 'Free',
        priceNote: 'Forever',
        highlight: false,
        features: ['1 Resume', '3 ATS checks/month', 'WhatsApp CV upload', 'Basic templates', 'Email support'],
        cta: 'Get Started Free',
        ctaLink: '/register',
      },
      {
        name: 'Worker Pro',
        price: '4 AED',
        priceNote: '/month',
        highlight: true,
        features: ['3 Resumes', '10 ATS checks/month', 'AI rewrite (5x/month)', 'WhatsApp priority', '5 templates', 'PDF export'],
        cta: 'Start for 4 AED',
        ctaLink: '/register',
      },
      {
        name: 'Worker Plus',
        price: '18 AED',
        priceNote: '/month',
        highlight: false,
        features: ['Unlimited resumes', 'Unlimited ATS checks', 'Unlimited AI rewrites', 'Job matching', 'Cover letter AI', 'Priority support'],
        cta: 'Get Worker Plus',
        ctaLink: '/register',
      },
    ],
  },
  jobseeker: {
    label: 'Job Seeker',
    plans: [
      {
        name: 'Free',
        price: 'Free',
        priceNote: 'Forever',
        highlight: false,
        features: ['2 Resumes', '3 ATS checks/month', '5 AI requests', 'Basic templates', 'PDF export'],
        cta: 'Get Started Free',
        ctaLink: '/register',
      },
      {
        name: 'Pro',
        price: '99 AED',
        priceNote: '/month',
        highlight: true,
        features: ['10 Resumes', '20 ATS checks/month', '50 AI requests', 'All templates', 'Job matching', 'Cover letter AI', 'Priority support'],
        cta: 'Go Pro',
        ctaLink: '/register',
      },
      {
        name: 'Enterprise',
        price: '299 AED',
        priceNote: '/month',
        highlight: false,
        features: ['Unlimited everything', 'WhatsApp bot access', 'LinkedIn optimization', 'Dedicated account manager', 'Custom templates', 'API access'],
        cta: 'Go Enterprise',
        ctaLink: '/register',
      },
    ],
  },
  agencies: {
    label: 'Agencies',
    plans: [
      {
        name: 'Starter',
        price: '500 AED',
        priceNote: '/month',
        highlight: false,
        features: ['20 candidate resumes', '5 hiring campaigns', 'Basic candidate search', 'ATS bulk check', 'Email support'],
        cta: 'Start Agency Plan',
        ctaLink: '/register?role=employer',
      },
      {
        name: 'Professional',
        price: '1,500 AED',
        priceNote: '/month',
        highlight: true,
        features: ['50 candidate resumes', '20 hiring campaigns', 'Advanced candidate search', 'Knockout screening', 'Application pipeline', 'WhatsApp notifications'],
        cta: 'Go Professional',
        ctaLink: '/register?role=employer',
      },
      {
        name: 'Enterprise',
        price: '5,000 AED',
        priceNote: '/month',
        highlight: false,
        features: ['Unlimited everything', 'Unlimited campaigns', 'Custom branding', 'API integration', 'Dedicated success manager', 'SLA guarantee'],
        cta: 'Contact Sales',
        ctaLink: '/register?role=employer',
      },
    ],
  },
}

// ââ Testimonials ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TESTIMONIALS = [
  {
    name: 'Ahmed Al Rashidi',
    role: 'Civil Engineer, Dubai',
    text: 'I uploaded my old CV and got a professional resume in 2 minutes. Got 3 interviews the same week. This is incredible.',
    rating: 5,
    avatar: 'A',
  },
  {
    name: 'Fatima Hassan',
    role: 'Accountant, Abu Dhabi',
    text: 'The ATS checker told me my resume was scoring 34%. After applying the suggestions, it went to 87%. I landed the job!',
    rating: 5,
    avatar: 'F',
  },
  {
    name: 'Rajesh Kumar',
    role: 'IT Manager, Sharjah',
    text: 'The WhatsApp bot is brilliant. I sent my old PDF at 11pm, got a polished resume back in minutes. No login, no fuss.',
    rating: 5,
    avatar: 'R',
  },
  {
    name: 'Sarah Al Mansoori',
    role: 'HR Director, Dubai',
    text: 'We use MahadResume to post campaigns and screen 200+ applicants automatically. The knockout feature saves us 10 hours a week.',
    rating: 5,
    avatar: 'S',
  },
]

// ââ Stats âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const STATS = [
  { value: '50,000+', label: 'Resumes Created' },
  { value: '89%', label: 'Interview Rate' },
  { value: '2 min', label: 'Average Build Time' },
  { value: '12 countries', label: 'Gulf Region Coverage' },
]

export default function LandingPage() {
  const [pricingTab, setPricingTab] = useState('jobseeker')
  const currentPricing = PRICING[pricingTab]

  return (
    <div className="font-['Inter',sans-serif] bg-white">
      <Navbar />

      {/* ââ HERO ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1a2d42] to-[#0D1B2A] text-white py-24 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1A73E8]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0097A7]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm">
            <span className="text-[#0097A7]">â</span>
            <span>Trusted by 50,000+ professionals across the Gulf</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Upload your old CV.
            <br />
            <span className="text-[#1A73E8]">AI does the rest.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The smartest resume builder for UAE & Gulf job seekers. Beat ATS systems,
            match jobs instantly, and get hired faster â all powered by GPT-4o.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#1A73E8] hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Build My Resume Free â
            </Link>
            <a
              href="https://wa.me/14155238886?text=Hi"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-green-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>ð¬</span> Try WhatsApp Bot
            </a>
          </div>

          <p className="text-gray-400 text-sm mt-6">No credit card Â· Free forever plan Â· Setup in 2 minutes</p>

          {/* Hero image placeholder */}
          <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="bg-[#1a2d42] rounded-xl p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-gray-400 text-xs">resume-builder.app</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center text-sm">ð¤</div>
                  <div className="flex-1">
                    <div className="h-2 bg-[#1A73E8]/40 rounded-full w-3/4 mb-1" />
                    <div className="h-2 bg-white/20 rounded-full w-1/2" />
                  </div>
                  <span className="text-green-400 text-xs font-medium">ATS: 94%</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="grid grid-cols-3 gap-2">
                  {['Work Experience', 'Education', 'Skills'].map((s) => (
                    <div key={s} className="bg-white/10 rounded-lg p-2 text-center text-xs text-gray-300">{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ââ STATS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="bg-[#1A73E8] py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ââ FEATURES ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0D1B2A] mb-4">Everything you need to get hired</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From CV upload to job offer â MahadResume handles every step of your job search journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className={`border rounded-2xl p-6 hover:shadow-lg transition-shadow ${f.color}`}>
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0D1B2A] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ââ HOW IT WORKS ââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0D1B2A] mb-4">Ready in 3 steps</h2>
            <p className="text-gray-600 text-lg">From old CV to job-ready resume in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload your CV', desc: 'Drag & drop your old PDF or paste your work history. Even a WhatsApp message works.', icon: 'ð¤' },
              { step: '02', title: 'AI enhances it', desc: 'GPT-4o rewrites every section for impact, adds missing keywords, and formats beautifully.', icon: 'â¨' },
              { step: '03', title: 'Apply & get hired', desc: 'Download your ATS-optimized resume, match with jobs, and track your applications.', icon: 'ð' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#1A73E8] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ââ PRICING âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section id="pricing" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0D1B2A] mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 text-lg">Designed for every type of Gulf job seeker and employer.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-1">
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 gap-1 shrink-0">
              {Object.entries(PRICING).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setPricingTab(key)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pricingTab === key
                      ? 'bg-[#1A73E8] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPricing.plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-7 relative transition-all ${
                  plan.highlight
                    ? 'border-2 border-[#1A73E8] shadow-xl shadow-blue-100 md:scale-105'
                    : 'border border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#1A73E8] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-[#0D1B2A]">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.priceNote}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-[#1A73E8] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'border border-gray-200 hover:border-[#1A73E8] hover:text-[#1A73E8] text-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ââ TESTIMONIALS âââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section id="testimonials" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0D1B2A] mb-4">Loved by Gulf professionals</h2>
            <p className="text-gray-600 text-lg">Join thousands who landed their dream job with MahadResume.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <div className="flex text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <span key={i}>â</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A73E8] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ââ CTA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="bg-gradient-to-r from-[#0D1B2A] to-[#1a2d42] py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your next job starts with a better resume.
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Join 50,000+ Gulf professionals already using MahadResume. Start free, upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#1A73E8] hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-xl shadow-blue-900/50"
            >
              Build My Free Resume â
            </Link>
            <Link
              to="/register?role=employer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              I'm an Employer
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">No credit card required Â· Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

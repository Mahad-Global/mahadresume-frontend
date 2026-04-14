import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/landing/Hero'
import Trusted from '../components/landing/Trusted'
import Features from '../components/landing/Features'
import Steps from '../components/landing/Steps'
import Testimonials from '../components/landing/Testimonials'
import TemplatesPreview from '../components/landing/TemplatesPreview'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'

// -- Animated Counter --
function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let current = 0
    const increment = Math.ceil(end / 60)
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [end])
  return <>{count.toLocaleString()}{suffix}</>
}

// -- Pricing data --
const PRICING = {
  bluecollar: {
    label: 'Blue Collar',
    plans: [
      {
        name: 'Basic',
        price: 'Free',
        priceNote: 'forever',
        highlight: false,
        features: ['1 Resume', '3 ATS checks/month', 'WhatsApp CV upload', 'Basic templates', 'Email support'],
        cta: 'Get Started Free',
        ctaLink: '/register',
      },
      {
        name: 'Worker Pro',
        price: '4',
        currency: 'AED',
        priceNote: '/month',
        highlight: true,
        features: ['3 Resumes', '10 ATS checks/month', 'AI rewrite (5x/month)', 'WhatsApp priority', '5 templates', 'PDF export'],
        cta: 'Start for 4 AED',
        ctaLink: '/register',
      },
      {
        name: 'Worker Plus',
        price: '18',
        currency: 'AED',
        priceNote: '/month',
        highlight: false,
        features: ['Unlimited resumes', 'Unlimited ATS checks', 'Unlimited AI rewrites', 'Job matching', 'Cover letter AI', 'Priority support'],
        cta: 'Get Worker Plus',
        ctaLink: '/register',
      },
    ],
  },
  jobseeker: {
    label: 'Job Seekers',
    plans: [
      {
        name: 'Free',
        price: 'Free',
        priceNote: 'forever',
        highlight: false,
        features: ['2 Resumes', '3 ATS checks/month', '5 AI requests', 'Basic templates', 'PDF export'],
        cta: 'Get Started Free',
        ctaLink: '/register',
      },
      {
        name: 'Pro',
        price: '99',
        currency: 'AED',
        priceNote: '/month',
        highlight: true,
        features: ['10 Resumes', '20 ATS checks/month', '50 AI requests', 'All templates', 'Job matching', 'Cover letter AI', 'Priority support'],
        cta: 'Go Pro',
        ctaLink: '/register',
      },
      {
        name: 'Enterprise',
        price: '299',
        currency: 'AED',
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
        price: '500',
        currency: 'AED',
        priceNote: '/month',
        highlight: false,
        features: ['20 candidate resumes', '5 hiring campaigns', 'Basic candidate search', 'ATS bulk check', 'Email support'],
        cta: 'Start Agency Plan',
        ctaLink: '/register?role=employer',
      },
      {
        name: 'Professional',
        price: '1,500',
        currency: 'AED',
        priceNote: '/month',
        highlight: true,
        features: ['50 candidate resumes', '20 hiring campaigns', 'Advanced candidate search', 'Knockout screening', 'Application pipeline', 'WhatsApp notifications'],
        cta: 'Go Professional',
        ctaLink: '/register?role=employer',
      },
      {
        name: 'Enterprise',
        price: '5,000',
        currency: 'AED',
        priceNote: '/month',
        highlight: false,
        features: ['Unlimited everything', 'Unlimited campaigns', 'Custom branding', 'API integration', 'Dedicated success manager', 'SLA guarantee'],
        cta: 'Contact Sales',
        ctaLink: '/register?role=employer',
      },
    ],
  },
}

export default function LandingPage() {
  const [pricingTab, setPricingTab] = useState('jobseeker')
  const currentPricing = PRICING[pricingTab]

  return (
    <div className="font-['Inter',sans-serif] bg-white">
      <Navbar />

      {/* Hero with drag-drop upload + animated badges */}
      <Hero />

      {/* Trust bar with company names */}
      <Trusted />

      {/* Live counter */}
      <section className="py-10 bg-[#1A73E8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
            </svg>
            <span className="text-3xl sm:text-4xl font-bold text-white">
              <AnimatedCounter end={38547} />
            </span>
            <span className="text-lg sm:text-xl text-blue-100 font-medium">resumes created this month</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '89%', label: 'Interview rate', sub: 'for Pro users' },
            { value: '2 min', label: 'Average time', sub: 'to build a resume' },
            { value: '94%', label: 'ATS pass rate', sub: 'after AI optimization' },
            { value: '12', label: 'Countries', sub: 'across the Gulf' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0D1B2A]">{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Animated feature cards */}
      <Features />

      {/* 3-step process with connector lines */}
      <Steps />

      {/* Templates floating preview */}
      <TemplatesPreview />

      {/* Pricing with 3 tabs */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#1A73E8] uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B2A] mt-2 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 text-lg">Designed for every type of Gulf job seeker and employer.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 gap-1 shadow-sm">
              {Object.entries(PRICING).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setPricingTab(key)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pricingTab === key
                      ? 'bg-[#1A73E8] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPricing.plans.map(plan => (
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
                    <span className="bg-[#1A73E8] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  {plan.currency && <span className="text-lg text-gray-400">{plan.currency}</span>}
                  <span className="text-4xl font-extrabold text-[#0D1B2A]">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.priceNote}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#1A73E8] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-[#1A73E8] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'border-2 border-gray-200 hover:border-[#1A73E8] hover:text-[#1A73E8] text-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling testimonials carousel */}
      <Testimonials />

      {/* FAQ accordion */}
      <FAQ />

      {/* Final CTA */}
      <CTA />

      <Footer />
    </div>
  )
}

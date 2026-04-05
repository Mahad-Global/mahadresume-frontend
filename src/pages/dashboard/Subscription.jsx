import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getPlans, getSubscription, subscribe, cancelSubscription } from '../../services/payments'

export default function Subscription() {
  const [plans, setPlans] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubs] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    Promise.all([getPlans(), getSubscription()])
      .then(([planRes, subRes]) => {
        setPlans(planRes.data?.results ?? planRes.data ?? [])
        setSubscription(subRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubscribe = async (slug) => {
    setSubs(slug)
    setMsg('')
    try {
      const res = await subscribe(slug)
      setSubscription(res.data?.subscription ?? res.data)
      setMsg('â Subscription updated successfully!')
    } catch (err) {
      setMsg('â ' + (err.response?.data?.error || 'Subscription failed'))
    } finally {
      setSubs(null)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription? You\'ll be downgraded to the free plan.')) return
    try {
      await cancelSubscription()
      setSubscription((s) => ({ ...s, status: 'cancelled' }))
      setMsg('â Subscription cancelled')
    } catch {
      setMsg('â Cancellation failed')
    }
    setTimeout(() => setMsg(''), 4000)
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading subscription..." />
      </div>
    </DashboardLayout>
  )

  const jobseekerPlans = plans.filter((p) => p.plan_type === 'jobseeker' || !p.plan_type || p.plan_type === 'job_seeker')
  const currentPlanSlug = subscription?.plan?.slug

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">Subscription</h1>
          <p className="text-gray-500 mt-1">Manage your plan and billing.</p>
        </div>

        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm border ${msg.startsWith('â') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Current plan */}
        {subscription && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Current Plan</p>
                <h2 className="text-2xl font-bold text-[#0D1B2A]">{subscription.plan?.name || 'Free'}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {subscription.status === 'active' ? `Renews ${new Date(subscription.period_end).toLocaleDateString('en-AE')}` : `Status: ${subscription.status}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#1A73E8]">{subscription.plan?.price ?? 0} AED</p>
                <p className="text-gray-500 text-sm"> AED/month</p>
              </div>
            </div>

            {/* Usage */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Resumes', used: subscription.resumes_used, limit: subscription.plan?.resume_limit },
                { label: 'AI Requests', used: subscription.ai_requests_used, limit: subscription.plan?.ai_requests_limit },
                { label: 'ATS Checks', used: subscription.ats_checks_used, limit: subscription.plan?.ats_checks_limit },
              ].map(({ label, used, limit }) => {
                const pct = limit === -1 ? 0 : limit ? Math.min(100, ((used || 0) / limit) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{label}</span>
                      <span>{used ?? 0} / {limit === -1 ? 'â' : (limit ?? 0)}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${pct >= 90 ? 'bg-red-500' : 'bg-[#1A73E8]'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {subscription.status === 'active' && currentPlanSlug !== 'free' && (
              <button onClick={handleCancel} className="mt-4 text-red-600 hover:text-red-800 text-sm underline">
                Cancel subscription
              </button>
            )}
          </div>
        )}

        {/* Plans */}
        <h2 className="text-lg font-bold text-[#0D1B2A] mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobseekerPlans.map((plan) => {
            const isCurrent = plan.slug === currentPlanSlug
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all ${isCurrent ? 'border-[#1A73E8] shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {isCurrent && (
                  <span className="inline-block bg-[#1A73E8] text-white text-xs px-2 py-0.5 rounded-full mb-3 font-medium">Current Plan</span>
                )}
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#0D1B2A]">{plan.price}</span>
                  <span className="text-gray-500 text-sm">AED/mo</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li>ð {plan.resume_limit === -1 ? 'Unlimited' : plan.resume_limit} Resumes</li>
                  <li>ð¤ {plan.ai_requests_limit === -1 ? 'Unlimited' : plan.ai_requests_limit} AI Requests</li>
                  <li>ð¯ {plan.ats_checks_limit === -1 ? 'Unlimited' : plan.ats_checks_limit} ATS Checks</li>
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.slug)}
                  disabled={isCurrent || subscribing === plan.slug}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 text-[#1A73E8] cursor-default'
                      : 'bg-[#1A73E8] hover:bg-blue-600 text-white disabled:opacity-60'
                  }`}
                >
                  {subscribing === plan.slug ? 'Processing...' : isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

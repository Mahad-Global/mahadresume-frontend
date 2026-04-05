import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getPublicCampaign, applyToCampaign } from '../../services/campaigns'
import { getResumes } from '../../services/resumes'
import useAuthStore from '../../store/authStore'

const STEPS = ['Campaign Info', 'Sign In', 'Answer Questions', 'Submit']

export default function ApplyPage() {
  const { inviteCode } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const [campaign, setCampaign] = useState(null)
  const [resumes, setResumes] = useState([])
  const [step, setStep] = useState(0) // 0: info, 1: auth, 2: questions, 3: done
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  const [selectedResume, setSelectedResume] = useState('')
  const [knockedOut, setKnockedOut] = useState(false)

  useEffect(() => {
    getPublicCampaign(inviteCode)
      .then((r) => {
        setCampaign(r.data)
        if (isAuthenticated()) {
          setStep(2)
          return getResumes()
        }
      })
      .then((r) => {
        if (r) {
          const rs = r.data?.results ?? r.data ?? []
          setResumes(rs)
          if (rs.length) setSelectedResume(rs[0].id)
        }
      })
      .catch(() => setError('Campaign not found or no longer active.'))
      .finally(() => setLoading(false))
  }, [inviteCode])

  const handleProceedToAuth = () => {
    if (isAuthenticated()) {
      setStep(2)
    } else {
      setStep(1)
    }
  }

  const handleAuthDone = async () => {
    // After login/register redirect back here
    try {
      const r = await getResumes()
      const rs = r.data?.results ?? r.data ?? []
      setResumes(rs)
      if (rs.length) setSelectedResume(rs[0].id)
    } catch { /* ignore */ }
    setStep(2)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await applyToCampaign(inviteCode, {
        answers,
        resume_id: selectedResume || undefined,
      })
      setKnockedOut(res.data?.knocked_out || false)
      setStep(3)
    } catch (err) {
      const d = err.response?.data
      setError(d?.error || d?.detail || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading campaign..." />
    </div>
  )

  if (error && !campaign) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Campaign Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/" className="text-[#1A73E8] hover:underline">← Back to MahadResume</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0D1B2A] py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1A73E8] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-white font-bold">MahadResume</span>
          </Link>
          {isAuthenticated() && (
            <span className="text-gray-400 text-sm">{user?.email}</span>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${i <= step ? 'text-[#1A73E8]' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-[#1A73E8] text-white' : i === step ? 'bg-blue-100 text-[#1A73E8] border-2 border-[#1A73E8]' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block text-xs font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-[#1A73E8]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Campaign Info */}
        {step === 0 && campaign && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full mb-3 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {campaign.is_open ? 'Accepting Applications' : 'Closed'}
              </div>
              <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">{campaign.title}</h1>
              {campaign.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{campaign.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {campaign.end_date && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Application Deadline</p>
                  <p className="font-medium text-gray-800 text-sm">{new Date(campaign.end_date).toLocaleDateString('en-AE')}</p>
                </div>
              )}
              {campaign.max_candidates && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Positions Available</p>
                  <p className="font-medium text-gray-800 text-sm">{campaign.max_candidates}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Questions</p>
                <p className="font-medium text-gray-800 text-sm">{campaign.questions?.length || 0} screening questions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-0.5">Applications</p>
                <p className="font-medium text-gray-800 text-sm">{campaign.application_count || 0} received</p>
              </div>
            </div>

            {campaign.questions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Screening Questions Preview</h3>
                <ul className="space-y-1">
                  {campaign.questions.slice(0, 3).map((q, i) => (
                    <li key={q.id} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400 text-xs mt-0.5">{i + 1}.</span>
                      {q.question_text}
                      {q.is_knockout && <span className="text-red-500 text-xs">(required)</span>}
                    </li>
                  ))}
                  {campaign.questions.length > 3 && (
                    <li className="text-xs text-gray-400">+{campaign.questions.length - 3} more questions</li>
                  )}
                </ul>
              </div>
            )}

            {!campaign.is_open ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                This campaign is no longer accepting applications.
              </div>
            ) : (
              <button
                onClick={handleProceedToAuth}
                className="w-full bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Apply Now →
              </button>
            )}
          </div>
        )}

        {/* Step 1: Auth */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-2">Sign in to apply</h2>
            <p className="text-gray-500 text-sm mb-6">
              Create a free account or sign in to submit your application for <strong>{campaign?.title}</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={`/register?redirect=/apply/${inviteCode}`}
                className="w-full bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-center"
              >
                Create Free Account
              </Link>
              <Link
                to={`/login?redirect=/apply/${inviteCode}`}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors text-center"
              >
                Sign In
              </Link>
              <button onClick={() => setStep(0)} className="text-gray-400 text-sm hover:text-gray-600">← Back</button>
            </div>
          </div>
        )}

        {/* Step 2: Questions + Submit */}
        {step === 2 && campaign && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-1">Answer Screening Questions</h2>
            <p className="text-gray-500 text-sm mb-6">Applying as: <strong>{user?.email}</strong></p>

            {/* Resume selector */}
            {resumes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Attach Resume (optional)</label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
                >
                  <option value="">— No resume —</option>
                  {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
            )}

            {/* Questions */}
            {campaign.questions?.length > 0 ? (
              <div className="space-y-5 mb-6">
                {campaign.questions.map((q, i) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      {i + 1}. {q.question_text}
                      {q.is_required && <span className="text-red-500 ml-1">*</span>}
                      {q.is_knockout && <span className="ml-2 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">knockout</span>}
                    </label>

                    {q.question_type === 'yes_no' ? (
                      <div className="flex gap-3">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt.toLowerCase()}
                              checked={answers[q.id] === opt.toLowerCase()}
                              onChange={() => handleAnswerChange(q.id, opt.toLowerCase())}
                              className="text-[#1A73E8]"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.question_type === 'multiple_choice' && q.options?.length ? (
                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              className="text-[#1A73E8]"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.question_type === 'number' ? (
                      <input
                        type="number"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      />
                    ) : (
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                        placeholder="Your answer..."
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-700">
                No screening questions for this campaign. Click submit to apply.
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="px-5 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[#1A73E8] hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {submitting ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
            {knockedOut ? (
              <>
                <div className="text-5xl mb-4">😞</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Not Qualified</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Unfortunately, your answers did not meet the minimum requirements for this position. Thank you for applying.
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-[#0D1B2A] mb-2">Application Submitted!</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Your application for <strong>{campaign?.title}</strong> has been received. The employer will review it and get back to you.
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Go to Dashboard
              </Link>
              <Link to="/" className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

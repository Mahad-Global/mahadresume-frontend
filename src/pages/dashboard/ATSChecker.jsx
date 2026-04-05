import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { runATSCheck } from '../../services/ats'
import { getResumes } from '../../services/resumes'

export default function ATSChecker() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [resumes, setResumes] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getResumes().then((r) => setResumes(r.data?.results ?? r.data ?? []))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await runATSCheck(data.resume_id, data.job_description)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'ATS check failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const score = result?.score ?? result?.ats_score
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = score >= 80 ? 'bg-green-50 border-green-200' : score >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">ATS Score Checker</h1>
          <p className="text-gray-500 mt-1">Paste a job description and instantly see how your resume scores.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Resume</label>
              <select
                {...register('resume_id', { required: 'Please select a resume' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent outline-none bg-white"
              >
                <option value="">— Select a resume —</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
              {errors.resume_id && <p className="text-red-500 text-xs mt-1">{errors.resume_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description</label>
              <textarea
                {...register('job_description', { required: 'Job description is required', minLength: { value: 50, message: 'Please paste a full job description (min 50 chars)' } })}
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent outline-none resize-none font-mono"
                placeholder="Paste the full job description here..."
              />
              {errors.job_description && <p className="text-red-500 text-xs mt-1">{errors.job_description.message}</p>}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A73E8] hover:bg-blue-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? '⏳ Analyzing...' : '🎯 Check ATS Score'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Analyzing your resume against the job description..." />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Score */}
            <div className={`border rounded-2xl p-6 ${scoreBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">ATS Score</h2>
                <span className={`text-5xl font-bold ${scoreColor}`}>{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {score >= 80 ? '🎉 Excellent! Your resume is highly optimized for this job.' :
                  score >= 60 ? '⚠️ Good, but there\'s room for improvement. Add missing keywords.' :
                    '❌ Low score. Your resume needs significant optimization for this role.'}
              </p>
            </div>

            {/* Matched keywords */}
            {result.matched_keywords?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">✅ Matched Keywords ({result.matched_keywords.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched_keywords.map((k) => (
                    <span key={k} className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing keywords */}
            {result.missing_keywords?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">❌ Missing Keywords ({result.missing_keywords.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((k) => (
                    <span key={k} className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-medium">{k}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">Add these keywords to your resume to improve your score.</p>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">💡 Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#1A73E8] mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

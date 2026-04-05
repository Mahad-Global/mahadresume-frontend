import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { generateCoverLetter } from '../../services/ai'
import { getResumes } from '../../services/resumes'

export default function CoverLetter() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [resumes, setResumes] = useState([])
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getResumes().then((r) => setResumes(r.data?.results ?? r.data ?? []))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await generateCoverLetter(data)
      setResult(res.data?.cover_letter || res.data?.result || JSON.stringify(res.data))
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">Cover Letter Generator</h1>
          <p className="text-gray-500 mt-1">Generate a tailored, professional cover letter in seconds using AI.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Resume</label>
              <select
                {...register('resume_id', { required: 'Please select a resume' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
              >
                <option value="">— Select a resume —</option>
                {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
              {errors.resume_id && <p className="text-red-500 text-xs mt-1">{errors.resume_id.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                <input
                  {...register('company_name', { required: 'Company name is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  placeholder="e.g. Emirates Group"
                />
                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                <input
                  {...register('job_title', { required: 'Job title is required' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  placeholder="e.g. Senior Engineer"
                />
                {errors.job_title && <p className="text-red-500 text-xs mt-1">{errors.job_title.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description (optional)</label>
              <textarea
                {...register('job_description')}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                placeholder="Paste the job description for a more tailored cover letter..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tone</label>
              <select
                {...register('tone')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
              >
                <option value="professional">Professional</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="formal">Formal</option>
                <option value="conversational">Conversational</option>
              </select>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A73E8] hover:bg-blue-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? '⏳ Generating...' : '✨ Generate Cover Letter'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" text="AI is writing your cover letter..." />
          </div>
        )}

        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Generated Cover Letter</h2>
              <button
                onClick={handleCopy}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

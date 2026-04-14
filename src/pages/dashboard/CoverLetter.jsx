import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { generateCoverLetter } from '../../services/ai'
import { getResumes } from '../../services/resumes'
import { getSavedCoverLetters, saveCoverLetter, deleteCoverLetter } from '../../services/coverLetters'

export default function CoverLetter() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [resumes, setResumes] = useState([])
  const [savedLetters, setSavedLetters] = useState([])
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [lastGenMeta, setLastGenMeta] = useState(null)

  useEffect(() => {
    getResumes().then((r) => setResumes(r.data?.results ?? r.data ?? []))
    getSavedCoverLetters()
      .then((r) => setSavedLetters(r.data?.results ?? r.data ?? []))
      .catch(() => {}) // endpoint may not exist yet
      .finally(() => setLoadingSaved(false))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await generateCoverLetter(data)
      setResult(res.data?.cover_letter || res.data?.result || JSON.stringify(res.data))
      setLastGenMeta({ company_name: data.company_name, job_title: data.job_title })
      setActiveTab('generate')
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

  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    try {
      const res = await saveCoverLetter({
        content: result,
        company_name: lastGenMeta?.company_name || '',
        job_title: lastGenMeta?.job_title || '',
      })
      setSavedLetters((prev) => [res.data, ...prev])
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save. Backend may not support this endpoint yet.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSaved = async (id) => {
    if (!confirm('Delete this saved cover letter?')) return
    try {
      await deleteCoverLetter(id)
      setSavedLetters((prev) => prev.filter((l) => l.id !== id))
    } catch { /* ignore */ }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">Cover Letter</h1>
          <p className="text-gray-500 mt-1 text-sm">Generate and manage tailored cover letters with AI.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'generate' ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generate New
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'saved' ? 'bg-white shadow-sm text-[#0D1B2A]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved Letters {savedLetters.length > 0 && `(${savedLetters.length})`}
          </button>
        </div>

        {activeTab === 'generate' ? (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Resume</label>
                  <select
                    {...register('resume_id', { required: 'Please select a resume' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  >
                    <option value="">-- Select a resume --</option>
                    {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                  {errors.resume_id && <p className="text-red-500 text-xs mt-1">{errors.resume_id.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                    <input
                      {...register('company_name', { required: 'Required' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      placeholder="e.g. Emirates Group"
                    />
                    {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                    <input
                      {...register('job_title', { required: 'Required' })}
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
                  {loading ? 'Generating...' : 'Generate Cover Letter'}
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
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm transition-colors font-medium disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{result}</pre>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Saved Letters Tab */
          <div>
            {loadingSaved ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" text="Loading saved letters..." />
              </div>
            ) : savedLetters.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved cover letters</h3>
                <p className="text-gray-500 text-sm">Generate a cover letter and save it for later use.</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-4 text-[#1A73E8] text-sm hover:underline font-medium"
                >
                  Generate one now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedLetters.map((letter) => (
                  <div key={letter.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {letter.job_title || 'Untitled'} at {letter.company_name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Saved {new Date(letter.created_at).toLocaleDateString('en-AE')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(letter.content)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          className="text-gray-500 hover:text-[#1A73E8] text-xs hover:underline"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDeleteSaved(letter.id)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{letter.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getJobs, matchJobs, applyJob } from '../../services/jobs'
import { getResumes } from '../../services/resumes'

export default function JobMatch() {
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState('')
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [matchResults, setMatchResults] = useState(null)
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState(new Set())

  useEffect(() => {
    Promise.all([getJobs(), getResumes()])
      .then(([jobRes, resumeRes]) => {
        setJobs(jobRes.data?.results ?? jobRes.data ?? [])
        const rs = resumeRes.data?.results ?? resumeRes.data ?? []
        setResumes(rs)
        if (rs.length) setSelectedResume(rs[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleMatch = async () => {
    if (!selectedResume) return
    setMatching(true)
    try {
      const res = await matchJobs(selectedResume)
      setMatchResults(res.data?.matches ?? res.data ?? [])
    } catch { /* ignore */ }
    finally { setMatching(false) }
  }

  const handleApply = async (jobId) => {
    if (!selectedResume) return
    try {
      await applyJob(jobId, selectedResume)
      setApplied((prev) => new Set([...prev, jobId]))
    } catch { /* ignore */ }
  }

  const displayJobs = matchResults ?? jobs
  const filtered = displayJobs.filter((j) => {
    const q = search.toLowerCase()
    return !q || (j.title || j.job?.title || '').toLowerCase().includes(q) ||
      (j.company || j.job?.company_name || '').toLowerCase().includes(q)
  })

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading jobs..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Job Match</h1>
        <p className="text-gray-500 mt-1">Find the best jobs matched to your resume profile.</p>
      </div>

      {/* Match controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">Select resume to match</option>
            {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
          <button
            onClick={handleMatch}
            disabled={!selectedResume || matching}
            className="bg-[#1A73E8] hover:bg-blue-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            {matching ? '⏳ Matching...' : '🎯 Match My Jobs'}
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="sm:w-48 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
          />
        </div>
        {matchResults && (
          <p className="text-xs text-green-600 mt-2 font-medium">✅ Showing {matchResults.length} matched jobs for your resume</p>
        )}
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">💼</div>
            <p>No jobs found. Try matching your resume first.</p>
          </div>
        ) : filtered.map((item) => {
          const job = item.job || item
          const matchPct = item.match_percentage ?? item.score
          const isApplied = applied.has(job.id)

          return (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {matchPct !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${matchPct >= 80 ? 'bg-green-100 text-green-700' : matchPct >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {Math.round(matchPct)}% match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{job.company_name} · {job.location}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.employment_type && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{job.employment_type}</span>}
                    {job.salary_min && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">AED {job.salary_min.toLocaleString()}+</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-[#1A73E8] hover:bg-blue-600 text-white'}`}
                >
                  {isApplied ? '✅ Applied' : 'Apply'}
                </button>
              </div>
              {job.description && (
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">{job.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}

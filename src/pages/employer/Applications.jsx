import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getApplications, updateApplicationStatus } from '../../services/campaigns'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  hold: 'bg-gray-100 text-gray-700',
  interview_scheduled: 'bg-blue-100 text-blue-800',
  hired: 'bg-emerald-100 text-emerald-800',
}

const STATUS_OPTIONS = ['pending', 'shortlisted', 'rejected', 'hold', 'interview_scheduled', 'hired']

export default function Applications() {
  const { id: campaignId } = useParams()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [knockoutFilter, setKnockoutFilter] = useState('')
  const [updating, setUpdating] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const params = {}
    if (statusFilter) params.status = statusFilter
    if (knockoutFilter !== '') params.knocked_out = knockoutFilter
    getApplications(campaignId, params)
      .then((r) => setApplications(r.data?.results ?? r.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [campaignId, statusFilter, knockoutFilter])

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      const res = await updateApplicationStatus(campaignId, appId, newStatus)
      setApplications((prev) => prev.map((a) => a.id === appId ? res.data : a))
    } catch { /* ignore */ }
    finally { setUpdating(null) }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading applications..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/employer/campaigns" className="text-[#1A73E8] text-sm hover:underline mb-3 inline-block">← Back to Campaigns</Link>
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Applications</h1>
        <p className="text-gray-500 mt-1">{applications.length} total applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setLoading(true) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
        </select>
        <select
          value={knockoutFilter}
          onChange={(e) => { setKnockoutFilter(e.target.value); setLoading(true) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
        >
          <option value="">All Candidates</option>
          <option value="false">Passed Screening</option>
          <option value="true">Knocked Out</option>
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-700">No applications yet</h3>
          <p className="text-gray-500 text-sm mt-1">Share your campaign invite link to start receiving applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-[#1A73E8] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {(app.candidate_name || app.candidate_email || '?')[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-800 text-sm">
                      {app.candidate_name || app.candidate_email?.split('@')[0] || 'Candidate'}
                    </p>
                    {app.is_knocked_out && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚡ Knocked Out</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                      {app.status?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-400">{app.completion_percent}% complete</span>
                    {app.submitted_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(app.submitted_at).toLocaleDateString('en-AE')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={updating === app.id}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1A73E8] disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="text-xs text-[#1A73E8] hover:underline"
                  >
                    {expanded === app.id ? 'Hide' : 'Answers'}
                  </button>
                </div>
              </div>

              {/* Expanded answers */}
              {expanded === app.id && app.answers && Object.keys(app.answers).length > 0 && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Screening Answers</h4>
                  <div className="space-y-2">
                    {Object.entries(app.answers).map(([qId, answer]) => (
                      <div key={qId} className="text-sm">
                        <span className="text-gray-500 text-xs">Question:</span>
                        <span className="ml-2 text-gray-800">{String(answer)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

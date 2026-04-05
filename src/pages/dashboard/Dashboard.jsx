import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import ResumeCard from '../../components/resume/ResumeCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getDashboard } from '../../services/analytics'
import { getResumes, deleteResume } from '../../services/resumes'
import useResumeStore from '../../store/resumeStore'

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-500 text-sm font-medium">{label}</span>
      <span className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center text-lg`}>{icon}</span>
    </div>
    <div className="text-3xl font-bold text-[#0D1B2A]">{value ?? '—'}</div>
  </div>
)

export default function Dashboard() {
  const { resumes, setResumes } = useResumeStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getResumes()])
      .then(([dashRes, resumeRes]) => {
        setStats(dashRes.data)
        setResumes(resumeRes.data?.results ?? resumeRes.data ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteResume(id)
      setResumes(resumes.filter((r) => r.id !== id))
    } catch { /* ignore */ }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your job search overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Resumes" value={stats?.total_resumes} icon="📄" color="bg-blue-50" />
        <StatCard label="Avg ATS Score" value={stats?.avg_ats_score ? `${Math.round(stats.avg_ats_score)}%` : null} icon="🎯" color="bg-teal-50" />
        <StatCard label="Views This Week" value={stats?.views_this_week} icon="👁️" color="bg-purple-50" />
        <StatCard label="Downloads" value={stats?.downloads_this_week} icon="⬇️" color="bg-green-50" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'New Resume', icon: '➕', to: '/dashboard/resume', color: 'bg-[#1A73E8] text-white hover:bg-blue-600' },
          { label: 'ATS Check', icon: '🎯', to: '/dashboard/ats', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200' },
          { label: 'Browse Jobs', icon: '💼', to: '/dashboard/jobs', color: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' },
          { label: 'Cover Letter', icon: '✉️', to: '/dashboard/cover-letter', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' },
        ].map((a) => (
          <Link key={a.label} to={a.to} className={`${a.color} rounded-xl p-4 text-center transition-colors font-medium text-sm`}>
            <div className="text-2xl mb-1">{a.icon}</div>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Resumes */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0D1B2A]">My Resumes</h2>
        <Link to="/dashboard/resume" className="text-[#1A73E8] text-sm hover:underline font-medium">+ New Resume</Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first AI-powered resume in minutes.</p>
          <Link to="/dashboard/resume" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Build My Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resumes.map((r) => (
            <ResumeCard key={r.id} resume={r} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Recent events */}
      {stats?.recent_events?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#0D1B2A] mb-4">Recent Activity</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.recent_events.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">
                  {e.event_type === 'resume_viewed' ? '👁️' : e.event_type === 'resume_downloaded' ? '⬇️' : '📊'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 capitalize">{e.event_type?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400">{new Date(e.created_at).toLocaleDateString('en-AE')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

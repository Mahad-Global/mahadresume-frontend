import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getCampaigns } from '../../services/campaigns'
import { getEmployerProfile } from '../../services/employer'

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-500 text-sm font-medium">{label}</span>
      <span className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center text-lg`}>{icon}</span>
    </div>
    <div className="text-3xl font-bold text-[#0D1B2A]">{value ?? '—'}</div>
  </div>
)

export default function EmployerDashboard() {
  const [profile, setProfile] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEmployerProfile(), getCampaigns()])
      .then(([profileRes, campaignsRes]) => {
        setProfile(profileRes.data)
        setCampaigns(campaignsRes.data?.results ?? campaignsRes.data ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    </DashboardLayout>
  )

  const activeCampaigns = campaigns.filter((c) => c.is_active && !c.is_deleted)
  const totalApplications = campaigns.reduce((sum, c) => sum + (c.application_count || 0), 0)

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">
          Welcome, {profile?.company_name || 'Employer'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your hiring overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Campaigns" value={activeCampaigns.length} icon="📢" color="bg-blue-50" />
        <StatCard label="Total Applications" value={totalApplications} icon="👥" color="bg-teal-50" />
        <StatCard label="Total Campaigns" value={campaigns.length} icon="📋" color="bg-purple-50" />
        <StatCard label="Plan" value={profile?.subscription_plan || 'Starter'} icon="⭐" color="bg-yellow-50" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/employer/campaigns" className="bg-[#1A73E8] hover:bg-blue-600 text-white rounded-xl p-5 transition-colors group">
          <div className="text-3xl mb-3">📢</div>
          <h3 className="font-bold text-lg mb-1">Campaigns</h3>
          <p className="text-blue-200 text-sm">Create and manage hiring campaigns with invite links</p>
        </Link>
        <Link to="/employer/candidates" className="bg-white border border-gray-200 hover:shadow-md text-[#0D1B2A] rounded-xl p-5 transition-all">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold text-lg mb-1">Candidate Search</h3>
          <p className="text-gray-500 text-sm">Browse and search anonymized candidate profiles</p>
        </Link>
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold text-lg text-[#0D1B2A] mb-1">Analytics</h3>
          <p className="text-gray-500 text-sm">{totalApplications} total applications across all campaigns</p>
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0D1B2A]">Recent Campaigns</h2>
        <Link to="/employer/campaigns" className="text-[#1A73E8] text-sm hover:underline">View all →</Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 text-sm mb-5">Create your first hiring campaign and share the invite link.</p>
          <Link to="/employer/campaigns" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Invite Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.plan_type}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{c.invite_code}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-[#0D1B2A]">{c.application_count || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/employer/campaigns/${c.id}/applications`} className="text-[#1A73E8] text-xs hover:underline">View Apps</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

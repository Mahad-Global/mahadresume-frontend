import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { searchCandidates, saveCandidate } from '../../services/employer'

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(new Set())
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ skills: '', location: '', experience_years: '' })

  const handleSearch = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (filters.skills) params.skills = filters.skills
      if (filters.location) params.location = filters.location
      if (filters.experience_years) params.experience_years = filters.experience_years
      const res = await searchCandidates(params)
      setCandidates(res.data?.results ?? res.data ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { handleSearch() }, [])

  const handleSave = async (id) => {
    try {
      await saveCandidate(id)
      setSaved((prev) => new Set([...prev, id]))
    } catch { /* ignore */ }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Candidate Search</h1>
        <p className="text-gray-500 mt-1">Browse anonymized candidate profiles. Email and contact info hidden.</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
              placeholder="Search by role, skills, experience..."
            />
            <button type="submit" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={filters.skills}
              onChange={(e) => setFilters((f) => ({ ...f, skills: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
              placeholder="Skills (e.g. Python, Driving)"
            />
            <input
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
              placeholder="Location (e.g. Dubai)"
            />
            <input
              type="number"
              value={filters.experience_years}
              onChange={(e) => setFilters((f) => ({ ...f, experience_years: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
              placeholder="Min years experience"
            />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Searching candidates..." />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-500">No candidates found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {candidates.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#0097A7] rounded-full flex items-center justify-center text-white font-bold">
                    {(c.first_name || c.display_name || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.first_name || c.display_name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{c.current_role || c.target_role || 'Professional'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSave(c.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${saved.has(c.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                >
                  {saved.has(c.id) ? '✅ Saved' : '🔖 Save'}
                </button>
              </div>

              {c.location && (
                <p className="text-xs text-gray-500 mb-2">📍 {c.location}</p>
              )}

              {c.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.skills.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{typeof s === 'string' ? s : s.name}</span>
                  ))}
                  {c.skills.length > 4 && <span className="text-xs text-gray-400">+{c.skills.length - 4}</span>}
                </div>
              )}

              {c.experience_years !== undefined && (
                <p className="text-xs text-gray-500">{c.experience_years} years experience</p>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 italic">
                Contact info hidden for privacy
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

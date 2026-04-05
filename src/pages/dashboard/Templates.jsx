import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

const TEMPLATE_COLORS = ['#1A73E8', '#0097A7', '#2E7D32', '#7B1FA2', '#E65100', '#0D1B2A']

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/templates/')
      .then((r) => setTemplates(r.data?.results ?? r.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading templates..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Resume Templates</h1>
        <p className="text-gray-500 mt-1">Choose a professional template for your resume.</p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates available</h3>
          <p className="text-gray-500 text-sm">Run the seed_templates management command on the backend.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Preview */}
              <div
                className="h-48 flex items-center justify-center relative"
                style={{ backgroundColor: TEMPLATE_COLORS[i % TEMPLATE_COLORS.length] + '15' }}
              >
                <div className="w-28 h-36 bg-white rounded-lg shadow-md p-3 group-hover:scale-105 transition-transform">
                  <div className="w-full h-2 rounded mb-2" style={{ backgroundColor: TEMPLATE_COLORS[i % TEMPLATE_COLORS.length] }} />
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className={`h-1.5 rounded mb-1.5 bg-gray-200`} style={{ width: `${60 + Math.random() * 40}%` }} />
                  ))}
                </div>
                {t.is_premium && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">PRO</span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{t.name}</h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{t.description || 'Professional resume template'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/resume?template=${t.id}`)}
                    className="flex-1 bg-[#1A73E8] hover:bg-blue-600 text-white text-sm py-2 rounded-lg transition-colors font-medium"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/resume?template=${t.id}&preview=1`)}
                    className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm rounded-lg transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'

const CATEGORIES = [
  { key: 'all', label: 'All Templates' },
  { key: 'tech', label: 'Tech & Engineering' },
  { key: 'corporate', label: 'Corporate & Business' },
  { key: 'creative', label: 'Creative & Marketing' },
  { key: 'academic', label: 'Academic & Legal' },
  { key: 'entry', label: 'Student & Entry Level' },
  { key: 'trade', label: 'Blue Collar & Trade' },
]

// Map template names to categories for local filtering
const CATEGORY_MAP = {
  tech: ['TechTemplate', 'Technical', 'Electrical', 'Mechanical', 'Scientific'],
  corporate: ['Professional', 'Corporate', 'Consultant', 'Sterling', 'Windsor', 'Oxford'],
  creative: ['Creative', 'Vibrant', 'ModernTemplate', 'Portfolio', 'Typographic'],
  academic: ['Classic', 'Legal', 'Writer', 'Monochrome', 'Elegant'],
  entry: ['Graduate', 'Internship', 'Minimalist', 'Impact', 'Chronological'],
  trade: ['Construction', 'Industrial', 'Maintenance'],
}

// Local template data as fallback when backend templates aren't seeded
const LOCAL_TEMPLATES = [
  'Chronological', 'Classic', 'Construction', 'Consultant', 'Corporate',
  'Creative', 'Electrical', 'Elegant', 'Graduate', 'Impact',
  'Industrial', 'Internship', 'Legal', 'Maintenance', 'Mechanical',
  'Minimalist', 'ModernTemplate', 'Monochrome', 'Oxford', 'Portfolio',
  'Professional', 'Scientific', 'Sterling', 'TechTemplate', 'Technical',
  'Typographic', 'Vibrant', 'Windsor', 'Writer',
].map((name, i) => ({
  id: `local-${name}`,
  name: name.replace(/Template$/, ''),
  slug: name.toLowerCase(),
  preview_image: `/templates/${name}.png`,
  is_premium: ['Sterling', 'Windsor', 'Oxford', 'Portfolio', 'Consultant'].includes(name),
  description: `${name.replace(/Template$/, '')} resume template`,
  _raw_name: name,
}))

function getCategory(template) {
  const name = template._raw_name || template.name || ''
  for (const [cat, names] of Object.entries(CATEGORY_MAP)) {
    if (names.some(n => name.includes(n))) return cat
  }
  return 'corporate'
}

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/templates/')
      .then((r) => {
        const data = r.data?.results ?? r.data ?? []
        if (data.length > 0) {
          // Enrich backend templates with preview images
          setTemplates(data.map(t => ({
            ...t,
            _raw_name: t.slug || t.name,
            preview_image: t.preview_image || `/templates/${t.name}.png`,
          })))
        } else {
          // Use local templates as fallback
          setTemplates(LOCAL_TEMPLATES)
        }
      })
      .catch(() => setTemplates(LOCAL_TEMPLATES))
      .finally(() => setLoading(false))
  }, [])

  const filtered = templates.filter((t) => {
    const matchCategory = activeCategory === 'all' || getCategory(t) === activeCategory
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading templates..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Resume Templates</h1>
        <p className="text-gray-500 mt-1">Choose from 29+ ATS-friendly templates for every industry and career level.</p>
      </div>

      {/* Search + Category filter */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-[#1A73E8] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">{filtered.length} template{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates match your filter</h3>
          <p className="text-gray-500 text-sm">Try a different category or clear your search.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
            className="mt-4 text-[#1A73E8] text-sm hover:underline font-medium"
          >
            Show all templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
              {/* Preview image */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                <img
                  src={t.preview_image}
                  alt={t.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 items-center justify-center bg-gray-100 hidden">
                  <div className="w-24 h-32 bg-white rounded-lg shadow-md p-3">
                    <div className="w-full h-2 rounded mb-2 bg-[#1A73E8]" />
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-1.5 rounded mb-1.5 bg-gray-200" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                </div>
                {t.is_premium && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    PRO
                  </span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => navigate(`/dashboard/resume?template=${t.slug || t.id}`)}
                    className="bg-white text-[#1A73E8] font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all transform scale-90 group-hover:scale-100"
                  >
                    Use Template
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm">{t.name.replace(/Template$/, '')}</h3>
                <p className="text-gray-400 text-xs mt-0.5 capitalize">{getCategory(t).replace('_', ' ')} template</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

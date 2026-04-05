import React from 'react'
import { Link } from 'react-router-dom'

export default function ResumeCard({ resume, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault()
    if (confirm('Delete this resume?')) onDelete(resume.id)
  }

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{resume.title || 'Untitled Resume'}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {resume.target_role || 'No target role set'}
          </p>
        </div>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[resume.status] || statusColors.draft}`}>
          {resume.status || 'draft'}
        </span>
      </div>

      {resume.ats_score && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>ATS Score</span>
            <span className="font-medium text-[#1A73E8]">{resume.ats_score}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#1A73E8] h-1.5 rounded-full transition-all"
              style={{ width: `${resume.ats_score}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-4">
        Updated {new Date(resume.updated_at).toLocaleDateString('en-AE')}
      </p>

      <div className="flex gap-2">
        <Link
          to={`/dashboard/resume/${resume.id}`}
          className="flex-1 bg-[#1A73E8] hover:bg-blue-600 text-white text-sm py-2 rounded-lg text-center transition-colors font-medium"
        >
          Edit
        </Link>
        <a
          href={`/api/resumes/${resume.id}/pdf/`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm py-2 rounded-lg text-center transition-colors"
        >
          PDF
        </a>
        <button
          onClick={handleDelete}
          className="px-3 py-2 border border-red-100 hover:bg-red-50 text-red-600 text-sm rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

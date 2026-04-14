import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/DashboardLayout'
import ResumeCard from '../../components/resume/ResumeCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getResumes, deleteResume } from '../../services/resumes'
import { parseCV } from '../../services/ai'
import useResumeStore from '../../store/resumeStore'

export default function MyResumes() {
  const { resumes, setResumes } = useResumeStore()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [sortBy, setSortBy] = useState('updated')
  const [isDragOver, setIsDragOver] = useState(false)
  const navigate = useNavigate()
  const fileRef = useRef(null)

  useEffect(() => {
    getResumes()
      .then((r) => setResumes(r.data?.results ?? r.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteResume(id)
      setResumes(resumes.filter((r) => r.id !== id))
      setMsg('Resume deleted')
      setTimeout(() => setMsg(''), 3000)
    } catch { /* ignore */ }
  }

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setMsg('')
    const fd = new FormData()
    fd.append('cv_file', file)
    try {
      const res = await parseCV(fd)
      const newResume = res.data?.resume
      if (newResume?.id) {
        navigate(`/dashboard/resume/${newResume.id}`)
      } else {
        setMsg('CV parsed successfully')
        // Refresh list
        const fresh = await getResumes()
        setResumes(fresh.data?.results ?? fresh.data ?? [])
      }
    } catch {
      setMsg('CV upload failed. Please try again.')
    } finally {
      setUploading(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const sorted = [...resumes].sort((a, b) => {
    if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at)
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
    if (sortBy === 'ats') return (b.ats_score || 0) - (a.ats_score || 0)
    return 0
  })

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading resumes..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A]">My Resumes</h1>
          <p className="text-gray-500 mt-1 text-sm">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <label className={`cursor-pointer border border-teal-200 text-teal-700 hover:bg-teal-50 text-sm px-4 py-2.5 rounded-lg transition-colors font-medium ${uploading ? 'opacity-60' : ''}`}>
            {uploading ? 'Parsing...' : 'Upload CV'}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          <Link
            to="/dashboard/resume"
            className="bg-[#1A73E8] hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Resume
          </Link>
        </div>
      </div>

      {msg && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">{msg}</div>
      )}

      {resumes.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            isDragOver ? 'border-[#1A73E8] bg-blue-50' : 'border-gray-300 bg-white'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
        >
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Create a new resume from scratch, or upload your existing CV and let AI parse it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard/resume" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Build From Scratch
            </Link>
            <button
              onClick={() => fileRef.current?.click()}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Upload Existing CV
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Drag & drop a PDF or DOCX file here</p>
        </div>
      ) : (
        <>
          {/* Sort bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            {[
              { key: 'updated', label: 'Last Updated' },
              { key: 'title', label: 'Title' },
              { key: 'ats', label: 'ATS Score' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  sortBy === s.key ? 'bg-[#1A73E8] text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((r) => (
              <ResumeCard key={r.id} resume={r} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

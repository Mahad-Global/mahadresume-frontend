import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getDocuments, uploadDocument, deleteDocument } from '../../services/documents'

const CATEGORIES = [
  { value: 'passport', label: 'Passport', icon: '🛂' },
  { value: 'national_id', label: 'National ID', icon: '🪪' },
  { value: 'driving_license', label: 'Driving License', icon: '🚗' },
  { value: 'professional_license', label: 'Professional License', icon: '📜' },
  { value: 'certificate', label: 'Certificate', icon: '🎓' },
  { value: 'other', label: 'Other', icon: '📎' },
]

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [category, setCategory] = useState('other')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    getDocuments()
      .then((r) => setDocuments(r.data?.results ?? r.data ?? []))
      .catch(() => setError('Could not load documents. Backend may not support this endpoint yet.'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setMsg('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    fd.append('title', file.name)
    try {
      const res = await uploadDocument(fd)
      setDocuments((prev) => [res.data, ...prev])
      setMsg('Document uploaded successfully')
      setShowUpload(false)
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return
    try {
      await deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      setMsg('Document deleted')
      setTimeout(() => setMsg(''), 3000)
    } catch { /* ignore */ }
  }

  const getCategoryInfo = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[5]

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading documents..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A]">Documents</h1>
            <p className="text-gray-500 mt-1 text-sm">Upload and manage your personal documents securely.</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-[#1A73E8] hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>

        {(msg || error) && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            error ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : msg.includes('success') || msg.includes('deleted') ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {error || msg}
          </div>
        )}

        {/* Upload panel */}
        {showUpload && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-[#0D1B2A] mb-4">Upload New Document</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#1A73E8] hover:bg-blue-50/30 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-gray-500">
                {uploading ? 'Uploading...' : 'Click to select a file (PDF, JPG, PNG)'}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
                disabled={uploading}
              />
            </div>
          </div>
        )}

        {/* Documents list */}
        {documents.length === 0 && !error ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded</h3>
            <p className="text-gray-500 text-sm mb-4">Upload your passport, ID, licenses, or certificates for easy access.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const catInfo = getCategoryInfo(doc.category)
              return (
                <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {catInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-sm">{doc.title || doc.file_name || 'Untitled'}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{catInfo.label}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded {new Date(doc.created_at || doc.uploaded_at).toLocaleDateString('en-AE')}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {doc.file && (
                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1A73E8] hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

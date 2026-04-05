import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
  getCampaigns, createCampaign, updateCampaign, deleteCampaign,
  getQuestions, createQuestion, deleteQuestion,
} from '../../services/campaigns'

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loadingQs, setLoadingQs] = useState(false)
  const [msg, setMsg] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: regQ, handleSubmit: handleQ, reset: resetQ } = useForm()

  useEffect(() => {
    getCampaigns()
      .then((r) => setCampaigns(r.data?.results ?? r.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const onCreateCampaign = async (data) => {
    try {
      const res = await createCampaign(data)
      setCampaigns((prev) => [res.data, ...prev])
      setShowCreate(false)
      reset()
      setMsg('✅ Campaign created!')
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Create failed'))
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const handleToggleActive = async (campaign) => {
    try {
      const res = await updateCampaign(campaign.id, { is_active: !campaign.is_active })
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? res.data : c))
    } catch { /* ignore */ }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign?')) return
    try {
      await deleteCampaign(id)
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    } catch { /* ignore */ }
  }

  const openQuestions = async (campaign) => {
    setSelectedCampaign(campaign)
    setLoadingQs(true)
    try {
      const res = await getQuestions(campaign.id)
      setQuestions(res.data?.results ?? res.data ?? [])
    } catch { /* ignore */ }
    finally { setLoadingQs(false) }
  }

  const onAddQuestion = async (data) => {
    try {
      const res = await createQuestion(selectedCampaign.id, {
        ...data,
        is_knockout: data.is_knockout === 'true' || data.is_knockout === true,
        is_required: true,
        order: questions.length,
      })
      setQuestions((prev) => [...prev, res.data])
      resetQ()
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Failed to add question'))
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const handleDeleteQuestion = async (qId) => {
    try {
      await deleteQuestion(selectedCampaign.id, qId)
      setQuestions((prev) => prev.filter((q) => q.id !== qId))
    } catch { /* ignore */ }
  }

  const copyInviteLink = (code) => {
    const url = `${window.location.origin}/apply/${code}`
    navigator.clipboard.writeText(url)
    setMsg('✅ Invite link copied!')
    setTimeout(() => setMsg(''), 2000)
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading campaigns..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A]">Hiring Campaigns</h1>
          <p className="text-gray-500 mt-1">Create invite-link based hiring campaigns.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#1A73E8] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          + New Campaign
        </button>
      </div>

      {msg && (
        <div className={`mb-5 px-4 py-3 rounded-lg text-sm border ${msg.startsWith('✅') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-white border border-[#1A73E8] rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-[#0D1B2A] mb-4">New Campaign</h2>
          <form onSubmit={handleSubmit(onCreateCampaign)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  {...register('title', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  placeholder="e.g. Senior Driver — Dubai 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                <select {...register('plan_type')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1A73E8]">
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" {...register('start_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" {...register('end_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Candidates</label>
                <input type="number" {...register('max_candidates')} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]" placeholder="Leave blank for unlimited" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none" placeholder="Describe the role and requirements..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1A73E8] hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Create Campaign</button>
              <button type="button" onClick={() => { setShowCreate(false); reset() }} className="border border-gray-300 px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns list */}
      {campaigns.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 text-sm">Create a campaign to start hiring.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900">{c.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{c.plan_type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>👥 {c.application_count || 0} applications</span>
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{c.invite_code}</code>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => copyInviteLink(c.invite_code)}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    📋 Copy Link
                  </button>
                  <button
                    onClick={() => openQuestions(c)}
                    className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ❓ Questions
                  </button>
                  <Link
                    to={`/employer/campaigns/${c.id}/applications`}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    👥 Applications
                  </Link>
                  <button
                    onClick={() => handleToggleActive(c)}
                    className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {c.is_active ? '⏸ Pause' : '▶ Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#0D1B2A]">Screening Questions — {selectedCampaign.title}</h2>
              <button onClick={() => setSelectedCampaign(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loadingQs ? (
                <LoadingSpinner text="Loading questions..." />
              ) : questions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No questions yet. Add one below.</p>
              ) : questions.map((q) => (
                <div key={q.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{q.question_text}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-gray-400 capitalize">{q.question_type.replace('_', ' ')}</span>
                      {q.is_knockout && <span className="text-xs text-red-600 font-medium">⚡ Knockout</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-400 hover:text-red-600 text-sm">×</button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleQ(onAddQuestion)} className="space-y-3">
                <textarea
                  {...regQ('question_text', { required: true })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                  placeholder="Question text *"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select {...regQ('question_type')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none">
                    <option value="text">Text</option>
                    <option value="yes_no">Yes / No</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="number">Number</option>
                    <option value="knockout">Knockout</option>
                  </select>
                  <select {...regQ('is_knockout')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none">
                    <option value="false">Not knockout</option>
                    <option value="true">⚡ Knockout</option>
                  </select>
                </div>
                <input
                  {...regQ('knockout_answer')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  placeholder="Correct answer (for knockout questions)"
                />
                <button type="submit" className="w-full bg-[#1A73E8] hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  + Add Question
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

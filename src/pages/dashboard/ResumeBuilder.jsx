import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import ResumeSection from '../../components/resume/ResumeSection'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
  getResume, createResume, updateResume,
  addWorkExperience, updateWorkExperience, deleteWorkExperience,
  addEducation, updateEducation, deleteEducation,
  addSkill, deleteSkill,
} from '../../services/resumes'
import { enhanceResume, parseCV, rewriteSection } from '../../services/ai'
import api from '../../services/api'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent outline-none'

export default function ResumeBuilder() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const templateParam = searchParams.get('template')
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)
  const [msg, setMsg] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(templateParam || '')
  const [templates, setTemplates] = useState([])
  const [showTemplatePanel, setShowTemplatePanel] = useState(false)

  const { register, handleSubmit, reset } = useForm()

  // Load resume if editing
  useEffect(() => {
    if (id) {
      getResume(id)
        .then((res) => {
          setResume(res.data)
          setSelectedTemplate(res.data.template || '')
          reset({
            title: res.data.title,
            target_role: res.data.target_role,
            summary: res.data.summary,
            phone: res.data.phone,
            location: res.data.location,
            linkedin_url: res.data.linkedin_url,
          })
        })
        .catch(() => navigate('/dashboard'))
        .finally(() => setLoading(false))
    }
  }, [id])

  // Load available templates
  useEffect(() => {
    api.get('/templates/')
      .then((r) => setTemplates(r.data?.results ?? r.data ?? []))
      .catch(() => {})
  }, [])

  const flashMsg = (text, duration = 3000) => {
    setMsg(text)
    setTimeout(() => setMsg(''), duration)
  }

  const onSaveBasic = async (data) => {
    setSaving(true)
    setMsg('')
    try {
      const payload = { ...data }
      if (selectedTemplate) payload.template = selectedTemplate
      if (id) {
        const res = await updateResume(id, payload)
        setResume(res.data)
        flashMsg('Saved successfully')
      } else {
        const res = await createResume(payload)
        navigate(`/dashboard/resume/${res.data.id}`, { replace: true })
      }
    } catch {
      flashMsg('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleEnhance = async () => {
    if (!id) return
    setEnhancing(true)
    try {
      await enhanceResume(id)
      flashMsg('Enhancement started -- check back in a moment', 4000)
    } catch {
      flashMsg('Enhancement failed')
    } finally {
      setEnhancing(false)
    }
  }

  const handleRewriteSection = async (section, content) => {
    if (!id) return
    try {
      const res = await rewriteSection({ resume_id: id, section, content })
      return res.data?.rewritten || res.data?.result || content
    } catch {
      flashMsg('AI rewrite failed')
      return content
    }
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCV(true)
    const fd = new FormData()
    fd.append('cv_file', file)
    try {
      const res = await parseCV(fd)
      const newResume = res.data?.resume
      if (newResume?.id) navigate(`/dashboard/resume/${newResume.id}`)
      else flashMsg('CV parsed -- resume created', 4000)
    } catch {
      flashMsg('CV upload failed')
    } finally {
      setUploadingCV(false)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !id) return
    try {
      const res = await addSkill(id, { name: newSkill.trim(), skill_type: 'technical' })
      setResume((r) => ({ ...r, skills: [...(r.skills || []), res.data] }))
      setNewSkill('')
    } catch { /* ignore */ }
  }

  const handleDeleteSkill = async (skillId) => {
    if (!id) return
    try {
      await deleteSkill(id, skillId)
      setResume((r) => ({ ...r, skills: r.skills.filter((s) => s.id !== skillId) }))
    } catch { /* ignore */ }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading resume..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A]">{id ? 'Edit Resume' : 'New Resume'}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Build a job-winning, ATS-optimized resume</p>
          </div>
          <div className="flex gap-2">
            {!id && (
              <label className="cursor-pointer bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-sm px-4 py-2 rounded-lg transition-colors font-medium">
                {uploadingCV ? 'Parsing...' : 'Upload CV'}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCVUpload} disabled={uploadingCV} />
              </label>
            )}
            {id && (
              <button
                onClick={handleEnhance}
                disabled={enhancing}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-sm px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-60"
              >
                {enhancing ? 'Enhancing...' : 'AI Enhance'}
              </button>
            )}
            {id && (
              <a
                href={`/api/v1/resumes/${id}/pdf/`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Export PDF
              </a>
            )}
          </div>
        </div>

        {msg && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">{msg}</div>
        )}

        <div className="space-y-4">
          {/* Template selector */}
          <ResumeSection title="Template" icon="🎨" defaultOpen={!id && !!templateParam}>
            <div className="pt-4">
              <button
                onClick={() => setShowTemplatePanel(!showTemplatePanel)}
                className="text-sm text-[#1A73E8] hover:underline font-medium mb-3"
              >
                {showTemplatePanel ? 'Hide templates' : 'Change template'}
              </button>
              {selectedTemplate && !showTemplatePanel && (
                <p className="text-sm text-gray-500">
                  Current: <span className="font-medium text-gray-700">{selectedTemplate}</span>
                </p>
              )}
              {showTemplatePanel && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTemplate(t.slug || t.name); setShowTemplatePanel(false) }}
                      className={`border rounded-xl overflow-hidden transition-all hover:shadow-md ${
                        selectedTemplate === (t.slug || t.name) ? 'ring-2 ring-[#1A73E8] border-[#1A73E8]' : 'border-gray-200'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-gray-50">
                        <img
                          src={t.preview_image || `/templates/${t.name}.png`}
                          alt={t.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <p className="text-xs font-medium text-center py-1.5 truncate px-1">{t.name}</p>
                    </button>
                  ))}
                  {templates.length === 0 && (
                    <p className="col-span-full text-sm text-gray-400 text-center py-4">
                      No templates loaded from backend. Visit Templates page to browse.
                    </p>
                  )}
                </div>
              )}
            </div>
          </ResumeSection>

          {/* Basic Info */}
          <ResumeSection title="Basic Information" icon="👤" defaultOpen>
            <form onSubmit={handleSubmit(onSaveBasic)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Title *</label>
                  <input {...register('title', { required: true })} className={inputClass} placeholder="e.g. Senior Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                  <input {...register('target_role')} className={inputClass} placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input {...register('phone')} className={inputClass} placeholder="+971 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input {...register('location')} className={inputClass} placeholder="Dubai, UAE" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input {...register('linkedin_url')} className={inputClass} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Professional Summary</span>
                    {id && (
                      <button
                        type="button"
                        onClick={async () => {
                          const textarea = document.querySelector('textarea[name="summary"]')
                          if (!textarea?.value) return
                          const rewritten = await handleRewriteSection('summary', textarea.value)
                          if (rewritten !== textarea.value) {
                            textarea.value = rewritten
                            flashMsg('Summary rewritten by AI')
                          }
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        AI Rewrite
                      </button>
                    )}
                  </label>
                  <textarea
                    {...register('summary')}
                    name="summary"
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="A brief summary of your professional background and key achievements..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : id ? 'Save Changes' : 'Create Resume'}
              </button>
            </form>
          </ResumeSection>

          {/* Work Experience */}
          {id && (
            <ResumeSection title="Work Experience" icon="💼">
              <div className="pt-4 space-y-4">
                {(resume?.work_experiences || []).map((exp) => (
                  <WorkExpCard
                    key={exp.id}
                    exp={exp}
                    resumeId={id}
                    onRewrite={handleRewriteSection}
                    onUpdate={(updated) => setResume((r) => ({
                      ...r,
                      work_experiences: r.work_experiences.map((e) => e.id === updated.id ? updated : e)
                    }))}
                    onDelete={(expId) => setResume((r) => ({
                      ...r,
                      work_experiences: r.work_experiences.filter((e) => e.id !== expId)
                    }))}
                  />
                ))}
                <AddWorkExpForm
                  resumeId={id}
                  onAdd={(exp) => setResume((r) => ({ ...r, work_experiences: [...(r.work_experiences || []), exp] }))}
                />
              </div>
            </ResumeSection>
          )}

          {/* Education */}
          {id && (
            <ResumeSection title="Education" icon="🎓">
              <div className="pt-4 space-y-4">
                {(resume?.education || []).map((edu) => (
                  <EduCard
                    key={edu.id}
                    edu={edu}
                    resumeId={id}
                    onDelete={(eduId) => setResume((r) => ({ ...r, education: r.education.filter((e) => e.id !== eduId) }))}
                  />
                ))}
                <AddEduForm
                  resumeId={id}
                  onAdd={(edu) => setResume((r) => ({ ...r, education: [...(r.education || []), edu] }))}
                />
              </div>
            </ResumeSection>
          )}

          {/* Skills */}
          {id && (
            <ResumeSection title="Skills" icon="⚡">
              <div className="pt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(resume?.skills || []).map((s) => (
                    <span key={s.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
                      {s.name}
                      <button onClick={() => handleDeleteSkill(s.id)} className="ml-1 text-blue-400 hover:text-red-500 text-xs">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className={`flex-1 ${inputClass}`}
                    placeholder="Add a skill (e.g. Python, Project Management)"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-[#1A73E8] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </ResumeSection>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function WorkExpCard({ exp, resumeId, onUpdate, onDelete, onRewrite }) {
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit, setValue, getValues } = useForm({ defaultValues: exp })

  const onSave = async (data) => {
    try {
      const res = await updateWorkExperience(resumeId, exp.id, data)
      onUpdate(res.data)
      setEditing(false)
    } catch { /* ignore */ }
  }

  const handleAIRewrite = async () => {
    const desc = getValues('description')
    if (!desc) return
    const rewritten = await onRewrite('work_experience', desc)
    if (rewritten !== desc) setValue('description', rewritten)
  }

  if (!editing) return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">{exp.job_title} at {exp.company_name}</p>
          <p className="text-sm text-gray-500">{exp.start_date} -- {exp.end_date || 'Present'} {exp.location && `| ${exp.location}`}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="text-[#1A73E8] text-xs hover:underline">Edit</button>
          <button onClick={async () => { await deleteWorkExperience(resumeId, exp.id); onDelete(exp.id) }} className="text-red-500 text-xs hover:underline">Delete</button>
        </div>
      </div>
      {exp.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exp.description}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSave)} className="border border-[#1A73E8] rounded-lg p-4 space-y-3 bg-blue-50">
      <div className="grid grid-cols-2 gap-3">
        <input {...register('job_title')} placeholder="Job Title" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('company_name')} placeholder="Company" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('start_date')} placeholder="Start (YYYY-MM)" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('end_date')} placeholder="End (or blank)" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Description</span>
          <button type="button" onClick={handleAIRewrite} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
            AI Rewrite
          </button>
        </div>
        <textarea {...register('description')} rows={3} placeholder="Key achievements and responsibilities..." className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8] resize-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-[#1A73E8] text-white px-3 py-1.5 rounded text-sm">Save</button>
        <button type="button" onClick={() => setEditing(false)} className="border border-gray-300 px-3 py-1.5 rounded text-sm">Cancel</button>
      </div>
    </form>
  )
}

function AddWorkExpForm({ resumeId, onAdd }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSave = async (data) => {
    try {
      const res = await addWorkExperience(resumeId, data)
      onAdd(res.data)
      reset()
      setOpen(false)
    } catch { /* ignore */ }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full border border-dashed border-[#1A73E8] text-[#1A73E8] rounded-lg py-2.5 text-sm hover:bg-blue-50 transition-colors">
      + Add Work Experience
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSave)} className="border border-[#1A73E8] rounded-lg p-4 space-y-3 bg-blue-50">
      <div className="grid grid-cols-2 gap-3">
        <input {...register('job_title', { required: true })} placeholder="Job Title *" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('company_name', { required: true })} placeholder="Company *" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('start_date')} placeholder="Start (YYYY-MM)" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('end_date')} placeholder="End (blank = Present)" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
        <input {...register('location')} placeholder="Location" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8]" />
      </div>
      <textarea {...register('description')} rows={3} placeholder="Key achievements and responsibilities..." className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1A73E8] resize-none" />
      <div className="flex gap-2">
        <button type="submit" className="bg-[#1A73E8] text-white px-3 py-1.5 rounded text-sm">Add</button>
        <button type="button" onClick={() => setOpen(false)} className="border border-gray-300 px-3 py-1.5 rounded text-sm">Cancel</button>
      </div>
    </form>
  )
}

function EduCard({ edu, resumeId, onDelete }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        <p className="font-medium text-gray-800">{edu.degree} in {edu.field_of_study}</p>
        <p className="text-sm text-gray-500">{edu.institution} | {edu.graduation_year}</p>
      </div>
      <button onClick={async () => { await deleteEducation(resumeId, edu.id); onDelete(edu.id) }} className="text-red-500 text-xs hover:underline">Delete</button>
    </div>
  )
}

function AddEduForm({ resumeId, onAdd }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSave = async (data) => {
    try {
      const res = await addEducation(resumeId, data)
      onAdd(res.data)
      reset()
      setOpen(false)
    } catch { /* ignore */ }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full border border-dashed border-[#1A73E8] text-[#1A73E8] rounded-lg py-2.5 text-sm hover:bg-blue-50 transition-colors">
      + Add Education
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSave)} className="border border-[#1A73E8] rounded-lg p-4 space-y-3 bg-blue-50">
      <div className="grid grid-cols-2 gap-3">
        <input {...register('degree', { required: true })} placeholder="Degree (e.g. Bachelor's) *" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" />
        <input {...register('field_of_study')} placeholder="Field of Study" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" />
        <input {...register('institution', { required: true })} placeholder="Institution *" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" />
        <input {...register('graduation_year')} placeholder="Graduation Year" className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-[#1A73E8] text-white px-3 py-1.5 rounded text-sm">Add</button>
        <button type="button" onClick={() => setOpen(false)} className="border border-gray-300 px-3 py-1.5 rounded text-sm">Cancel</button>
      </div>
    </form>
  )
}

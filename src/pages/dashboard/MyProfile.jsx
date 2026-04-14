import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/common/DashboardLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getProfile, updateProfile } from '../../services/profile'
import useAuthStore from '../../store/authStore'

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-[#0D1B2A] text-sm">
          <span className="text-lg">{icon}</span> {title}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  )
}

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent outline-none'

export default function MyProfile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    getProfile()
      .then((r) => {
        setProfile(r.data)
        reset({
          first_name: r.data.first_name || '',
          last_name: r.data.last_name || '',
          phone: r.data.phone || '',
          location: r.data.location || '',
          nationality: r.data.nationality || '',
          date_of_birth: r.data.date_of_birth || '',
          visa_status: r.data.visa_status || '',
          linkedin_url: r.data.linkedin_url || '',
          website_url: r.data.website_url || '',
          bio: r.data.bio || '',
        })
      })
      .catch(() => setMsg('Could not load profile. Backend may not support this endpoint yet.'))
      .finally(() => setLoading(false))
  }, [])

  const onSave = async (data) => {
    setSaving(true)
    setMsg('')
    try {
      const res = await updateProfile(data)
      setProfile(res.data)
      setMsg('Profile updated successfully')
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">My Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your personal information and preferences.</p>
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            msg.includes('success') ? 'bg-green-50 border border-green-200 text-green-800'
              : msg.includes('not support') ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {msg}
          </div>
        )}

        <div className="space-y-4">
          {/* Account info (read-only) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1A73E8] to-[#0097A7] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {(user?.email?.[0] || '?').toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0D1B2A]">{user?.email}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role || 'Job Seeker'}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <Section title="Personal Information" icon="👤" defaultOpen>
            <form onSubmit={handleSubmit(onSave)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input {...register('first_name')} className={inputClass} placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input {...register('last_name')} className={inputClass} placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input {...register('phone')} className={inputClass} placeholder="+971 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input {...register('location')} className={inputClass} placeholder="Dubai, UAE" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input {...register('nationality')} className={inputClass} placeholder="Indian" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input {...register('date_of_birth')} type="date" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status</label>
                  <select {...register('visa_status')} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="visit">Visit Visa</option>
                    <option value="employment">Employment Visa</option>
                    <option value="freelance">Freelance</option>
                    <option value="golden">Golden Visa</option>
                    <option value="citizen">Citizen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea {...register('bio')} rows={3} className={`${inputClass} resize-none`} placeholder="A short professional bio..." />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </Section>

          {/* Social Links */}
          <Section title="Social Links" icon="🔗">
            <form onSubmit={handleSubmit(onSave)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input {...register('linkedin_url')} className={inputClass} placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website / Portfolio</label>
                  <input {...register('website_url')} className={inputClass} placeholder="https://yoursite.com" />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#1A73E8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </Section>

          {/* Work Experience (profile-level) */}
          <Section title="Work Experience" icon="💼">
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-3">
                Profile-level work history. Resume-specific experience is managed in the Resume Builder.
              </p>
              {profile?.work_experiences?.length > 0 ? (
                <div className="space-y-3">
                  {profile.work_experiences.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-800">{exp.job_title} at {exp.company_name}</p>
                      <p className="text-sm text-gray-500">{exp.start_date} - {exp.end_date || 'Present'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No work experience added to profile yet.</p>
              )}
              {/* TODO: Add/edit/delete work experience when backend supports profile-level endpoints */}
            </div>
          </Section>

          {/* Education (profile-level) */}
          <Section title="Education" icon="🎓">
            <div className="pt-4">
              {profile?.education?.length > 0 ? (
                <div className="space-y-3">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-800">{edu.degree} in {edu.field_of_study}</p>
                      <p className="text-sm text-gray-500">{edu.institution} - {edu.graduation_year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No education added to profile yet.</p>
              )}
            </div>
          </Section>

          {/* Languages */}
          <Section title="Languages" icon="🌐">
            <div className="pt-4">
              {profile?.languages?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span key={lang.id} className="bg-blue-50 text-[#1A73E8] border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium">
                      {lang.name} - {lang.proficiency}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No languages added yet.</p>
              )}
            </div>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  )
}

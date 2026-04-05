import api from './api'

export const getJobs = (params) => api.get('/jobs/', { params })
export const getJob = (id) => api.get(`/jobs/${id}/`)
export const matchJobs = (resumeId) => api.post('/jobs/match/', { resume_id: resumeId })
export const applyJob = (jobId, resumeId) =>
  api.post(`/jobs/${jobId}/apply/`, { resume_id: resumeId })

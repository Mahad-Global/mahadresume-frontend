import api from './api'

export const runATSCheck = (resumeId, jobDescription) =>
  api.post('/ats/check/', { resume_id: resumeId, job_description: jobDescription })
export const getATSResults = (resumeId) => api.get(`/ats/results/${resumeId}/`)

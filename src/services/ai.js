import api from './api'

export const rewriteSection = (data) => api.post('/ai/rewrite/', data)
export const enhanceResume = (resumeId) => api.post('/ai/enhance/', { resume_id: resumeId })
export const generateCoverLetter = (data) => api.post('/ai/cover-letter/', data)
export const parseCV = (formData) =>
  api.post('/ai/parse-cv/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getAIJob = (jobId) => api.get(`/ai/jobs/${jobId}/`)

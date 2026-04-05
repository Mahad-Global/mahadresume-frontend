import api from './api'

export const getResumes = () => api.get('/resumes/')
export const getResume = (id) => api.get(`/resumes/${id}/`)
export const createResume = (data) => api.post('/resumes/', data)
export const updateResume = (id, data) => api.patch(`/resumes/${id}/`, data)
export const deleteResume = (id) => api.delete(`/resumes/${id}/`)
export const exportPDF = (id) => api.get(`/resumes/${id}/pdf/`, { responseType: 'blob' })

export const addWorkExperience = (resumeId, data) =>
  api.post(`/resumes/${resumeId}/work-experience/`, data)
export const updateWorkExperience = (resumeId, id, data) =>
  api.patch(`/resumes/${resumeId}/work-experience/${id}/`, data)
export const deleteWorkExperience = (resumeId, id) =>
  api.delete(`/resumes/${resumeId}/work-experience/${id}/`)

export const addEducation = (resumeId, data) =>
  api.post(`/resumes/${resumeId}/education/`, data)
export const updateEducation = (resumeId, id, data) =>
  api.patch(`/resumes/${resumeId}/education/${id}/`, data)
export const deleteEducation = (resumeId, id) =>
  api.delete(`/resumes/${resumeId}/education/${id}/`)

export const addSkill = (resumeId, data) =>
  api.post(`/resumes/${resumeId}/skills/`, data)
export const deleteSkill = (resumeId, id) =>
  api.delete(`/resumes/${resumeId}/skills/${id}/`)

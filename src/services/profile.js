import api from './api'

export const getProfile = () => api.get('/accounts/profile/')
export const updateProfile = (data) => api.patch('/accounts/profile/', data)

export const updateAvatar = (formData) =>
  api.patch('/accounts/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Education
export const addEducation = (data) => api.post('/accounts/profile/education/', data)
export const updateEducation = (id, data) => api.patch(`/accounts/profile/education/${id}/`, data)
export const deleteEducation = (id) => api.delete(`/accounts/profile/education/${id}/`)

// Certifications
export const addCertification = (data) => api.post('/accounts/profile/certifications/', data)
export const updateCertification = (id, data) => api.patch(`/accounts/profile/certifications/${id}/`, data)
export const deleteCertification = (id) => api.delete(`/accounts/profile/certifications/${id}/`)

// Work experience
export const addWorkExperience = (data) => api.post('/accounts/profile/work-experience/', data)
export const updateWorkExperience = (id, data) => api.patch(`/accounts/profile/work-experience/${id}/`, data)
export const deleteWorkExperience = (id) => api.delete(`/accounts/profile/work-experience/${id}/`)

// Languages
export const addLanguage = (data) => api.post('/accounts/profile/languages/', data)
export const deleteLanguage = (id) => api.delete(`/accounts/profile/languages/${id}/`)

import api from './api'

export const getEmployerProfile = () => api.get('/employer/profile/')
export const updateEmployerProfile = (data) => api.patch('/employer/profile/', data)
export const searchCandidates = (params) => api.get('/employer/candidates/', { params })
export const getCandidate = (id) => api.get(`/employer/candidates/${id}/`)
export const saveCandidate = (id) => api.post(`/employer/candidates/${id}/save/`)

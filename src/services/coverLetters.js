import api from './api'

export const getSavedCoverLetters = () => api.get('/ai/cover-letters/')
export const saveCoverLetter = (data) => api.post('/ai/cover-letters/', data)
export const updateCoverLetter = (id, data) => api.patch(`/ai/cover-letters/${id}/`, data)
export const deleteCoverLetter = (id) => api.delete(`/ai/cover-letters/${id}/`)

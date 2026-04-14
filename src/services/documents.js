import api from './api'

export const getDocuments = () => api.get('/accounts/documents/')

export const uploadDocument = (formData) =>
  api.post('/accounts/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteDocument = (id) => api.delete(`/accounts/documents/${id}/`)

export const viewDocument = (id) =>
  api.get(`/accounts/documents/${id}/`, { responseType: 'blob' })

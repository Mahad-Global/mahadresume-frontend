import api from './api'

export const getCampaigns = () => api.get('/campaigns/')
export const getCampaign = (id) => api.get(`/campaigns/${id}/`)
export const createCampaign = (data) => api.post('/campaigns/', data)
export const updateCampaign = (id, data) => api.patch(`/campaigns/${id}/`, data)
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}/`)

export const getQuestions = (campaignId) => api.get(`/campaigns/${campaignId}/questions/`)
export const createQuestion = (campaignId, data) => api.post(`/campaigns/${campaignId}/questions/`, data)
export const deleteQuestion = (campaignId, questionId) =>
  api.delete(`/campaigns/${campaignId}/questions/${questionId}/`)

export const getApplications = (campaignId, params) =>
  api.get(`/campaigns/${campaignId}/applications/`, { params })
export const updateApplicationStatus = (campaignId, applicationId, status) =>
  api.patch(`/campaigns/${campaignId}/applications/${applicationId}/status/`, { status })
export const compareApplications = (campaignId, ids) =>
  api.get(`/campaigns/${campaignId}/compare/`, { params: { ids: ids.join(',') } })

export const getPublicCampaign = (inviteCode) => api.get(`/apply/${inviteCode}/`)
export const applyToCampaign = (inviteCode, data) => api.post(`/apply/${inviteCode}/apply/`, data)

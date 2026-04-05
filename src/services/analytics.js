import api from './api'

export const getDashboard = () => api.get('/analytics/dashboard/')
export const logEvent = (eventType, metadata) =>
  api.post('/analytics/events/', { event_type: eventType, metadata })

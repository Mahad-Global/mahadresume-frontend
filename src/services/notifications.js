import api from './api'

export const getNotifications = () => api.get('/notifications/')
export const markRead = (id) => api.post(`/notifications/${id}/read/`)
export const markAllRead = () => api.post('/notifications/mark-all-read/')
export const getUnreadCount = () => api.get('/notifications/unread-count/')

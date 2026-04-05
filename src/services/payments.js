import api from './api'

export const getPlans = () => api.get('/payments/plans/')
export const getSubscription = () => api.get('/payments/subscription/')
export const subscribe = (planSlug) => api.post('/payments/subscribe/', { plan_slug: planSlug })
export const cancelSubscription = () => api.post('/payments/cancel/')

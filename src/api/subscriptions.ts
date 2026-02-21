import apiClient from './client';

export const subscriptionApi = {
  getMy: () => apiClient.get('/subscriptions/my'),
  buy: (plan: string) => apiClient.post('/subscriptions/buy', { plan }),
};

export const subscriptionServiceApi = {
  create: (data: { appliance_id: string; issue_desc: string; preferred_slot: string; latitude?: number; longitude?: number; address_details?: any }) =>
    apiClient.post('/subscription-services/create', data),
};

import apiClient from './client';

export const subscriptionApi = {
  getMy: () => apiClient.get('/subscriptions/my'),
  buy: (plan: string) => apiClient.post('/subscriptions/buy', { plan }),
};

export const subscriptionServiceApi = {
  create: (data: any) =>
    apiClient.post('/subscription-services/create', data),
};

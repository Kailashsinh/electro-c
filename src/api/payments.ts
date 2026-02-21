import apiClient from './client';

export const paymentApi = {
  payVisitFee: (data: any) => apiClient.post('/payments/visit-fee', data),
};

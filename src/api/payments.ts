import apiClient from './client';

export const paymentApi = {
  payVisitFee: (data: {
    appliance_id: string;
    issue_desc: string;
    preferred_slot: string;
    method?: string;
    latitude?: number;
    longitude?: number;
  }) => apiClient.post('/payments/visit-fee', data),
};

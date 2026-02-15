import apiClient from './client';

export const serviceRequestApi = {
  getMyRequests: () => apiClient.get('/service-requests/my'),
  cancel: (requestId: string) => apiClient.post(`/service-requests/${requestId}/cancel`),
  approveEstimate: (requestId: string) => apiClient.post(`/service-requests/${requestId}/approve`),
  verifyOtp: (requestId: string, otp: string) => apiClient.post(`/service-requests/${requestId}/verify-otp`, { otp }),

  
  accept: (requestId: string) => apiClient.post(`/service-requests/${requestId}/accept`),
  markOnTheWay: (requestId: string) => apiClient.patch(`/service-requests/${requestId}/on-the-way`),
  submitEstimate: (requestId: string, estimated_service_cost: number) =>
    apiClient.patch(`/service-requests/${requestId}/estimate`, { estimated_service_cost }),
  complete: (requestId: string) => apiClient.post(`/service-requests/${requestId}/complete`),
  getTechnicianRequests: () => apiClient.get('/service-requests/technician'),
  cancelByTechnician: (requestId: string) => apiClient.patch(`/service-requests/${requestId}/cancel`),
};

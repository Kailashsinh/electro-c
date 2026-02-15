import apiClient from './client';

export const notificationApi = {
  getAll: () => apiClient.get('/notifications'),
  markAsRead: (notificationId: string) => apiClient.patch(`/notifications/${notificationId}/read`),
};

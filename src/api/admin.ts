import apiClient from './client';

export const adminApi = {
    
    getDashboardStats: () => apiClient.get('/admin/dashboard'),

    
    getAllUsers: () => apiClient.get('/admin/users'),
    updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

    
    getAllTechnicians: () => apiClient.get('/admin/technicians'),
    verifyTechnician: (id: string) => apiClient.patch(`/admin/technicians/${id}/verify`),
    updateTechnician: (id: string, data: any) => apiClient.put(`/admin/technicians/${id}`, data),
    deleteTechnician: (id: string) => apiClient.delete(`/admin/technicians/${id}`),

    
    getAllServiceRequests: () => apiClient.get('/admin/requests'),
    deleteServiceRequest: (id: string) => apiClient.delete(`/admin/requests/${id}`),

    
    getAllAppliances: () => apiClient.get('/admin/appliances'),
    deleteAppliance: (id: string) => apiClient.delete(`/admin/appliances/${id}`),

    
    getReportData: (type: 'users' | 'technicians' | 'revenue') => apiClient.get(`/admin/reports?type=${type}`),

    
    login: (credentials: any) => apiClient.post('/auth/admin/login', credentials),
};

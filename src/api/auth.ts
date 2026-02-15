import apiClient from './client';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

export interface RegisterTechnicianPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  skills: string[];
  latitude?: number;
  longitude?: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  
  loginUser: (data: LoginPayload) => apiClient.post('/auth/user/login', data),
  registerUser: (data: RegisterUserPayload) => apiClient.post('/auth/user/register', data),
  verifyEmailUser: (data: { email: string; otp: string }) => apiClient.post('/auth/user/verify-email', data),
  resendVerificationUser: (data: { email: string }) => apiClient.post('/auth/user/resend-verification', data),
  forgotPasswordUser: (data: ForgotPasswordPayload) => apiClient.post('/auth/user/forgot-password', data),
  resetPasswordUser: (data: ResetPasswordPayload) => apiClient.post('/auth/user/reset-password', data),
  getUserProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
  changePassword: (data: any) => apiClient.put('/users/password', data),

  
  loginTechnician: (data: LoginPayload) => apiClient.post('/auth/technician/login', data),
  registerTechnician: (data: RegisterTechnicianPayload) => apiClient.post('/auth/technician/register', data),
  verifyEmailTechnician: (data: { email: string; otp: string }) => apiClient.post('/auth/technician/verify-email', data),
  resendVerificationTechnician: (data: { email: string }) => apiClient.post('/auth/technician/resend-verification', data),
  forgotPasswordTechnician: (data: ForgotPasswordPayload) => apiClient.post('/auth/technician/forgot-password', data),
  resetPasswordTechnician: (data: ResetPasswordPayload) => apiClient.post('/auth/technician/reset-password', data),
  getTechnicianProfile: () => apiClient.get('/technician/profile'),
  updateTechnicianProfile: (data: any) => apiClient.put('/technician/profile', data),

  
  loginAdmin: (data: { email: string; password: string }) => apiClient.post('/auth/admin/login', data),
};

import apiClient from './apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/auth/register', data);
  },
};

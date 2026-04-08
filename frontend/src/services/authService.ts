import apiClient from './apiClient';
import type { User } from '../types';
import { MOCK_USER, simulateNetwork } from './mocks';

const USE_MOCKS = true;

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      if (email === 'admin@quizzy.com' && password === 'admin123') {
        return simulateNetwork({
          token: 'mock-jwt-token',
          user: MOCK_USER
        });
      }
      throw new Error('Credenciais inválidas. Tente admin@quizzy.com / admin123');
    }
    const response = await apiClient.post<AuthResponse>('/auth/login/', { email, password });
    return response.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      return simulateNetwork({
        token: 'mock-jwt-token',
        user: { ...MOCK_USER, name: data.name }
      });
    }
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    if (USE_MOCKS) return simulateNetwork(MOCK_USER);
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    if (!USE_MOCKS) {
       await apiClient.post('/auth/logout/');
    }
  }
};

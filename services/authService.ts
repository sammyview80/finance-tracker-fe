import { apiClient } from './apiClient';
import { IAPIResponse } from './interface';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}

export const authService = {
  register: async (userData: RegisterRequest): Promise<IAPIResponse<AuthResponse>> => {
    return await apiClient.authPost<AuthResponse>('/auth/register', userData);
  },

  login: async (email: string, password: string): Promise<IAPIResponse<AuthResponse>> => {
    return await apiClient.authPost<AuthResponse>('/auth/login', { email, password });
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.authPost('/auth/logout');
    } catch (error) {
      // Even if the logout API call fails, we want to clear local storage
      console.error('Logout error:', error);
    }
  }
};
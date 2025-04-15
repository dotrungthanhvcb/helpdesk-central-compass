
import { User } from '@/types';
import { post, get, removeAuthToken, setAuthToken } from './config';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  // Login and store JWT token
  login: async (email: string, password: string): Promise<User> => {
    const response = await post<LoginResponse>('/login', { email, password });
    setAuthToken(response.token);
    return response.user;
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return await get<User>('/me');
  },
  
  // Logout - clear token
  logout: async (): Promise<void> => {
    try {
      await post<void>('/logout', {});
    } finally {
      removeAuthToken();
    }
  },
};


import { User, AuthUser } from '@/types';
import { post, get, removeAuthToken, setAuthToken } from './config';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  // Login and store JWT token
  login: async (email: string, password: string): Promise<AuthUser> => {
    const response = await post<LoginResponse>('/login', { email, password });
    setAuthToken(response.token);
    return response.user;
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<AuthUser> => {
    return await get<AuthUser>('/me');
  },
  
  // Logout - clear token
  logout: async (): Promise<void> => {
    try {
      await post<void>('/logout', {});
    } finally {
      removeAuthToken();
    }
  },
  
  // Check if user has specific permission
  hasPermission: (user: AuthUser | null, permission: string): boolean => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions array if it exists
    if (user.permissions && user.permissions.includes(permission)) return true;
    
    // Role-based permission checks
    switch (permission) {
      case 'ticket:create':
        // Any logged in user can create tickets
        return true;
      case 'ticket:assign':
        // Only IT support, supervisors and admins can assign tickets
        return ['it_support', 'supervisor', 'admin'].includes(user.role);
      case 'contract:view':
        // HR, supervisors and admins can view contracts
        return ['hr', 'supervisor', 'admin'].includes(user.role);
      case 'contract:create':
        // Only HR and admins can create contracts
        return ['hr', 'admin'].includes(user.role);
      case 'review:submit':
        // Supervisors and admins can submit reviews
        return ['supervisor', 'admin'].includes(user.role);
      case 'ot:approve':
        // Supervisors and admins can approve overtime
        return ['supervisor', 'admin'].includes(user.role);
      default:
        return false;
    }
  }
};


export type UserRole = 'admin' | 'hr' | 'it_support' | 'supervisor' | 'employee';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

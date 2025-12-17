/**
 * Type definitions for authentication system.
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  is_verified: boolean;
  software_background: string | null;
  hardware_background: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
  software_background?: string;
  hardware_background?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  software_background?: string;
  hardware_background?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
  expires_in?: number;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: LoginData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

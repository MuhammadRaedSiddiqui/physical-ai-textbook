/**
 * Authentication Context Provider.
 * Provides authentication state and methods to the entire app.
 * Uses custom FastAPI JWT authentication backend.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react';

import type {
  User,
  AuthContextType,
  SignupData,
  LoginData,
  UpdateProfileData
} from './types';

import {
  signup as signupApi,
  signin as signinApi,
  signout as signoutApi,
  getMe,
  updateMe,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  verifyToken,
} from './api';

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component.
 * Wrap your app with this to enable authentication features.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        // Verify token is still valid
        try {
          await verifyToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);
        } catch {
          // Token invalid, clear storage
          removeStoredToken();
          removeStoredUser();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await signupApi(data);
      setToken(response.access_token);
      setUser(response.user);
      setStoredToken(response.access_token);
      setStoredUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signin = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await signinApi(data);
      setToken(response.access_token);
      setUser(response.user);
      setStoredToken(response.access_token);
      setStoredUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        await signoutApi(token);
      }
    } catch {
      // Ignore errors on signout
    } finally {
      setToken(null);
      setUser(null);
      removeStoredToken();
      removeStoredUser();
      setIsLoading(false);
    }
  }, [token]);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const updatedUser = await updateMe(data, token);
      setUser(updatedUser);
      setStoredUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const freshUser = await getMe(token);
      setUser(freshUser);
      setStoredUser(freshUser);
    } catch {
      // Token might be invalid
      setToken(null);
      setUser(null);
      removeStoredToken();
      removeStoredUser();
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    signup,
    signin,
    signout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook for conditional rendering based on auth state.
 * Returns null while loading.
 */
export function useAuthState() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}

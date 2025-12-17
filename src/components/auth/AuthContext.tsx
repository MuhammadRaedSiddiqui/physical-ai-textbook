/**
 * Authentication Context Provider.
 * Provides authentication state and methods to the entire app.
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

import { authClient } from '../../lib/auth-client';

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
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        is_active: true,
        is_verified: session.user.emailVerified,
        software_background: (session.user as any).software_background || null,
        hardware_background: (session.user as any).hardware_background || null,
        created_at: session.user.createdAt.toISOString(),
        updated_at: session.user.updatedAt.toISOString(),
      });
      // Better Auth uses cookies, but we can expose the session token if needed
      // session.session.token might be available depending on config
      setToken(session.session.token || "cookie-session"); 
    } else {
      setUser(null);
      setToken(null);
    }
  }, [session]);

  const signup = useCallback(async (data: SignupData) => {
    setIsActionLoading(true);
    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name || "",
        // @ts-ignore - custom fields
        software_background: data.software_background,
        // @ts-ignore - custom fields
        hardware_background: data.hardware_background,
      });
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  const signin = useCallback(async (data: LoginData) => {
    setIsActionLoading(true);
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      // Force reload to ensure session cookie is picked up and UI updates
      window.location.reload();
    } catch (error) {
      setIsActionLoading(false);
      throw error;
    }
  }, []);

  const signout = useCallback(async () => {
    setIsActionLoading(true);
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      setIsActionLoading(false);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    // Better Auth update profile implementation
    // This might need a custom endpoint or using authClient.updateUser if available
    // For now, we'll just log it
    console.log("Update profile not fully implemented with Better Auth yet", data);
  }, []);

  const refreshUser = useCallback(async () => {
    // Session is automatically managed by useSession
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading: isPending || isActionLoading,
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

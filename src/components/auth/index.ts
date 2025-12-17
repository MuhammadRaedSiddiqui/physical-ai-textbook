/**
 * Authentication components exports.
 */

// Context and hooks
export { AuthProvider, useAuth, useAuthState } from './AuthContext';

// Components
export { SignInForm } from './SignInForm';
export { SignUpForm } from './SignUpForm';
export { UserMenu } from './UserMenu';
export { AuthModal } from './AuthModal';
export { AuthButton } from './AuthButton';
export { default as AuthNavbarItem } from './AuthNavbarItem';

// Types
export type {
  User,
  AuthState,
  SignupData,
  LoginData,
  UpdateProfileData,
  AuthContextType,
} from './types';

// API utilities (for advanced usage)
export {
  getStoredToken,
  getStoredUser,
  signup as signupApi,
  signin as signinApi,
  signout as signoutApi,
  getMe,
  updateMe,
  verifyToken,
} from './api';

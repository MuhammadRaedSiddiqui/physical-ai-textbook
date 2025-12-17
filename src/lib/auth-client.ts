/**
 * Auth client configuration.
 * This file is kept for backwards compatibility but the app now uses
 * the custom FastAPI JWT authentication in src/components/auth/api.ts
 */

// Re-export from the auth module for any code that imports from here
export {
  getStoredToken,
  getStoredUser,
  signup,
  signin,
  signout,
  getMe,
  updateMe,
  verifyToken,
} from '../components/auth/api';

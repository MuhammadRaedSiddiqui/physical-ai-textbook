/**
 * Authentication API client.
 * Handles all HTTP requests to the authentication endpoints.
 */

import type {
  SignupData,
  LoginData,
  UpdateProfileData,
  AuthResponse,
  User,
  MessageResponse
} from './types';

// API base URL - uses environment variable or defaults to Render deployment
const API_BASE_URL = typeof window !== 'undefined'
  ? (window as unknown as { ENV_API_URL?: string }).ENV_API_URL || 'https://physical-ai-textbook.onrender.com'
  : 'https://physical-ai-textbook.onrender.com';

const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Get stored auth token from localStorage.
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Store auth token in localStorage.
 */
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage.
 */
export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Get stored user from localStorage.
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('auth_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Store user in localStorage.
 */
export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_user', JSON.stringify(user));
}

/**
 * Remove user from localStorage.
 */
export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_user');
}

/**
 * Create headers for authenticated requests.
 */
function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const authToken = token || getStoredToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Handle API response and throw on error.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }
  return response.json();
}

/**
 * Sign up a new user.
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

/**
 * Sign in an existing user.
 */
export async function signin(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

/**
 * Sign out the current user.
 */
export async function signout(token?: string): Promise<MessageResponse> {
  const response = await fetch(`${AUTH_API_URL}/signout`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });

  return handleResponse<MessageResponse>(response);
}

/**
 * Get the current user's profile.
 */
export async function getMe(token?: string): Promise<User> {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse<User>(response);
}

/**
 * Update the current user's profile.
 */
export async function updateMe(data: UpdateProfileData, token?: string): Promise<User> {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse<User>(response);
}

/**
 * Verify the current token is valid.
 */
export async function verifyToken(token?: string): Promise<MessageResponse> {
  const response = await fetch(`${AUTH_API_URL}/verify-token`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse<MessageResponse>(response);
}

/**
 * Delete the current user's account.
 */
export async function deleteAccount(token?: string): Promise<MessageResponse> {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return handleResponse<MessageResponse>(response);
}

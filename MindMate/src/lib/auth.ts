export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const AUTH_TOKEN_KEY = 'mindmate_token';
const AUTH_USER_KEY = 'mindmate_user';

export const getAuthState = (): AuthState => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  
  if (!token || !userStr) {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    const user = JSON.parse(userStr);
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
};

export const saveAuthState = (token: string, user: User): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('authChange'));
};

// Also we need to export getToken for other APIs
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }
    
    saveAuthState(data.token, data.user);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    
    saveAuthState(data.token, data.user);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event('authChange'));
  // Optionally refresh page or let authChange event handle routing to /login
};

export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  return authState.user;
};

export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated && authState.user !== null;
};
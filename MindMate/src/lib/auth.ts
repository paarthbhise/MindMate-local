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

const AUTH_STORAGE_KEY = 'mindmate_auth';
const USERS_STORAGE_KEY = 'mindmate_users';

export const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getAuthState = (): AuthState => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { isAuthenticated: false, user: null };
  }
};

export const saveAuthState = (authState: AuthState): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

export const register = (username: string, email: string, password: string): { success: boolean; error?: string } => {
  const users = getStoredUsers();
  
  // Check if username or email already exists
  const existingUser = Object.values(users).find(
    ({ user }) => user.username === username || user.email === email
  );
  
  if (existingUser) {
    if (existingUser.user.username === username) {
      return { success: false, error: 'Username already exists' };
    }
    if (existingUser.user.email === email) {
      return { success: false, error: 'Email already exists' };
    }
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    createdAt: new Date().toISOString(),
  };
  
  users[newUser.id] = {
    password,
    user: newUser,
  };
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Auto-login after registration
  const authState: AuthState = {
    isAuthenticated: true,
    user: newUser,
  };
  saveAuthState(authState);
  
  return { success: true };
};

export const login = (usernameOrEmail: string, password: string): { success: boolean; error?: string } => {
  const users = getStoredUsers();
  
  const userEntry = Object.values(users).find(
    ({ user }) => user.username === usernameOrEmail || user.email === usernameOrEmail
  );
  
  if (!userEntry) {
    return { success: false, error: 'User not found' };
  }
  
  if (userEntry.password !== password) {
    return { success: false, error: 'Invalid password' };
  }
  
  const authState: AuthState = {
    isAuthenticated: true,
    user: userEntry.user,
  };
  saveAuthState(authState);
  
  return { success: true };
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  // Clear other user-specific data
  localStorage.removeItem('userProfile');
  localStorage.removeItem('chatHistory');
  localStorage.removeItem('moodHistory');
  localStorage.removeItem('favoriteResources');
  localStorage.removeItem('customQuickReplies');
};

export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  return authState.user;
};

export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated && authState.user !== null;
};
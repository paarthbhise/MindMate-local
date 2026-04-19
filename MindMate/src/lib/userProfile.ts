import { getAuthToken } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  joinedDate: string;
  notifications: boolean;
  darkMode: boolean;
  reminderTime: string; // HH:MM format
  theme: 'teal' | 'blue' | 'purple' | 'green';
}

let cachedProfile: UserProfile | null = null;

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      cachedProfile = data;
      return data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export function getUserProfile(): UserProfile | null {
  // Returns synchronously for fast UI rendering, but should be used along with fetchUserProfile in effects
  return cachedProfile;
}

export async function saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });

    if (res.ok) {
      const updated = await res.json();
      cachedProfile = updated;
    }
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
}

// Ensure compat with older profile generation
export async function createUserProfile(name: string): Promise<UserProfile | null> {
  // The backend auto-creates it, we just update the name
  await saveUserProfile({ name });
  return fetchUserProfile();
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  await saveUserProfile(updates);
  return cachedProfile;
}

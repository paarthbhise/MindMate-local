export interface UserProfile {
  id: string;
  name: string;
  joinedDate: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    reminderTime: string; // HH:MM format
    theme: 'teal' | 'blue' | 'purple' | 'green';
  };
}

export function getUserProfile(): UserProfile | null {
  const stored = localStorage.getItem("userProfile");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse user profile:", error);
      return null;
    }
  }
  return null;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

export function createUserProfile(name: string): UserProfile {
  const profile: UserProfile = {
    id: Date.now().toString(),
    name,
    joinedDate: new Date().toISOString(),
    preferences: {
      notifications: true,
      darkMode: false,
      reminderTime: "20:00", // 8 PM default
      theme: 'teal'
    }
  };
  
  saveUserProfile(profile);
  return profile;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getUserProfile();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  saveUserProfile(updated);
  return updated;
}

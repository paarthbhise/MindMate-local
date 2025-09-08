import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../lib/userProfile";
import type { UserProfile } from "../lib/userProfile";
import { useToast } from "@/hooks/use-toast";
import { useMoodHistory } from "@/hooks/useMoodHistory";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    reminderTime: profile?.preferences.reminderTime || "20:00",
    notifications: profile?.preferences.notifications || false,
    theme: profile?.preferences.theme || 'teal'
  });
  const { toast } = useToast();
  const { moodHistory } = useMoodHistory();

  useEffect(() => {
    const currentProfile = getUserProfile();
    if (currentProfile) {
      setProfile(currentProfile);
      setFormData({
        name: currentProfile.name,
        reminderTime: currentProfile.preferences.reminderTime,
        notifications: currentProfile.preferences.notifications,
        theme: currentProfile.preferences.theme
      });
    }
  }, []);

  const handleSave = () => {
    if (!profile) return;

    const updated = updateUserProfile({
      ...profile,
      name: formData.name,
      preferences: {
        ...profile.preferences,
        reminderTime: formData.reminderTime,
        notifications: formData.notifications,
        theme: formData.theme
      }
    });

    if (updated) {
      setProfile(updated);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved successfully.",
      });
    }
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;

    const totalEntries = moodHistory.length;
    const avgMood = moodHistory.reduce((sum, entry) => sum + entry.value, 0) / totalEntries;
    const daysSinceFirst = Math.floor((Date.now() - new Date(moodHistory[moodHistory.length - 1].date).getTime()) / (1000 * 60 * 60 * 24));
    const streakDays = calculateStreak();

    return { totalEntries, avgMood: Math.round(avgMood * 10) / 10, daysSinceFirst, streakDays };
  };

  const calculateStreak = () => {
    if (moodHistory.length === 0) return 0;
    
    const sortedHistory = [...moodHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedHistory.length; i++) {
      const entryDate = new Date(sortedHistory[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const stats = getMoodStats();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">Please complete the welcome setup first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your personal settings and preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl transition-all duration-300 ease-in-out"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </label>
              <p className="text-lg text-gray-900 dark:text-white">
                {new Date(profile.joinedDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Reminder Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(`1970-01-01T${profile.preferences.reminderTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notifications
              </label>
              {isEditing ? (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-900 dark:text-white">Enable daily reminders</span>
                </label>
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">
                  {profile.preferences.notifications ? "Enabled" : "Disabled"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Journey Stats
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-500 mb-2">
                  {stats.totalEntries}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Mood Entries
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {stats.avgMood}/10
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Average Mood
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {stats.streakDays}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Day Streak
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {stats.daysSinceFirst}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Days Journey
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
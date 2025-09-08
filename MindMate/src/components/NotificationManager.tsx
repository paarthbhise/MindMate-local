import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/userProfile";
import { useToast } from "@/hooks/use-toast";

export default function NotificationManager() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile?.preferences.notifications || !hasPermission) return;

    const scheduleNotification = () => {
      const [hours, minutes] = profile.preferences.reminderTime.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          new Notification('MindMate Daily Check-in', {
            body: "How are you feeling today? Take a moment to track your mood.",
            icon: '/favicon.ico',
            tag: 'daily-mood-reminder'
          });
        } else {
          toast({
            title: "Daily Mood Check-in",
            description: "How are you feeling today? Take a moment to track your mood.",
          });
        }

        // Schedule next day
        scheduleNotification();
      }, timeUntilReminder);
    };

    scheduleNotification();
  }, [hasPermission, toast]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily reminders to check in with your mood.",
        });
      }
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <div className="flex-1">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
              Enable Daily Reminders
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              Get gentle reminders to check in with your mood each day.
            </p>
            <button
              onClick={requestNotificationPermission}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
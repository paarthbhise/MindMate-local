import { useState, useEffect, useMemo } from "react";
import type { MoodEntry } from "../lib/types";
import { getAuthToken } from "../lib/auth";

export function useMoodHistory() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchMoods = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/api/mood', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMoodHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch mood history:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchMoods();
  }, []);

  const addMoodEntry = async (entry: Omit<MoodEntry, "id" | "timestamp">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: "temp-" + Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newEntry, ...moodHistory].slice(0, 30);
    setMoodHistory(updatedHistory);

    const token = getAuthToken();
    if (token) {
      try {
        await fetch('/api/mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(entry)
        });
      } catch (error) {
        console.error("Failed to save mood entry:", error);
      }
    }
  };

  const getTodaysMoods = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.filter(entry => entry.date === today);
  };

  const memoizedMoodHistory = useMemo(() => moodHistory, [moodHistory]);

  return { moodHistory: memoizedMoodHistory, addMoodEntry, getTodaysMoods, isLoaded };
}

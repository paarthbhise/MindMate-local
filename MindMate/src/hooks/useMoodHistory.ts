import { useState, useEffect } from "react";
import type { MoodEntry } from "../lib/types";

export function useMoodHistory() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("moodHistory");
    if (stored) {
      try {
        setMoodHistory(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse mood history:", error);
        setMoodHistory([]);
      }
    }
  }, []);

  const addMoodEntry = (entry: Omit<MoodEntry, "id" | "timestamp">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedHistory = [newEntry, ...moodHistory.filter(m => m.date !== entry.date)];
    const limitedHistory = updatedHistory.slice(0, 30); // Keep only last 30 days

    setMoodHistory(limitedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(limitedHistory));
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === today);
  };

  return { moodHistory, addMoodEntry, getTodaysMood };
}

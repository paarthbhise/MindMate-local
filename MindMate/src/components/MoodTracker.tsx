import { useMemo, useState } from "react";
import { useMoodHistory } from "@/hooks/useMoodHistory";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MOOD_EMOJIS = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😢", label: "Very Sad" },
  { value: 3, emoji: "😔", label: "Sad" },
  { value: 4, emoji: "😔", label: "Sad" },
  { value: 5, emoji: "😐", label: "Neutral" },
  { value: 6, emoji: "😐", label: "Neutral" },
  { value: 7, emoji: "😊", label: "Happy" },
  { value: 8, emoji: "😊", label: "Happy" },
  { value: 9, emoji: "😁", label: "Very Happy" },
  { value: 10, emoji: "😁", label: "Very Happy" },
];

const EMOJI_BUTTONS = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 3, emoji: "😔", label: "Sad" },
  { value: 5, emoji: "😐", label: "Neutral" },
  { value: 7, emoji: "😊", label: "Happy" },
  { value: 10, emoji: "😁", label: "Very Happy" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { moodHistory, addMoodEntry, getTodaysMoods } = useMoodHistory();
  const { toast } = useToast();
  const todaysMoods = getTodaysMoods();
  const [timeframe, setTimeframe] = useState('weekly');
  const [showAll, setShowAll] = useState(false);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSelectedMood(value);
  };

  const saveMood = () => {
    if (selectedMood === null) return;

    const today = new Date().toISOString().split('T')[0];
    const moodData = MOOD_EMOJIS.find(m => m.value === selectedMood)!;

    addMoodEntry({
      date: today,
      value: selectedMood,
      emoji: moodData.emoji,
    });

    toast({
      title: "Mood Saved!",
      description: "Your mood has been recorded successfully.",
    });

    setSelectedMood(null);
  };

  const formatDate = (dateString: string, timestamp?: number) => {
    const date = new Date(timestamp || dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeFormat: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString(undefined, timeFormat)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString(undefined, timeFormat)}`;
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: 'numeric',
        minute: 'numeric',
      });
    }
  };

  const filteredHistory = useMemo(() => {
    const now = new Date();
    let filtered = moodHistory;

    if (timeframe === 'daily') {
      const today = now.setHours(0, 0, 0, 0);
      filtered = moodHistory.filter(entry => new Date(entry.timestamp).getTime() >= today);
    } else if (timeframe === 'weekly') {
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      filtered = moodHistory.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = moodHistory.filter(entry => new Date(entry.timestamp) >= oneMonthAgo);
    }
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [moodHistory, timeframe]);

  const visibleHistory = showAll ? filteredHistory : filteredHistory.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          How are you feeling?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your emotional wellbeing over time
        </p>
      </div>

      {/* Mood Tracker Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Today's Mood
        </h2>

        {todaysMoods.length > 0 && !selectedMood && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-6 flex items-center justify-center space-x-4">
            <p className="font-medium text-teal-700 dark:text-teal-300">
              You've logged your mood
            </p>
            <div className="flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-800 rounded-full">
              <span className="text-3xl font-bold text-teal-600 dark:text-teal-200">{todaysMoods.length}</span>
            </div>
            <p className="font-medium text-teal-700 dark:text-teal-300">
              time(s) today!
            </p>
          </div>
        )}

        {/* Emoji Mood Selector */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {EMOJI_BUTTONS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ease-in-out group ${
                selectedMood === mood.value
                  ? "bg-teal-100 dark:bg-teal-900 ring-2 ring-teal-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 ease-in-out">
                {mood.emoji}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mood Slider Alternative */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rate your mood (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={selectedMood || 5}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mood-slider"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>Very Sad</span>
            <span className="font-medium text-teal-500">
              {selectedMood || 5}
            </span>
            <span>Very Happy</span>
          </div>
        </div>

        {/* Save Mood Button */}
        <div className="text-center">
          <button
            onClick={saveMood}
            disabled={selectedMood === null}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Save Today's Mood
          </button>
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Mood History
          </h2>
          <Select onValueChange={setTimeframe} defaultValue={timeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3 h-96 overflow-y-auto pr-4">
          {visibleHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No mood entries for this period.
            </p>
          ) : (
            visibleHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(entry.date, entry.timestamp)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mood: {entry.value}/10
                    </p>
                  </div>
                </div>
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${entry.value * 10}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
        {filteredHistory.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

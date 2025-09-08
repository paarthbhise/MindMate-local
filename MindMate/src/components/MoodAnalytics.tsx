import { useMoodHistory } from "@/hooks/useMoodHistory";
import type { MoodEntry } from "../lib/types";

export default function MoodAnalytics() {
  const { moodHistory } = useMoodHistory();

  const calculateAverage = (entries: MoodEntry[]) => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.value, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const getWeeklyData = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return moodHistory.filter(entry => new Date(entry.date) >= oneWeekAgo);
  };

  const getMonthlyData = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return moodHistory.filter(entry => new Date(entry.date) >= oneMonthAgo);
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 3) return "Not enough data";
    
    const recent = moodHistory.slice(0, 3);
    const older = moodHistory.slice(3, 6);
    
    const recentAvg = calculateAverage(recent);
    const olderAvg = calculateAverage(older);
    
    if (recentAvg > olderAvg + 0.5) return "Improving";
    if (recentAvg < olderAvg - 0.5) return "Declining";
    return "Stable";
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();
  const weeklyAvg = calculateAverage(weeklyData);
  const monthlyAvg = calculateAverage(monthlyData);
  const trend = getMoodTrend();

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "Improving": return "text-green-500";
      case "Declining": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Improving":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z"/>
          </svg>
        );
      case "Declining":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  if (moodHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Analytics Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Start tracking your mood to see insights and trends over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <svg className="w-6 h-6 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/>
        </svg>
        Mood Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Weekly Average */}
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Weekly Average
            </span>
            <span className="text-xs text-teal-600 dark:text-teal-400">
              ({weeklyData.length} entries)
            </span>
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {weeklyAvg.toFixed(1)}/10
          </div>
        </div>

        {/* Monthly Average */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Monthly Average
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              ({monthlyData.length} entries)
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {monthlyAvg.toFixed(1)}/10
          </div>
        </div>

        {/* Trend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trend
            </span>
          </div>
          <div className={`text-2xl font-bold flex items-center ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span className="ml-2">{trend}</span>
          </div>
        </div>
      </div>

      {/* Recent Mood Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Mood History
        </h3>
        <div className="space-y-2">
          {moodHistory.slice(0, 7).map((entry, index) => (
            <div key={entry.id} className="flex items-center space-x-3">
              <span className="text-2xl">{entry.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.value}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${entry.value * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import MoodTracker from "@/components/MoodTracker";
import MoodAnalytics from "@/components/MoodAnalytics";
import ExportMoodData from "@/components/ExportMoodData";

export default function Mood() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="space-y-8">
        <MoodTracker />
        <MoodAnalytics />
        <ExportMoodData />
      </div>
    </div>
  );
}

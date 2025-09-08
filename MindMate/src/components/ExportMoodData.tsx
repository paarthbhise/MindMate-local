import { useMoodHistory } from "@/hooks/useMoodHistory";
import { useToast } from "@/hooks/use-toast";

export default function ExportMoodData() {
  const { moodHistory } = useMoodHistory();
  const { toast } = useToast();

  const exportToCSV = () => {
    if (moodHistory.length === 0) {
      toast({
        title: "No Data to Export",
        description: "You haven't tracked any moods yet.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Mood Value", "Emoji", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...moodHistory.map(entry => [
        entry.date,
        entry.value,
        `"${entry.emoji}"`,
        new Date(entry.timestamp).toISOString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `mindmate-mood-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Data Exported!",
      description: `Successfully exported ${moodHistory.length} mood entries to CSV.`,
    });
  };

  const exportToJSON = () => {
    if (moodHistory.length === 0) {
      toast({
        title: "No Data to Export",
        description: "You haven't tracked any moods yet.",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalEntries: moodHistory.length,
      moodData: moodHistory
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `mindmate-mood-data-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Data Exported!",
      description: `Successfully exported ${moodHistory.length} mood entries to JSON.`,
    });
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (importData.moodData && Array.isArray(importData.moodData)) {
          const existingData = moodHistory;
          const newData = importData.moodData;
          
          // Merge data, avoiding duplicates by date
          const mergedData = [...existingData];
          let addedCount = 0;
          
          newData.forEach((newEntry: any) => {
            const existingIndex = mergedData.findIndex(entry => entry.date === newEntry.date);
            if (existingIndex === -1) {
              mergedData.push(newEntry);
              addedCount++;
            }
          });
          
          // Sort by date (newest first)
          mergedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          localStorage.setItem("moodHistory", JSON.stringify(mergedData));
          
          toast({
            title: "Data Imported!",
            description: `Successfully imported ${addedCount} new mood entries.`,
          });
          
          // Reload the page to reflect changes
          window.location.reload();
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Please select a valid MindMate mood data JSON file.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        Export/Import Data
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Keep your mood data safe by exporting it or import previous data.
      </p>

      <div className="space-y-4">
        {/* Export Section */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export Data</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportToCSV}
              disabled={moodHistory.length === 0}
              className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-xl transition-all duration-300 ease-in-out font-medium disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={exportToJSON}
              disabled={moodHistory.length === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-xl transition-all duration-300 ease-in-out font-medium disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5,3H7V5H5V10A2,2 0 0,1 3,8V6A2,2 0 0,1 5,4V3M19,3V4A2,2 0 0,1 21,6V8A2,2 0 0,1 19,10V5H17V3H19M3,14A2,2 0 0,1 5,12V14A2,2 0 0,1 3,16V18A2,2 0 0,1 5,20V21H7V19H5V14M19,14V19H17V21H19V20A2,2 0 0,1 21,18V16A2,2 0 0,1 19,14M9,7H15A1,1 0 0,1 16,8V16A1,1 0 0,1 15,17H9A1,1 0 0,1 8,16V8A1,1 0 0,1 9,7Z"/>
              </svg>
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Import Data</h4>
          <label className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl transition-all duration-300 ease-in-out font-medium cursor-pointer flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span>Import JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={importFromJSON}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Only JSON files exported from MindMate are supported.
          </p>
        </div>

        {/* Data Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Data
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {moodHistory.length} mood {moodHistory.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
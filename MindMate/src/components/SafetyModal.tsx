import { useLocation } from "wouter";

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyModal({ isOpen, onClose }: SafetyModalProps) {
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  const handleGoToResources = () => {
    onClose();
    setLocation('/resources');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            We're Here for You
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            It sounds like you might be going through a really difficult time. Please know that you're not alone, and there are people who want to help.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Crisis Helpline:
                </span>
                <span className="text-lg font-mono text-teal-600 dark:text-teal-400">
                  988
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Crisis Text Line:
                </span>
                <span className="text-sm font-mono text-teal-600 dark:text-teal-400">
                  Text HOME to 741741
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleGoToResources}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-xl transition-all duration-300 ease-in-out font-medium"
            >
              View Resources
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-xl transition-all duration-300 ease-in-out font-medium"
            >
              Continue Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

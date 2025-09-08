import { useState } from "react";
import { createUserProfile } from "@/lib/userProfile";

interface WelcomeSetupProps {
  onComplete: (name: string) => void;
}

export default function WelcomeSetup({ onComplete }: WelcomeSetupProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    
    // Create user profile
    createUserProfile(name.trim());
    
    // Small delay for better UX
    setTimeout(() => {
      onComplete(name.trim());
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to MindMate
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            Let's personalize your experience. What would you like us to call you?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ease-in-out"
              required
              autoFocus
            />
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
              </svg>
              <div className="text-sm text-teal-700 dark:text-teal-300">
                <p className="font-medium mb-1">Your Privacy Matters</p>
                <p>Your name is stored locally on your device and never shared with anyone else.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Setting up..." : "Get Started"}
          </button>
        </form>
      </div>
    </div>
  );
}
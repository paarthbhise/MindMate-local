import { useLocation } from "wouter";
import { getUserProfile } from "@/lib/userProfile";
import QuotesWidget from "@/components/QuotesWidget";
import NotificationManager from "@/components/NotificationManager";

export default function Home() {
  const [, setLocation] = useLocation();
  const profile = getUserProfile();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 hero-gradient">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Content */}
        <div className="animate-fade-in">
          {/* Decorative Element */}
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {profile ? `Welcome back, ${profile.name}` : "Your supportive space"}, <span className="text-teal-500">{profile ? "ready to listen" : "anytime"}</span>.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {profile 
              ? "How are you feeling today? I'm here to support you on your mental wellness journey."
              : "MindMate is your private, caring mental health companion. Share your thoughts, track your mood, and find helpful resources—whenever you need support."
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation('/chat')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out font-semibold text-lg transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Start Chat</span>
            </button>
            <button
              onClick={() => setLocation('/mood')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out font-semibold text-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Track Mood</span>
            </button>
          </div>
        </div>

        {/* Notification Reminder */}
        <div className="mt-8">
          <NotificationManager />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 animate-slide-up">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="text-teal-500 text-3xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Private & Safe</h3>
            <p className="text-gray-600 dark:text-gray-300">Your conversations are completely private and secure.</p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="text-teal-500 text-3xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">24/7 Available</h3>
            <p className="text-gray-600 dark:text-gray-300">Get support whenever you need it, day or night.</p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="text-teal-500 text-3xl mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Caring Support</h3>
            <p className="text-gray-600 dark:text-gray-300">Compassionate responses tailored to your needs.</p>
          </div>

          {/* Daily Quote Widget */}
          <QuotesWidget />
        </div>
      </div>
    </section>
  );
}

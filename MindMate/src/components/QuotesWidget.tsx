import { useState, useEffect } from "react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "You are stronger than you think and more resilient than you know.",
    author: "Unknown"
  },
  {
    text: "Healing is not about moving on or 'getting over it,' it's about learning to make peace with our pain.",
    author: "Unknown"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "Progress, not perfection. Every small step forward matters.",
    author: "Unknown"
  },
  {
    text: "It's okay to not be okay. What matters is that you're here and you're trying.",
    author: "Unknown"
  },
  {
    text: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins"
  },
  {
    text: "The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes.",
    author: "William James"
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  }
];

export default function QuotesWidget() {
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Get a random quote on component mount
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  const getNewQuote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    } while (MOTIVATIONAL_QUOTES[randomIndex] === currentQuote);
    
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="flex items-start justify-between mb-4">
        <div className="text-teal-500 text-2xl">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,17H13L13,13L14,13M9,9H10V15H9V9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4.2A7.8,7.8 0 0,1 19.8,12A7.8,7.8 0 0,1 12,19.8A7.8,7.8 0 0,1 4.2,12A7.8,7.8 0 0,1 12,4.2Z"/>
          </svg>
        </div>
        <button
          onClick={getNewQuote}
          className="text-gray-400 hover:text-teal-500 transition-colors duration-300 ease-in-out p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Get new quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <blockquote className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed mb-3">
        "{currentQuote.text}"
      </blockquote>
      
      <cite className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        — {currentQuote.author}
      </cite>
    </div>
  );
}
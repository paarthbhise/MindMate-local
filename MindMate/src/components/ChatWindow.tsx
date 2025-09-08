import { useState, useEffect, useRef } from "react";
import type { ChatMessage } from "../lib/types";
import { sendMockMessage, checkForCrisisKeywords } from "@/services/mockChat";
import { useToast } from "@/hooks/use-toast";
import { useChatHistory } from "@/hooks/useChatHistory";
import { getUserProfile } from "@/lib/userProfile";
import MessageBubble from "./MessageBubble";
import LoadingSpinner from "./LoadingSpinner";
import SafetyModal from "./SafetyModal";
import { useLocation } from "wouter";

export default function ChatWindow() {
  const { chatHistory, addMessage, addMessages, clearHistory, deleteMessage, isLoaded } = useChatHistory();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  interface QuickReply {
    id: string;
    text: string;
  }
  const [customQuickReplies, setCustomQuickReplies] = useState<QuickReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Load custom quick replies from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customQuickReplies");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Handle both old format (string[]) and new format (QuickReply[])
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            // Convert old format to new format
            const converted = parsed.map((text: string) => ({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              text
            }));
            setCustomQuickReplies(converted);
            localStorage.setItem("customQuickReplies", JSON.stringify(converted));
          } else {
            setCustomQuickReplies(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to parse custom quick replies:", error);
      }
    }
  }, []);

  // Initialize chat with personalized welcome message if no history exists
  useEffect(() => {
    if (isLoaded && chatHistory.length === 0) {
      const profile = getUserProfile();
      const userName = profile?.name || "friend";
      const hour = new Date().getHours();
      let greeting = "Hello";
      
      if (hour < 12) greeting = "Good morning";
      else if (hour < 17) greeting = "Good afternoon";
      else greeting = "Good evening";

      const welcomeMessage: ChatMessage = {
        id: "welcome-" + Date.now().toString(),
        text: `${greeting}, ${userName}! I'm MindMate, your supportive companion. How are you feeling today?`,
        sender: 'bot' as 'bot',
        timestamp: Date.now(),
      };
      addMessage(welcomeMessage);
    }
    // Only run this effect once when isLoaded becomes true
  }, [isLoaded]);

  // Auto scroll to bottom
  useEffect(() => {
    // Use a small timeout to ensure DOM updates are complete before scrolling
    const scrollTimeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    
    return () => clearTimeout(scrollTimeout);
  }, [chatHistory, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user' as 'user',
      timestamp: Date.now(),
    };

    // Store the message text before clearing the input
    const messageText = inputValue.trim();
    
    // Clear input field immediately to improve user experience
    setInputValue("");
    
    // Add the message to chat history
    addMessage(userMessage);
    
    // Check if this message should be added as a custom quick reply
    if (messageText.length > 5 && 
        messageText.length < 50 && 
        !defaultQuickReplies.some(reply => reply.text === messageText) && 
        !customQuickReplies.some(reply => reply.text === messageText)) {
      addCustomQuickReply(messageText);
    }

    // Check for crisis keywords
    if (checkForCrisisKeywords(messageText)) {
      setShowSafetyModal(true);
      return;
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      const botResponse = await sendMockMessage(messageText);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot' as 'bot',
        timestamp: Date.now(),
      };

      addMessage(botMessage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string | QuickReply) => {
    const text = typeof reply === 'string' ? reply : reply.text;
    setInputValue(text);
    // Auto-send after setting the value
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim() !== '') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const defaultQuickReplies: QuickReply[] = [
    { id: 'default-1', text: "I feel anxious" },
    { id: 'default-2', text: "I'm stressed" }, 
    { id: 'default-3', text: "I need support" },
    { id: 'default-4', text: "Tell me about breathing exercises" }
  ];

  const allQuickReplies = [...defaultQuickReplies, ...customQuickReplies];

  const addCustomQuickReply = (text: string) => {
    if (!customQuickReplies.some(r => r.text === text) && text.trim().length > 0) {
      const newReply: QuickReply = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        text: text.trim()
      };
      const updated = [...customQuickReplies, newReply];
      setCustomQuickReplies(updated);
      localStorage.setItem("customQuickReplies", JSON.stringify(updated));
    }
  };

  const removeCustomQuickReply = (replyToRemove: QuickReply | string) => {
    const idToRemove = typeof replyToRemove === 'string' 
      ? customQuickReplies.find(r => r.text === replyToRemove)?.id
      : replyToRemove.id;
    
    if (idToRemove) {
      const updated = customQuickReplies.filter(r => r.id !== idToRemove);
      setCustomQuickReplies(updated);
      localStorage.setItem("customQuickReplies", JSON.stringify(updated));
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    const profile = getUserProfile();
    const userName = profile?.name || "friend";
    const hour = new Date().getHours();
    let greeting = "Hello";
    
    if (hour < 12) greeting = "Good morning";
    else if (hour < 17) greeting = "Good afternoon";
    else greeting = "Good evening";

    const welcomeMessage: ChatMessage = {
      id: "welcome-" + Date.now().toString(),
      text: `${greeting}, ${userName}! I'm MindMate, your supportive companion. How are you feeling today?`,
      sender: 'bot' as 'bot',
      timestamp: Date.now(),
    };
    addMessage(welcomeMessage);
    toast({
      title: "Chat History Cleared",
      description: "Starting fresh with a new conversation.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border animate-fade-in">
        {/* Chat Header */}
        <div className="gradient-bg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">MindMate Assistant</h2>
                <p className="text-primary-foreground/80 text-sm">Here to listen and support you</p>
              </div>
            </div>
            <button
              onClick={() => setLocation('/')}
              className="text-white/80 hover:text-white transition-colors duration-300 ease-in-out"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[calc(60vh-180px)] min-h-[300px] overflow-y-auto p-6 space-y-4 bg-background/50 chat-scrollbar">
          {chatHistory.length > 0 ? (
            <div className="flex flex-col">
              {chatHistory.map((message: ChatMessage) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onDelete={deleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No messages yet. Start a conversation!
            </div>
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-border glass">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="px-6 py-3 bg-card border-t border-border">
          <div className="flex flex-wrap gap-2 mb-2">
            {allQuickReplies.map((reply) => (
              <div key={reply.id} className="flex items-center">
                <button
                  onClick={() => handleQuickReply(reply.text)}
                  disabled={isTyping}
                  className="bg-muted hover:bg-primary/10 text-muted-foreground px-3 py-2 rounded-2xl text-sm transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reply.text}
                </button>
                {customQuickReplies.some(r => r.id === reply.id) && (
                  <button
                    onClick={() => removeCustomQuickReply(reply)}
                    className="ml-2 text-red-400 hover:text-red-600 text-xs"
                    title="Remove custom reply"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Tip: Send a message to add it as a quick reply</span>
            <button
              onClick={handleClearHistory}
              className="text-red-400 hover:text-red-600 underline"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-card">
          <div className="flex space-x-3">
            <div className="flex-1 relative gradient-border">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind..."
                disabled={isTyping}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="gradient-bg text-white px-6 py-3 rounded-2xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Modal */}
      <SafetyModal 
        isOpen={showSafetyModal} 
        onClose={() => setShowSafetyModal(false)} 
      />
    </div>
  );
}

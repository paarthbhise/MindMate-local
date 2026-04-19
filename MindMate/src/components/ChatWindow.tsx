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
import { getAuthToken } from "@/lib/auth";

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

  // Load custom quick replies from backend
  useEffect(() => {
    const fetchQuickReplies = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/api/chat/quick-replies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomQuickReplies(data);
        }
      } catch (error) {
        console.error("Failed to load quick replies:", error);
      }
    };
    fetchQuickReplies();
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

  const addCustomQuickReply = async (text: string) => {
    if (!customQuickReplies.some(r => r.text === text) && text.trim().length > 0) {
      const newReply: QuickReply = {
        id: "temp-" + Date.now().toString(),
        text: text.trim()
      };
      const updated = [...customQuickReplies, newReply];
      setCustomQuickReplies(updated);

      const token = getAuthToken();
      if (token) {
        try {
          await fetch('/api/chat/quick-replies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ replies: updated })
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const removeCustomQuickReply = async (replyToRemove: QuickReply | string) => {
    const idToRemove = typeof replyToRemove === 'string'
      ? customQuickReplies.find(r => r.text === replyToRemove)?.id
      : replyToRemove.id;

    if (idToRemove) {
      const updated = customQuickReplies.filter(r => r.id !== idToRemove);
      setCustomQuickReplies(updated);
      const token = getAuthToken();
      if (token) {
        await fetch('/api/chat/quick-replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ replies: updated })
        });
      }
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
    <div className="max-w-7xl max-h-[900px] mx-auto">
      <div className="bg-card rounded-2xl max-h-[900px] shadow-xl overflow-hidden border border-border animate-fade-in">
        {/* Chat Header */}
        <iframe
          className="w-full h-[800px] max-w-full"
          src="https://paarthbhise-cortex-genai-techchatbot.hf.space"
          width="100%"
          height="100%">
        </iframe>
      </div>

      {/* Safety Modal */}
      <SafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </div>
  );
}

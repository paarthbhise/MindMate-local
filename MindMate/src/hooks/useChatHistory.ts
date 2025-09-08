import { useState, useEffect } from "react";
import type { ChatMessage } from "../lib/types";

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load chat history from localStorage on mount
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      try {
        const parsedHistory = JSON.parse(stored);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error("Failed to parse chat history:", error);
        setChatHistory([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const addMessage = (message: ChatMessage) => {
    setChatHistory(prevHistory => {
      const updatedHistory = [...prevHistory, message];
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const addMessages = (messages: ChatMessage[]) => {
    setChatHistory(prevHistory => {
      const updatedHistory = [...prevHistory, ...messages];
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const deleteMessage = (messageId: string) => {
    setChatHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(msg => msg.id !== messageId);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  return {
    chatHistory,
    addMessage,
    addMessages,
    clearHistory,
    deleteMessage,
    isLoaded
  };
}
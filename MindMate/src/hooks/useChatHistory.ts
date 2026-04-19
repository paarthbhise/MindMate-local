import { useState, useEffect } from "react";
import type { ChatMessage } from "../lib/types";
import { getAuthToken } from "../lib/auth";

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchHistory = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoaded(true);
      return;
    }
    try {
      const res = await fetch('/api/chat', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const addMessage = async (message: ChatMessage) => {
    // Optimistic UI update
    setChatHistory(prev => [...prev, message]);

    const token = getAuthToken();
    if (token) {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message)
      });
    }
  };

  const addMessages = async (messages: ChatMessage[]) => {
    setChatHistory(prev => [...prev, ...messages]);
    const token = getAuthToken();
    if (token) {
      for (const msg of messages) {
        await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(msg)
        });
      }
    }
  };

  const clearHistory = async () => {
    setChatHistory([]);
    const token = getAuthToken();
    if (token) {
      await fetch('/api/chat', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  };

  // Wait, our backend doesn't support deleting a single message right now. Let's add that to the backend!
  const deleteMessage = async (messageId: string) => {
    setChatHistory(prev => prev.filter(msg => msg.id !== messageId));
    // Not supported by backend yet, skipping for now
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
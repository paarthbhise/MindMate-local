import type { ChatMessage } from "../lib/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from '@/hooks/useTheme.tsx';

interface MessageBubbleProps {
  message: ChatMessage;
  onDelete?: (id: string) => void;
}

export default function MessageBubble({ message, onDelete }: MessageBubbleProps) {
  const { id, text, sender, timestamp } = message;
  const isUser = sender === 'user';
  const [isVisible, setIsVisible] = useState(false);
  const { animationLevel } = useTheme();
  
  useEffect(() => {
    // Ensure message appears after component mounts
    setIsVisible(true);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex group ${isUser ? 'justify-end' : 'justify-start'} ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } transition-opacity duration-300 animate-fade-in`}>
      {isUser && onDelete && (
        <button 
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 mr-2 self-end mb-2 text-gray-400 hover:text-red-500 transition-opacity duration-200"
          aria-label="Delete message"
        >
          <Trash2 size={16} />
        </button>
      )}
      <div 
        className={`max-w-md px-4 py-3 shadow-md ${animationLevel !== 'minimal' ? 'animate-float' : ''} ${
          isUser 
            ? 'gradient-bg text-white rounded-2xl rounded-br-md' 
            : 'bg-card text-card-foreground rounded-2xl rounded-bl-md border border-border dark:border-border glass'
        }`}
      >
        <p className="break-words">{text}</p>
        <span className={`text-xs opacity-70 block mt-1 ${
          isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {formatTime(timestamp)}
        </span>
      </div>
      {!isUser && onDelete && (
        <button 
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 ml-2 self-end mb-2 text-gray-400 hover:text-red-500 transition-opacity duration-200"
          aria-label="Delete message"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

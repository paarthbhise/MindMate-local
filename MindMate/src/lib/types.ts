export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  value: number;
  emoji: string;
  timestamp: number;
}

export interface ResourceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  type: 'internal' | 'external';
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

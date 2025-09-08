import { useState, useEffect, useRef } from "react";

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale';

export default function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopBreathing();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const countdown = (seconds: number, nextState: BreathingState) => {
    let remaining = seconds;
    setCount(remaining);
    
    intervalRef.current = setInterval(() => {
      remaining--;
      setCount(remaining);
      
      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        if (nextState === 'inhale') {
          timeoutRef.current = setTimeout(() => runCycle(), 1000);
        } else {
          setBreathingState(nextState);
          runCycle();
        }
      }
    }, 1000);
  };

  const runCycle = () => {
    if (!isActive) return;
    
    if (breathingState === 'inhale') {
      setBreathingState('hold');
      countdown(7, 'exhale');
    } else if (breathingState === 'hold') {
      setBreathingState('exhale');
      countdown(8, 'inhale');
    } else if (breathingState === 'exhale') {
      setBreathingState('inhale');
      countdown(4, 'hold');
    }
  };

  const startBreathing = () => {
    if (!isActive) {
      setIsActive(true);
      setBreathingState('inhale');
      countdown(4, 'hold');
    } else {
      stopBreathing();
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingState('idle');
    setCount(4);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleClose = () => {
    stopBreathing();
    onClose();
  };

  if (!isOpen) return null;

  const getInstruction = () => {
    switch (breathingState) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold your breath...';
      case 'exhale': return 'Breathe out slowly...';
      default: return 'Click Start to begin';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          4-7-8 Breathing Exercise
        </h2>
        
        <div className="mb-8">
          <div className={`w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center mb-4 transition-transform duration-1000 ease-in-out ${
            breathingState === 'inhale' ? 'scale-125' : 'scale-100'
          }`}>
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9m0-2C6.48 1 2 5.48 2 12s4.48 11 10 11 10-4.48 10-11S17.52 1 12 1z"/>
              <path d="M8.5 8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm4 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-2">
            {getInstruction()}
          </p>
          
          <p className="text-3xl font-bold text-teal-500">
            {count}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={startBreathing}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-all duration-300 ease-in-out font-medium"
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 py-3 rounded-xl transition-all duration-300 ease-in-out font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

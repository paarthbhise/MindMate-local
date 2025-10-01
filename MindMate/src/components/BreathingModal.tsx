import { useState, useEffect, useRef } from "react";

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale';

const CYCLE_TIMES = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

export default function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopBreathing();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || breathingState === 'idle') {
      return;
    }

    const currentStateTime = CYCLE_TIMES[breathingState as keyof typeof CYCLE_TIMES];
    setCount(currentStateTime);

    timerRef.current = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      
      if (breathingState === 'inhale') setBreathingState('hold');
      else if (breathingState === 'hold') setBreathingState('exhale');
      else if (breathingState === 'exhale') setBreathingState('inhale');

    }, currentStateTime * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(timeout);
    };
  }, [isActive, breathingState]);

  const startBreathing = () => {
    if (isActive) {
      stopBreathing();
    } else {
      setIsActive(true);
      setBreathingState('inhale');
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingState('idle');
    setCount(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
            {count > 0 ? count : ''}
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

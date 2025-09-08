import { useState } from 'react';
import { Check, ChevronDown, Palette, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeSelector() {
  const { theme, isDark, animationLevel, setTheme, toggleDarkMode, setAnimationLevel } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'teal', name: 'Teal' },
    { id: 'blue', name: 'Blue' },
    { id: 'purple', name: 'Purple' },
    { id: 'green', name: 'Green' },
    { id: 'orange', name: 'Orange' },
  ];

  const animationLevels = [
    { id: 'minimal', name: 'Minimal' },
    { id: 'moderate', name: 'Moderate' },
    { id: 'high', name: 'High' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center gap-2"
        aria-label="Theme settings"
      >
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-3 z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Appearance</h3>
          </div>
          
          {/* Color Themes */}
          <div className="px-3 py-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Color Theme</h4>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    setIsOpen(false);
                  }}
                  className={`w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${theme === t.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary' : 'hover:ring-1 hover:ring-primary/50'}`}
                  style={{
                    background: `var(--gradient-start)`,
                    backgroundImage: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
                  }}
                  data-theme={t.id}
                >
                  {theme === t.id && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dark Mode</span>
              <button
                onClick={() => toggleDarkMode()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          {/* Animation Level */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Animations</span>
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {animationLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setAnimationLevel(level.id as any);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-300 ${animationLevel === level.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
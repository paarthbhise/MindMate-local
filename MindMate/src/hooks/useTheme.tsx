import {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from 'react';

// --- Type Definitions ---
type ThemeType = 'teal' | 'blue' | 'purple' | 'green' | 'orange';
type AnimationLevel = 'minimal' | 'moderate' | 'high';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  animationLevel: AnimationLevel;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
  setAnimationLevel: (level: AnimationLevel) => void;
}

// --- Context Creation ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- Provider Component ---
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // State initialization is now SSR-safe, starting with defaults.
  const [theme, setTheme] = useState<ThemeType>('teal');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [animationLevel, setAnimationLevel] = useState<AnimationLevel>('moderate');

  // This effect runs only on the client to load saved state from localStorage.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-color') as ThemeType;
    if (savedTheme) setTheme(savedTheme);

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDark(savedDarkMode === 'true');
    } else {
      // Fallback to user's OS preference if no setting is saved
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }

    const savedAnimation = localStorage.getItem('animation-level') as AnimationLevel;
    if (savedAnimation) setAnimationLevel(savedAnimation);
  }, []); // Empty array ensures this runs only once on mount.

  // Effects to update DOM and localStorage when state changes.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-color', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute('data-animation', animationLevel);
    localStorage.setItem('animation-level', animationLevel);
  }, [animationLevel]);

  // --- Memoized Context Value ---
  // This prevents unnecessary re-renders in consumer components.
  const memoizedValue = useMemo(
    () => ({
      theme,
      isDark,
      animationLevel,
      setTheme, // setTheme is already stable from useState
      toggleDarkMode: () => setIsDark((prev) => !prev),
      setAnimationLevel, // setAnimationLevel is stable
    }),
    [theme, isDark, animationLevel]
  );

  return(
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- Custom Hook for Consumers ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeName, Theme } from '../types';
import { storage } from '../lib/utils';

const THEME_STORAGE_KEY = 'time-theme';

export const themes: Theme[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    storage.get<ThemeName>(THEME_STORAGE_KEY, defaultTheme)
  );

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    storage.set(THEME_STORAGE_KEY, newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0a0a0a' : '#ffffff'
      );
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}


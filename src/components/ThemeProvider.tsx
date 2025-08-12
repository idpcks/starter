'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useStore } from '@/lib/hooks/useStore';

interface ThemeContextType {
  themeMode: 'auto' | 'light' | 'dark';
  setThemeMode: (mode: 'auto' | 'light' | 'dark') => void;
  // Legacy support
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { themeMode, setThemeMode, darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedThemeMode = localStorage.getItem('themeMode');
    if (savedThemeMode && ['auto', 'light', 'dark'].includes(savedThemeMode)) {
      setThemeMode(savedThemeMode as 'auto' | 'light' | 'dark');
    } else {
      // Migrate from old darkMode setting
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        const isDark = JSON.parse(savedDarkMode);
        setThemeMode(isDark ? 'dark' : 'light');
        localStorage.removeItem('darkMode');
      }
    }
  }, [setThemeMode]);

  useEffect(() => {
    // Save theme to localStorage and apply to document
    localStorage.setItem('themeMode', themeMode);
    
    const applyTheme = () => {
      let shouldBeDark = false;
      
      if (themeMode === 'dark') {
        shouldBeDark = true;
      } else if (themeMode === 'light') {
        shouldBeDark = false;
      } else { // auto
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Update legacy darkMode state
      useStore.setState({ darkMode: shouldBeDark });
    };
    
    applyTheme();
    
    // Listen for system theme changes when in auto mode
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
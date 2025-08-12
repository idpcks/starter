'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppTitleContextType {
  appTitle: string;
  setAppTitle: (title: string) => void;
}

const AppTitleContext = createContext<AppTitleContextType | undefined>(undefined);

interface AppTitleProviderProps {
  children: ReactNode;
}

export function AppTitleProvider({ children }: AppTitleProviderProps) {
  const [appTitle, setAppTitleState] = useState('NextJS Starter Kit');

  useEffect(() => {
    // Load app title from localStorage on mount
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
      setAppTitleState(savedTitle);
      // Update document title on initial load
      document.title = savedTitle;
    } else {
      // Set default title if none saved
      document.title = appTitle;
    }
  }, []);

  const setAppTitle = (title: string) => {
    setAppTitleState(title);
    localStorage.setItem('appTitle', title);
    // Update document title
    document.title = title;
  };

  return (
    <AppTitleContext.Provider value={{ appTitle, setAppTitle }}>
      {children}
    </AppTitleContext.Provider>
  );
}

export function useAppTitle() {
  const context = useContext(AppTitleContext);
  if (context === undefined) {
    throw new Error('useAppTitle must be used within an AppTitleProvider');
  }
  return context;
}
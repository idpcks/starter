'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppTitleContextType {
  appTitle: string;
  setAppTitle: (title: string) => void;
  loading: boolean;
}

const AppTitleContext = createContext<AppTitleContextType | undefined>(undefined);

interface AppTitleProviderProps {
  children: ReactNode;
}

export function AppTitleProvider({ children }: AppTitleProviderProps) {
  const [appTitle, setAppTitleState] = useState('NextJS Starter Kit');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load app title from database via API
    const fetchTitle = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          const title = settings.app_title || 'NextJS Starter Kit';
          setAppTitleState(title);
          document.title = title;
        } else {
          // Fallback to localStorage if API fails
          const savedTitle = localStorage.getItem('appTitle');
          if (savedTitle) {
            setAppTitleState(savedTitle);
            document.title = savedTitle;
          } else {
            document.title = appTitle;
          }
        }
      } catch (error) {
        console.error('Error fetching app title:', error);
        // Fallback to localStorage
        const savedTitle = localStorage.getItem('appTitle');
        if (savedTitle) {
          setAppTitleState(savedTitle);
          document.title = savedTitle;
        } else {
          document.title = appTitle;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTitle();
  }, []);

  const setAppTitle = async (title: string) => {
    try {
      // Update database via API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'app_title', value: title }),
      });
      
      if (response.ok) {
        setAppTitleState(title);
        document.title = title;
        // Also update localStorage as backup
        localStorage.setItem('appTitle', title);
      } else {
        throw new Error('Failed to update title in database');
      }
    } catch (error) {
      console.error('Error updating app title:', error);
      // Fallback to localStorage only
      setAppTitleState(title);
      localStorage.setItem('appTitle', title);
      document.title = title;
    }
  };

  return (
    <AppTitleContext.Provider value={{ appTitle, setAppTitle, loading }}>
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
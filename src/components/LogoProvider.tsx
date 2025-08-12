'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LogoContextType {
  logoUrl: string | null;
  isLogoEnabled: boolean;
  setLogoUrl: (url: string | null) => void;
  setIsLogoEnabled: (enabled: boolean) => void;
  resetToDefault: () => void;
  getCurrentLogo: () => string;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

interface LogoProviderProps {
  children: ReactNode;
}

const DEFAULT_LOGO = '/next.svg';
const LOGO_STORAGE_KEY = 'app_logo_url';
const LOGO_ENABLED_STORAGE_KEY = 'app_logo_enabled';

export function LogoProvider({ children }: LogoProviderProps) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);
  const [isLogoEnabled, setIsLogoEnabledState] = useState(true);

  // Load logo settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY);
      const savedLogoEnabled = localStorage.getItem(LOGO_ENABLED_STORAGE_KEY);
      
      if (savedLogoUrl) {
        setLogoUrlState(savedLogoUrl);
      }
      
      if (savedLogoEnabled !== null) {
        setIsLogoEnabledState(savedLogoEnabled === 'true');
      }
    }
  }, []);

  const setLogoUrl = (url: string | null) => {
    setLogoUrlState(url);
    if (typeof window !== 'undefined') {
      if (url) {
        localStorage.setItem(LOGO_STORAGE_KEY, url);
      } else {
        localStorage.removeItem(LOGO_STORAGE_KEY);
      }
    }
  };

  const setIsLogoEnabled = (enabled: boolean) => {
    setIsLogoEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOGO_ENABLED_STORAGE_KEY, enabled.toString());
    }
  };

  const resetToDefault = () => {
    setLogoUrl(null);
    setIsLogoEnabled(true);
  };

  // Get the current logo to display
  const getCurrentLogo = () => {
    if (!isLogoEnabled) {
      return DEFAULT_LOGO;
    }
    return logoUrl || DEFAULT_LOGO;
  };

  const value: LogoContextType = {
    logoUrl,
    isLogoEnabled,
    setLogoUrl,
    setIsLogoEnabled,
    resetToDefault,
    getCurrentLogo,
  };

  return (
    <LogoContext.Provider value={value}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
}
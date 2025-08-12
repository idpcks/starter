'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LogoContextType {
  logoUrl: string | null;
  isLogoEnabled: boolean;
  setLogoUrl: (url: string | null) => void;
  setIsLogoEnabled: (enabled: boolean) => void;
  resetToDefault: () => void;
  getCurrentLogo: () => string;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  // Load logo settings from database via API
  useEffect(() => {
    const fetchLogoSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          const logoUrl = settings.app_logo_url || null;
          const logoEnabled = settings.app_logo_enabled === 'true';
          
          setLogoUrlState(logoUrl);
          setIsLogoEnabledState(logoEnabled);
        } else {
          // Fallback to localStorage if API fails
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
        }
      } catch (error) {
        console.error('Error fetching logo settings:', error);
        // Fallback to localStorage
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
      } finally {
        setLoading(false);
      }
    };

    fetchLogoSettings();
  }, []);

  const setLogoUrl = async (url: string | null) => {
    try {
      // Update database via API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'app_logo_url', value: url || '' }),
      });
      
      if (response.ok) {
        setLogoUrlState(url);
        // Also update localStorage as backup
        if (typeof window !== 'undefined') {
          if (url) {
            localStorage.setItem(LOGO_STORAGE_KEY, url);
          } else {
            localStorage.removeItem(LOGO_STORAGE_KEY);
          }
        }
      } else {
        throw new Error('Failed to update logo URL in database');
      }
    } catch (error) {
      console.error('Error updating logo URL:', error);
      // Fallback to localStorage only
      setLogoUrlState(url);
      if (typeof window !== 'undefined') {
        if (url) {
          localStorage.setItem(LOGO_STORAGE_KEY, url);
        } else {
          localStorage.removeItem(LOGO_STORAGE_KEY);
        }
      }
    }
  };

  const setIsLogoEnabled = async (enabled: boolean) => {
    try {
      // Update database via API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'app_logo_enabled', value: enabled.toString() }),
      });
      
      if (response.ok) {
        setIsLogoEnabledState(enabled);
        // Also update localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOGO_ENABLED_STORAGE_KEY, enabled.toString());
        }
      } else {
        throw new Error('Failed to update logo enabled status in database');
      }
    } catch (error) {
      console.error('Error updating logo enabled status:', error);
      // Fallback to localStorage only
      setIsLogoEnabledState(enabled);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGO_ENABLED_STORAGE_KEY, enabled.toString());
      }
    }
  };

  const resetToDefault = async () => {
    await setLogoUrl(null);
    await setIsLogoEnabled(true);
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
    loading,
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
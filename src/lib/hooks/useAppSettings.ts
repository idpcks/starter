'use client';

import { useState, useEffect, useCallback } from 'react';

interface AppSettings {
  app_title: string;
  app_logo_url: string;
  app_logo_enabled: string;
}

interface UseAppSettingsReturn {
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  updateSetting: (key: string, value: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  app_title: 'NextJS Starter Kit',
  app_logo_url: '',
  app_logo_enabled: 'false'
};

export function useAppSettings(): UseAppSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings({ ...defaultSettings, ...data });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to localStorage if API fails
      const localTitle = localStorage.getItem('appTitle');
      const localLogoUrl = localStorage.getItem('logoUrl');
      const localLogoEnabled = localStorage.getItem('logoEnabled');
      
      setSettings({
        app_title: localTitle || defaultSettings.app_title,
        app_logo_url: localLogoUrl || defaultSettings.app_logo_url,
        app_logo_enabled: localLogoEnabled || defaultSettings.app_logo_enabled
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update single setting
  const updateSetting = useCallback(async (key: string, value: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
      
      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Also update localStorage as backup
      if (key === 'app_title') {
        localStorage.setItem('appTitle', value);
        document.title = value;
      } else if (key === 'app_logo_url') {
        localStorage.setItem('logoUrl', value);
      } else if (key === 'app_logo_enabled') {
        localStorage.setItem('logoEnabled', value);
      }
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Update multiple settings
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      setError(null);
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: newSettings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      // Update local state
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Also update localStorage as backup
      Object.entries(newSettings).forEach(([key, value]) => {
        if (key === 'app_title') {
          localStorage.setItem('appTitle', value);
          document.title = value;
        } else if (key === 'app_logo_url') {
          localStorage.setItem('logoUrl', value);
        } else if (key === 'app_logo_enabled') {
          localStorage.setItem('logoEnabled', value);
        }
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  // Refresh settings
  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  // Initial load
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    refreshSettings
  };
}
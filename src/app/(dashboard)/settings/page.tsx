'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { withPermission } from '@/components/auth/withPermission';
import { Permission } from '@/types/permission';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useAppTitle } from '@/components/AppTitleProvider';
import { useLogo } from '@/components/LogoProvider';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { themeMode, setThemeMode, darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { appTitle, setAppTitle } = useAppTitle();
  const { logoUrl, isLogoEnabled, setLogoUrl, setIsLogoEnabled, resetToDefault, getCurrentLogo } = useLogo();
  
  usePageTitle({ pageTitle: t('page_settings') });
  const [tempAppTitle, setTempAppTitle] = useState(appTitle);
  const [tempLogoUrl, setTempLogoUrl] = useState('');
  const [tempLogoEnabled, setTempLogoEnabled] = useState(isLogoEnabled);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
    // Sync temp app title with current app title
    setTempAppTitle(appTitle);
    setTempLogoEnabled(isLogoEnabled);
    // Get the actual custom logo URL from localStorage
    if (typeof window !== 'undefined') {
      const savedLogoUrl = localStorage.getItem('app_logo_url');
      setTempLogoUrl(savedLogoUrl || '');
    }
  }, [appTitle, isLogoEnabled]);

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleThemeChange = (mode: 'auto' | 'light' | 'dark') => {
    setThemeMode(mode);
    // Show immediate feedback
    toast.success(`Theme changed to ${mode === 'auto' ? 'Auto' : mode === 'light' ? 'Light' : 'Dark'} mode`);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Save app title
    if (tempAppTitle.trim() && tempAppTitle !== appTitle) {
      setAppTitle(tempAppTitle.trim());
    }
    
    // Save logo settings
    setIsLogoEnabled(tempLogoEnabled);
    if (tempLogoUrl.trim()) {
      setLogoUrl(tempLogoUrl.trim());
    } else if (!tempLogoEnabled) {
      setLogoUrl(null);
    }
    
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Simulate API call
    setTimeout(() => {
      toast.success(t('settings_saved'));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('settings')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('manage_preferences')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title={t('application_settings')}>
          <div className="space-y-4">
            <div>
              <Input
                label={t('application_title')}
                value={tempAppTitle}
                onChange={(e) => setTempAppTitle(e.target.value)}
                placeholder={t('application_title')}
                className="max-w-md"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('application_title_description')}
              </p>
            </div>
          </div>
        </Card>

        <Card title={t('logo_settings')}>
          <div className="space-y-4">
            <div>
              <Switch
                checked={tempLogoEnabled}
                onChange={setTempLogoEnabled}
                label={t('enable_custom_logo')}
                className="mb-4"
              />
            </div>
            
            {tempLogoEnabled && (
              <div>
                <Input
                  label={t('logo_url')}
                  value={tempLogoUrl}
                  onChange={(e) => setTempLogoUrl(e.target.value)}
                  placeholder={t('logo_url_placeholder')}
                  className="max-w-md"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('logo_url_description')}
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('logo_preview')}
              </h4>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <img
                    src={tempLogoEnabled && tempLogoUrl ? tempLogoUrl : getCurrentLogo()}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/next.svg';
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempLogoUrl('');
                    setTempLogoEnabled(true);
                  }}
                  className="text-sm"
                >
                  {t('reset_to_default')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title={t('notification_settings')}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('email_notifications')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('receive_email_notifications')}</p>
              </div>
              <button
                type="button"
                className={`${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                onClick={() => handleToggle('emailNotifications')}
              >
                <span className="sr-only">Toggle email notifications</span>
                <span
                  className={`${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('marketing_emails')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('receive_marketing_emails')}</p>
              </div>
              <button
                type="button"
                className={`${settings.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                onClick={() => handleToggle('marketingEmails')}
              >
                <span className="sr-only">Toggle marketing emails</span>
                <span
                  className={`${settings.marketingEmails ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card title={t('appearance_settings')}>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Theme Mode</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  themeMode === 'dark'
                    ? 'bg-gray-800 text-white dark:bg-gray-700'
                    : themeMode === 'light'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {themeMode === 'auto' ? 'AUTO' : themeMode === 'light' ? 'LIGHT' : 'DARK'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred theme or let the system decide</p>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Auto Mode */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('auto')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    themeMode === 'auto'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-gray-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Auto</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Follow system</span>
                  </div>
                </button>
                
                {/* Light Mode */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    themeMode === 'light'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Always light</span>
                  </div>
                </button>
                
                {/* Dark Mode */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    themeMode === 'dark'
                      ? 'border-gray-700 bg-gray-100 dark:bg-gray-700 dark:border-gray-500'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Always dark</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('language')}
              </label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
                <option value="chinese">Chinese</option>
                <option value="indonesian">Indonesian</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            isLoading={isLoading}
          >
            {t('save_settings')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Ekspor komponen dengan pemeriksaan izin
export default withPermission({
  permission: Permission.VIEW_SETTINGS,
  redirectTo: '/dashboard'
})(SettingsPage);
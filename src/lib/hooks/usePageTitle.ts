import { useEffect } from 'react';
import { useAppTitle } from '@/components/AppTitleProvider';
import { useLanguage } from '@/components/LanguageProvider';

interface PageTitleOptions {
  pageTitle: string;
  includeAppName?: boolean;
  separator?: string;
}

export function usePageTitle({ pageTitle, includeAppName = true, separator = ' - ' }: PageTitleOptions) {
  const { appTitle } = useAppTitle();
  const { t } = useLanguage();

  useEffect(() => {
    let title = pageTitle;
    
    if (includeAppName) {
      title = `${pageTitle}${separator}${appTitle}`;
    }
    
    document.title = title;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = appTitle;
    };
  }, [pageTitle, appTitle, includeAppName, separator]);
}

// Helper function to get translated page titles
export function getPageTitle(key: string, t: (key: string) => string): string {
  return t(key);
}
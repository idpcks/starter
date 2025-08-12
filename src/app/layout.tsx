import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { AppTitleProvider } from '@/components/AppTitleProvider';
import { LogoProvider } from '@/components/LogoProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS Starter Kit',
  description: 'A complete starter kit for NextJS applications with authentication, dashboard, and user management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundaryWrapper>
          <SessionProvider>
            <LanguageProvider>
              <AppTitleProvider>
                <LogoProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </LogoProvider>
              </AppTitleProvider>
            </LanguageProvider>
          </SessionProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}

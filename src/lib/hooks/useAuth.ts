'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error('SignIn error:', result.error);
        toast.error('Invalid email or password');
        return false;
      }

      if (result?.ok) {
        // Force session update
        try {
          await update();
        } catch (updateError) {
          console.error('Session update error:', updateError);
          // Continue with login even if update fails
        }
        toast.success('Login successful!');
        router.push('/dashboard');
        router.refresh();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      router.push('/login');
    }
  };

  // Handle session errors and retry logic
  useEffect(() => {
    if (status === 'unauthenticated' && session === null) {
      // Session is invalid, redirect to login
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [status, session, router]);

  // Retry session update on ClientFetchError
  useEffect(() => {
    if (status === 'loading' && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        if (status === 'loading') {
          console.log('Retrying session update...', retryCount + 1);
          setRetryCount(prev => prev + 1);
          update().catch(error => {
            console.error('Session update retry failed:', error);
          });
        }
      }, 2000 * (retryCount + 1)); // Exponential backoff

      return () => clearTimeout(retryTimer);
    }
  }, [status, retryCount, update]);

  // Reset retry count on successful authentication
  useEffect(() => {
    if (status === 'authenticated') {
      setRetryCount(0);
    }
  }, [status]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    login,
    logout,
    update,
    retryCount,
  };
}
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useLanguage } from '@/components/LanguageProvider';
import { useLogo } from '@/components/LogoProvider';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { t } = useLanguage();
  const { getCurrentLogo } = useLogo();
  
  usePageTitle({ pageTitle: t('page_login') });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError('Invalid email or password');
        toast.error('Login failed. Please check your credentials.');
      } else if (result?.ok) {
        toast.success('Login successful!');
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(decodeURIComponent(callbackUrl));
        router.refresh();
      } else {
        setError('An unexpected error occurred');
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image src={getCurrentLogo()} alt="Logo" width={64} height={64} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              go back to home
            </Link>
          </p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')} 
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              label="Email Address"
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Sign in
            </Button>
          </div>

          <div className="text-center text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-blue-700 dark:text-blue-400">
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
                <p><strong>Manager:</strong> manager@example.com / manager123</p>
                <p><strong>User:</strong> user@example.com / user123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
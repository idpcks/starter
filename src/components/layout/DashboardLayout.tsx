'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { FiMenu, FiX, FiHome, FiUsers, FiSettings, FiLogOut, FiUser, FiShield, FiKey } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PermissionCheck } from '@/components/auth/PermissionCheck';
import { Permission } from '@/types/permission';
import { Role } from '@/types/auth';
import { useLanguage } from '@/components/LanguageProvider';
import { useAppTitle } from '@/components/AppTitleProvider';
import { useLogo } from '@/components/LogoProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const { appTitle } = useAppTitle();
  const { getCurrentLogo } = useLogo();

  const isAdmin = session?.user?.role === 'ADMIN';

  const navigation = [
    { 
      name: t('dashboard'), 
      href: '/dashboard', 
      icon: FiHome,
      permission: Permission.VIEW_DASHBOARD 
    },
    { 
      name: t('profile'), 
      href: '/profile', 
      icon: FiUser,
      permission: Permission.VIEW_PROFILE 
    },
    { 
      name: t('users'), 
      href: '/users', 
      icon: FiUsers,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: t('permissions'), 
      href: '/permissions', 
      icon: FiShield,
      permission: Permission.MANAGE_PERMISSIONS 
    },
    { 
      name: t('role_permissions'), 
      href: '/role-permissions', 
      icon: FiKey,
      permission: Permission.MANAGE_PERMISSIONS 
    },
    { 
      name: t('admin'), 
      href: '/admin', 
      icon: FiShield,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: t('settings'), 
      href: '/settings', 
      icon: FiSettings,
      permission: Permission.VIEW_SETTINGS 
    },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-gray-600 dark:bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar */}
        <div className={`relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 pt-5 pb-4 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/dashboard" className="flex items-center">
                <Image src={getCurrentLogo()} alt="Logo" width={32} height={32} />
                <span className="ml-2 text-xl font-bold dark:text-white">{appTitle}</span>
              </Link>
          </div>
          
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <PermissionCheck key={item.name} permission={item.permission}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      <item.icon className={`mr-4 h-6 w-6 flex-shrink-0 ${isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`} />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              >
                <FiLogOut className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                {t('sign_out')}
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/dashboard" className="flex items-center">
                <Image src={getCurrentLogo()} alt="Logo" width={32} height={32} />
                <span className="ml-2 text-xl font-bold dark:text-white">{appTitle}</span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white dark:bg-gray-800 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <PermissionCheck key={item.name} permission={item.permission}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      <item.icon className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}`} />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              >
                <FiLogOut className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
                {t('sign_out')}
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
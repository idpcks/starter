'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { FiMenu, FiX, FiHome, FiUsers, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PermissionCheck } from '@/components/auth/PermissionCheck';
import { Permission } from '@/types/permission';
import { Role } from '@/types/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === ('admin' as Role);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: FiHome,
      permission: Permission.VIEW_DASHBOARD 
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: FiUser,
      permission: Permission.VIEW_PROFILE 
    },
    { 
      name: 'User Management', 
      href: '/users', 
      icon: FiUsers,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: 'Permissions', 
      href: '/permissions', 
      icon: FiUsers,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: 'Role Permissions', 
      href: '/role-permissions', 
      icon: FiUsers,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: 'Admin', 
      href: '/admin', 
      icon: FiUsers,
      permission: Permission.MANAGE_USERS 
    },
    { 
      name: 'Settings', 
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
    <div className="min-h-screen bg-gray-100">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar */}
        <div className={`relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              <Image src="/next.svg" alt="Logo" width={32} height={32} />
              <span className="ml-2 text-xl font-bold">NextJS Starter</span>
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
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <item.icon className={`mr-4 h-6 w-6 flex-shrink-0 ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <FiLogOut className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/dashboard" className="flex items-center">
                <Image src="/next.svg" alt="Logo" width={32} height={32} />
                <span className="ml-2 text-xl font-bold">NextJS Starter</span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <PermissionCheck key={item.name} permission={item.permission}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <item.icon className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.name}
                    </Link>
                  </PermissionCheck>
                );
              })}
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <FiLogOut className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                Sign Out
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
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
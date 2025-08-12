'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/types/permission';
import { Role } from '@/types/auth';
import Card from '@/components/ui/Card';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Admin dashboard page with client-side permission checking
 */
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  
  usePageTitle({ pageTitle: t('page_admin') });
  
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  
  // Simulasi data admin
  const adminData = {
    stats: {
      totalUsers: 25,
      activeUsers: 18,
      inactiveUsers: 7
    },
    recentActions: [
      { id: 1, action: 'User created', user: 'admin', timestamp: '2023-06-15T10:30:00Z' },
      { id: 2, action: 'Permission updated', user: 'admin', timestamp: '2023-06-14T14:45:00Z' },
      { id: 3, action: 'User deleted', user: 'admin', timestamp: '2023-06-13T09:15:00Z' },
    ]
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Advanced administration tools and statistics
        </p>
      </div>
      
      {/* Quick Navigation */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Database Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage PostgreSQL database connection and schema</p>
            <a
              href="/admin/database"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Database
            </a>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create, edit, and manage system users</p>
            <a
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Manage Users
            </a>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Permissions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Configure role-based permissions</p>
            <a
              href="/permissions"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Manage Permissions
            </a>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">System Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Configure application settings</p>
            <button
              disabled
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{adminData.stats.totalUsers}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Users</h3>
            <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{adminData.stats.activeUsers}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inactive Users</h3>
            <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{adminData.stats.inactiveUsers}</p>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card title="Recent Admin Actions">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminData.recentActions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {action.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {action.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(action.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
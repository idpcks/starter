'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/types/permission';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useLanguage } from '@/components/LanguageProvider';

interface DatabaseStatus {
  success: boolean;
  message: string;
  timestamp?: string;
  tables?: string[];
  error?: string;
  details?: string;
}

export default function DatabasePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  
  usePageTitle({ pageTitle: t('page_database') });
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/db/init');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error checking database status:', error);
      setStatus({
        success: false,
        message: 'Failed to check database status',
        error: 'Connection error'
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/db/init', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Database initialized successfully!');
        await checkDatabaseStatus();
      } else {
        toast.error(data.error || 'Failed to initialize database');
        setStatus(data);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database');
    } finally {
      setInitializing(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
          <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard permission={Permission.DATABASE_MANAGE}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Management</h1>
          <p className="text-gray-600">Manage PostgreSQL database connection and schema</p>
        </div>

        <div className="grid gap-6">
          {/* Database Status Card */}
          <Card title="Database Status">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Checking database status...</span>
                </div>
              ) : status ? (
                <div className="space-y-4">
                  <Alert
                    type={status.success ? 'success' : 'error'}
                    title={status.success ? 'Database Connected' : 'Database Error'}
                    message={status.message}
                  />
                  
                  {status.success && status.timestamp && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Connection Details</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Last Check:</strong> {new Date(status.timestamp).toLocaleString()}
                      </p>
                      {status.tables && status.tables.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Tables ({status.tables.length}):</strong>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {status.tables.map((table) => (
                              <span
                                key={table}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                              >
                                {table}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!status.success && status.details && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Error Details</h3>
                      <p className="text-sm text-red-600 dark:text-red-400">{status.details}</p>
                    </div>
                  )}
                </div>
              ) : (
                <Alert
                  type="warning"
                  title="No Status Available"
                  message="Unable to retrieve database status"
                />
              )}
              
              <div className="flex gap-4">
                <Button
                  onClick={checkDatabaseStatus}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Checking...' : 'Refresh Status'}
                </Button>
                
                <Button
                  onClick={initializeDatabase}
                  disabled={initializing || loading}
                  variant="primary"
                >
                  {initializing ? 'Initializing...' : 'Initialize Database'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Database Configuration Card */}
          <Card title="Database Configuration">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Environment Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">DB_HOST:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_DB_HOST || 'localhost'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">DB_PORT:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_DB_PORT || '5432'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">DB_NAME:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_DB_NAME || 'starter_db'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">DB_USER:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_DB_USER || 'postgres'}</span>
                  </div>
                </div>
              </div>
              
              <Alert
                type="info"
                title="Configuration Note"
                message="Database configuration is loaded from environment variables. Make sure your .env.local file is properly configured."
              />
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => router.push('/admin/users')}
                variant="outline"
                fullWidth
              >
                Manage Users
              </Button>
              
              <Button
                onClick={() => router.push('/admin/permissions')}
                variant="outline"
                fullWidth
              >
                Manage Permissions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}
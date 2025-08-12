import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { checkPermission } from '@/utils/server-permissions';
import { Permission } from '@/types/permission';
import { Role } from '@/types/auth';
import Card from '@/components/ui/Card';

/**
 * Contoh server component yang menggunakan pemeriksaan izin server-side
 */
export default async function AdminPage() {
  // Periksa sesi dan izin di server-side
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  // Periksa izin khusus
  const hasAccess = await checkPermission(Permission.MANAGE_USERS);
  
  if (!hasAccess) {
    redirect('/dashboard');
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
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Advanced administration tools and statistics
        </p>
      </div>
      
      {/* Quick Navigation */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Database Management</h3>
            <p className="text-sm text-gray-500 mb-4">Manage PostgreSQL database connection and schema</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-500 mb-4">Create, edit, and manage system users</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Permissions</h3>
            <p className="text-sm text-gray-500 mb-4">Configure role-based permissions</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Configure application settings</p>
            <button
              disabled
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{adminData.stats.totalUsers}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Active Users</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{adminData.stats.activeUsers}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Inactive Users</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{adminData.stats.inactiveUsers}</p>
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
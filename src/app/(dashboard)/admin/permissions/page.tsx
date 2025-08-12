'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Alert from '@/components/ui/Alert';
import { Permission, ROLE_PERMISSIONS } from '@/types/permission';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Role } from '@/types/auth';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useLanguage } from '@/components/LanguageProvider';

export default function AdminPermissionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  
  usePageTitle({ pageTitle: 'Admin Permissions' });
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, Permission[]>>({} as Record<Role, Permission[]>);
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading data
  useEffect(() => {
    setIsMounted(true);
    
    // Dalam aplikasi nyata, ini akan mengambil data dari API
    const loadData = () => {
      try {
        setRoles(Object.keys(ROLE_PERMISSIONS) as Role[]);
        setPermissions(Object.values(Permission));
        setRolePermissions(ROLE_PERMISSIONS);
        setSelectedRole((Object.keys(ROLE_PERMISSIONS)[0] as Role) || '');
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load permissions data');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Fungsi untuk mengubah izin untuk peran tertentu
  const togglePermission = (permission: Permission) => {
    if (!selectedRole) return;

    setRolePermissions(prev => {
      const currentPermissions = prev[selectedRole] || [];
      const hasPermission = currentPermissions.includes(permission);
      
      const newPermissions = hasPermission
        ? currentPermissions.filter(p => p !== permission)
        : [...currentPermissions, permission];

      return {
        ...prev,
        [selectedRole]: newPermissions
      };
    });

    toast.success(`Permission ${permission} ${rolePermissions[selectedRole]?.includes(permission) ? 'removed from' : 'added to'} ${selectedRole}`);
  };

  const saveChanges = async () => {
    try {
      // Dalam aplikasi nyata, ini akan mengirim data ke API
      // const response = await fetch('/api/permissions', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(rolePermissions)
      // });
      
      toast.success('Permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  // Prevent hydration mismatch by not rendering translated content until mounted
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading permissions...</div>
      </div>
    );
  }



  return (
    <PermissionGuard permission={Permission.PERMISSIONS_WRITE}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Permissions Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage role-based permissions for the system</p>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <Card title="Select Role">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a role...</option>
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Permissions Table */}
          {selectedRole && (
            <Card title={`Permissions for ${selectedRole}`}>
              <div className="space-y-4">
                <Table
                  data={permissions.map((permission, index) => ({ id: index, permission }))}
                  columns={[
                    {
                      header: 'Permission',
                      accessor: (item: { id: number; permission: Permission }) => (
                        <span className="font-medium">{item.permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                      )
                    },
                    {
                      header: 'Status',
                      accessor: (item: { id: number; permission: Permission }) => {
                        const hasPermission = selectedRole && rolePermissions[selectedRole]?.includes(item.permission);
                        return (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            hasPermission 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {hasPermission ? 'Granted' : 'Denied'}
                          </span>
                        );
                      }
                    },
                    {
                      header: 'Action',
                      accessor: (item: { id: number; permission: Permission }) => (
                        <Button
                          size="sm"
                          variant={selectedRole && rolePermissions[selectedRole]?.includes(item.permission) ? 'danger' : 'primary'}
                          onClick={() => togglePermission(item.permission)}
                        >
                          {selectedRole && rolePermissions[selectedRole]?.includes(item.permission) ? 'Revoke' : 'Grant'}
                        </Button>
                      )
                    }
                  ]}
                  keyField="id"
                  emptyMessage="No permissions available"
                />
                
                <div className="flex justify-end">
                  <Button onClick={saveChanges} variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Current Role Summary */}
          {selectedRole && (
            <Card title="Role Summary">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedRole} Permissions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {rolePermissions[selectedRole]?.map(permission => (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )) || []}
                  </div>
                  {(!rolePermissions[selectedRole] || rolePermissions[selectedRole].length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400 italic">No permissions assigned to this role.</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}
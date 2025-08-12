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

export default function PermissionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, Permission[]>>({} as Record<Role, Permission[]>);
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading data
  useEffect(() => {
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

    const updatedPermissions = { ...rolePermissions };
    const currentPermissions = updatedPermissions[selectedRole] || [];

    if (currentPermissions.includes(permission)) {
      // Hapus izin jika sudah ada
      updatedPermissions[selectedRole] = currentPermissions.filter(p => p !== permission);
    } else {
      // Tambahkan izin jika belum ada
      updatedPermissions[selectedRole] = [...currentPermissions, permission];
    }

    setRolePermissions(updatedPermissions);
  };

  // Fungsi untuk menyimpan perubahan
  const saveChanges = () => {
    // Dalam aplikasi nyata, ini akan mengirim data ke API
    toast.success(`Permissions updated for ${selectedRole} role`);
    // Simulasi penyimpanan ke database
    console.log('Saving permissions:', rolePermissions);
  };

  // Redirect non-admin users


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <PermissionGuard permission={Permission.MANAGE_PERMISSIONS} fallback={<Alert type="error" title="Access Denied" message="You don't have permission to access this page" />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions Management</h1>
        </div>

        <Card>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {selectedRole && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => {
                    const hasPermission = rolePermissions[selectedRole]?.includes(permission) || false;
                    return (
                      <tr key={permission}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <button
                              onClick={() => togglePermission(permission)}
                              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${hasPermission ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                              <span className="sr-only">Toggle permission</span>
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${hasPermission ? 'translate-x-5' : 'translate-x-0'}`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={saveChanges} variant="primary">
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Permission, ROLE_PERMISSIONS, Role } from '@/types/permission';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default function RolePermissionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('USER');
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);
  
  // Initialize permissions
  useEffect(() => {
    // Get all available permissions
    const permissionValues = Object.values(Permission);
    setAllPermissions(permissionValues);
    
    // Set initial role permissions
    setRolePermissions(ROLE_PERMISSIONS[selectedRole] || []);
  }, [selectedRole]);
  
  // Handle role change
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setRolePermissions(ROLE_PERMISSIONS[role] || []);
  };
  
  // Toggle permission for selected role
  const togglePermission = (permission: Permission) => {
    setRolePermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };
  
  // Save changes (in a real app, this would update the backend)
  const saveChanges = () => {
    // Here you would make an API call to update permissions
    alert(`Permissions for ${selectedRole} role updated!`);
    // For demo purposes, we're just showing an alert
  };
  
  return (
    <PermissionGuard permission={Permission.MANAGE_USERS} fallback={<div>You don't have permission to access this page</div>}>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Role Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage permissions for different user roles
          </p>
        </div>
        
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Select Role</h2>
            <div className="flex space-x-4">
              <Button 
                onClick={() => handleRoleChange('ADMIN')}
                variant={selectedRole === 'ADMIN' ? 'primary' : 'outline'}
              >
                Admin
              </Button>
              <Button 
                onClick={() => handleRoleChange('MANAGER')}
                variant={selectedRole === 'MANAGER' ? 'primary' : 'outline'}
              >
                Manager
              </Button>
              <Button 
                onClick={() => handleRoleChange('USER')}
                variant={selectedRole === 'USER' ? 'primary' : 'outline'}
              >
                User
              </Button>
              <Button 
                onClick={() => handleRoleChange('GUEST')}
                variant={selectedRole === 'GUEST' ? 'primary' : 'outline'}
              >
                Guest
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Permissions for {selectedRole}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPermissions.map(permission => (
                <div key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permission}
                    checked={rolePermissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={permission} className="ml-2 block text-sm text-gray-900">
                    {permission}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={saveChanges} variant="primary">
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}
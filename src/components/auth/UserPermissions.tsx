'use client';

import { usePermission } from '@/lib/hooks/usePermission';
import { Permission } from '@/types/permission';

type UserPermissionsProps = {
  className?: string;
};

/**
 * Komponen untuk menampilkan daftar izin pengguna
 */
export function UserPermissions({ className = '' }: UserPermissionsProps) {
  const { getUserPermissions } = usePermission();
  const permissions = getUserPermissions();

  // Format nama izin untuk tampilan yang lebih baik
  const formatPermissionName = (permission: string): string => {
    return permission
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (!permissions.length) {
    return (
      <div className={`mt-4 ${className}`}>
        <h3 className="text-lg font-medium">Your Permissions</h3>
        <p className="text-gray-500 mt-2">No permissions assigned.</p>
      </div>
    );
  }

  return (
    <div className={`mt-4 ${className}`}>
      <h3 className="text-lg font-medium">Your Permissions</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {permissions.map((permission) => (
          <span
            key={permission}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          >
            {formatPermissionName(permission)}
          </span>
        ))}
      </div>
    </div>
  );
}
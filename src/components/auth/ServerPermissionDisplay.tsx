import { getUserPermissions } from '@/utils/server-permissions';

/**
 * Komponen server untuk menampilkan izin pengguna
 */
export default async function ServerPermissionDisplay() {
  // Dapatkan izin pengguna dari server-side
  const permissions = await getUserPermissions();
  
  if (permissions.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">No permissions assigned</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Your Server-Side Permissions</h3>
      <div className="flex flex-wrap gap-2">
        {permissions.map((permission) => (
          <span 
            key={permission} 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
}
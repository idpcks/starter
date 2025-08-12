import { auth } from '@/auth';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/types/permission';
import { Role } from '@/types/auth';

/**
 * Utility untuk memeriksa izin pengguna di server-side
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  
  const userRole = session.user.role as Role;
  return hasPermission(userRole, permission);
}

/**
 * Utility untuk memeriksa apakah pengguna memiliki salah satu izin yang ditentukan di server-side
 */
export async function checkAnyPermission(permissions: Permission[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  
  const userRole = session.user.role as Role;
  return hasAnyPermission(userRole, permissions);
}

/**
 * Utility untuk memeriksa apakah pengguna memiliki semua izin yang ditentukan di server-side
 */
export async function checkAllPermissions(permissions: Permission[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  
  const userRole = session.user.role as Role;
  return hasAllPermissions(userRole, permissions);
}

/**
 * Utility untuk mendapatkan semua izin pengguna di server-side
 */
export async function getUserPermissions(): Promise<Permission[]> {
  const session = await auth();
  return session?.user?.permissions || [];
}
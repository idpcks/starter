'use client';

import { ReactNode } from 'react';
import { usePermission } from '@/lib/hooks/usePermission';
import { Permission } from '@/types/permission';

type PermissionGuardProps = {
  /**
   * Izin yang diperlukan untuk mengakses konten
   */
  permission?: Permission;
  
  /**
   * Daftar izin yang diperlukan (salah satu)
   */
  anyPermissions?: Permission[];
  
  /**
   * Daftar izin yang diperlukan (semua)
   */
  allPermissions?: Permission[];
  
  /**
   * Konten yang akan ditampilkan jika pengguna memiliki izin
   */
  children: ReactNode;
  
  /**
   * Konten yang akan ditampilkan jika pengguna tidak memiliki izin
   */
  fallback?: ReactNode;
};

/**
 * Komponen untuk membatasi akses ke konten berdasarkan izin pengguna
 */
export function PermissionGuard({
  permission,
  anyPermissions,
  allPermissions,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermission();
  
  // Periksa izin
  let hasAccess = true;
  
  if (permission) {
    hasAccess = can(permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = canAny(anyPermissions);
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = canAll(allPermissions);
  }
  
  // Tampilkan konten jika pengguna memiliki izin
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
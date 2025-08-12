'use client';

import { ReactNode } from 'react';
import { usePermission } from '@/lib/hooks/usePermission';
import { Permission } from '@/types/permission';

type PermissionCheckProps = {
  /**
   * Izin yang diperlukan untuk menampilkan konten
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
};

/**
 * Komponen untuk menampilkan atau menyembunyikan elemen UI berdasarkan izin pengguna
 */
export function PermissionCheck({
  permission,
  anyPermissions,
  allPermissions,
  children,
}: PermissionCheckProps) {
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
  
  // Tampilkan konten hanya jika pengguna memiliki izin
  return hasAccess ? <>{children}</> : null;
}
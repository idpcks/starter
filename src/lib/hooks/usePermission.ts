'use client';

import { useSession } from 'next-auth/react';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/types/permission';
import { Role } from '@/types/auth';

/**
 * Hook untuk memeriksa izin pengguna
 */
export function usePermission() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role || '') as Role;
  
  return {
    /**
     * Memeriksa apakah pengguna memiliki izin tertentu
     */
    can: (permission: Permission): boolean => {
      return hasPermission(userRole, permission);
    },
    
    /**
     * Memeriksa apakah pengguna memiliki salah satu dari izin yang ditentukan
     */
    canAny: (permissions: Permission[]): boolean => {
      return hasAnyPermission(userRole, permissions);
    },
    
    /**
     * Memeriksa apakah pengguna memiliki semua izin yang ditentukan
     */
    canAll: (permissions: Permission[]): boolean => {
      return hasAllPermissions(userRole, permissions);
    },
    
    /**
     * Mendapatkan semua izin pengguna
     */
    getUserPermissions: (): Permission[] => {
      return session?.user?.permissions || [];
    }
  };
}
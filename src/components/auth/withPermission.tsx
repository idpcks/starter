'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/lib/hooks/usePermission';
import { Permission } from '@/types/permission';
import Alert from '@/components/ui/Alert';

type WithPermissionProps = {
  /**
   * Izin yang diperlukan untuk mengakses komponen
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
   * Redirect ke halaman ini jika tidak memiliki izin
   */
  redirectTo?: string;
  
  /**
   * Tampilkan pesan error jika tidak memiliki izin dan tidak redirect
   */
  showError?: boolean;
};

/**
 * Higher Order Component untuk membatasi akses ke komponen berdasarkan izin pengguna
 */
export function withPermission<P extends object>({
  permission,
  anyPermissions,
  allPermissions,
  redirectTo = '/dashboard',
  showError = true,
}: WithPermissionProps) {
  return function WithPermissionComponent(Component: ComponentType<P>) {
    function WrappedComponent(props: P) {
      const { can, canAny, canAll } = usePermission();
      const router = useRouter();
      
      // Periksa izin
      let hasAccess = true;
      
      if (permission) {
        hasAccess = can(permission);
      } else if (anyPermissions && anyPermissions.length > 0) {
        hasAccess = canAny(anyPermissions);
      } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = canAll(allPermissions);
      }
      
      // Redirect jika tidak memiliki izin
      useEffect(() => {
        if (!hasAccess && redirectTo) {
          router.push(redirectTo);
        }
      }, [hasAccess, router]);
      
      // Tampilkan komponen jika memiliki izin
      if (!hasAccess) {
        if (showError && !redirectTo) {
          return (
            <Alert 
              type="error" 
              title="Access Denied" 
              message="You don't have permission to access this resource" 
            />
          );
        }
        return null;
      }
      
      return <Component {...props} />;
    }
    
    // Menyalin nama tampilan untuk debugging
    const displayName = Component.displayName || Component.name || 'Component';
    WrappedComponent.displayName = `withPermission(${displayName})`;
    
    return WrappedComponent;
  };
}
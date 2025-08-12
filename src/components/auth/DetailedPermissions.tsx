'use client';

import { useState } from 'react';
import { usePermission } from '@/lib/hooks/usePermission';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DetailedPermissions() {
  const { getUserPermissions } = usePermission();
  const [showDetails, setShowDetails] = useState(false);
  const permissions = getUserPermissions();
  
  // Group permissions by category
  const permissionCategories = {
    View: permissions.filter(p => p.startsWith('VIEW_')),
    Manage: permissions.filter(p => p.startsWith('MANAGE_')),
    Create: permissions.filter(p => p.startsWith('CREATE_')),
    Edit: permissions.filter(p => p.startsWith('EDIT_')),
    Delete: permissions.filter(p => p.startsWith('DELETE_')),
    Other: permissions.filter(p => 
      !p.startsWith('VIEW_') && 
      !p.startsWith('MANAGE_') && 
      !p.startsWith('CREATE_') && 
      !p.startsWith('EDIT_') && 
      !p.startsWith('DELETE_')
    )
  };
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Permissions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      
      {!showDetails ? (
        <div className="flex flex-wrap gap-2">
          {permissions.map(permission => (
            <span 
              key={permission} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {permission}
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(permissionCategories).map(([category, perms]) => {
            if (perms.length === 0) return null;
            
            return (
              <div key={category}>
                <h4 className="text-md font-medium mb-2">{category} Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {perms.map(permission => (
                    <span 
                      key={permission} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
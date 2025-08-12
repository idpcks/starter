// Define Role type here to avoid circular imports
export type Role = 'ADMIN' | 'USER' | 'MANAGER' | 'GUEST';

export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  
  // Content permissions
  VIEW_DASHBOARD = 'view_dashboard',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  
  // Database permissions
  USERS_READ = 'users.read',
  USERS_WRITE = 'users.write',
  DATABASE_MANAGE = 'database.manage',
  
  // Settings permissions
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',
}

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    // Admin has all permissions
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SETTINGS,
    Permission.USERS_READ,
    Permission.USERS_WRITE,
    Permission.DATABASE_MANAGE,
  ],
  MANAGER: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.USERS_READ,
    Permission.VIEW_SETTINGS,
  ],
  USER: [
    // Regular user has limited permissions
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_SETTINGS,
  ],
  GUEST: [
    // Guest has no permissions
  ],
};

// Helper function to check if a user has a specific permission
export function hasPermission(userRole: Role, permission: Permission): boolean {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  
  return permissions.some(permission => ROLE_PERMISSIONS[userRole].includes(permission));
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  
  return permissions.every(permission => ROLE_PERMISSIONS[userRole].includes(permission));
}
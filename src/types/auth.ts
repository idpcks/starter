import { DefaultSession } from 'next-auth';
import { Permission, Role } from './permission';

// Re-export Role for use in other modules
export type { Role };

// Extend next-auth session type
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    permissions?: Permission[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      permissions?: Permission[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    permissions?: Permission[];
  }
}

// Define user profile type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
  permissions?: Permission[];
}
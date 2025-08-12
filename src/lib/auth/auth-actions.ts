'use server';

import { compare } from 'bcryptjs';
import { userQueries } from '../database/queries';
import { Permission, ROLE_PERMISSIONS, Role } from '@/types/permission';

/**
 * Server action untuk autentikasi pengguna
 * Digunakan untuk memisahkan logika database dari client-side
 */
export async function authenticateUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return null;
    }

    const user = await userQueries.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Get permissions based on user role
    const permissions = ROLE_PERMISSIONS[user.role as Role] || [];
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      image: user.image,
      permissions: permissions
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
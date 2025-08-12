import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { Permission, ROLE_PERMISSIONS, Role } from '@/types/permission';
import { authConfig } from './config';
// import PostgresAdapter from '@auth/pg-adapter';
// import { pool } from '../db';
import { userQueries } from '../database/queries';

// PostgreSQL database is now used for user management

export const authOptions: NextAuthConfig = {
  // Remove adapter when using credentials provider
  // adapter: PostgresAdapter(pool),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await userQueries.findByEmail(credentials.email);
          
          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(credentials.password as string, user.password);

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
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user && account) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as Permission[];
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: authConfig.secret,
  debug: authConfig.debug,
  trustHost: true,
  useSecureCookies: false, // Set to false for development
};
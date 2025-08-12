export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  debug: process.env.NODE_ENV === 'development',
  // Additional NextAuth v5 specific settings
  basePath: '/api/auth',
  // Cookie settings for development
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

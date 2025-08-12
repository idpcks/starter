# Setup Guide

## Environment Variables

To fix the authentication errors, you need to create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Other environment variables
NODE_ENV=development
```

## Steps to Fix the Errors

1. **Create `.env.local` file** in your project root with the content above
2. **Restart your development server** after adding the environment variables
3. **Clear browser cache and cookies** for localhost:3000
4. **Clear Next.js cache** by deleting the `.next` folder and restarting

## What Was Fixed

1. **Circular Import Issues**: Fixed circular dependencies between auth and permission types
2. **NextAuth v5 Compatibility**: Updated imports and types for NextAuth v5 beta
3. **Error Handling**: Added proper error handling in auth callbacks and API routes
4. **Type Safety**: Fixed TypeScript type issues and improved type definitions
5. **Session Management**: Improved session handling and error recovery
6. **ClientFetchError Fixes**: 
   - Disabled auto-refetch in SessionProvider
   - Added error boundaries for graceful error handling
   - Implemented retry logic for session updates
   - Fixed NextAuth v5 configuration issues
   - Added proper cookie and security settings

## Testing

After setup, you can test with these demo credentials:

- **Admin**: admin@example.com / password123
- **User**: user@example.com / password123

## Common Issues

- If you still get JSON parsing errors, make sure to restart your dev server
- Clear browser cache and cookies for the domain
- Check that the `.env.local` file is in the project root (not in src/)
- Ensure the NEXTAUTH_SECRET is at least 32 characters long
- If ClientFetchError persists, try clearing Next.js cache (delete .next folder)

## Troubleshooting ClientFetchError

The ClientFetchError is typically caused by:
1. **Missing environment variables** - Ensure NEXTAUTH_SECRET and NEXTAUTH_URL are set
2. **Session provider issues** - Auto-refetch has been disabled to prevent this
3. **Cookie/session issues** - Development mode uses non-secure cookies
4. **Network issues** - Added retry logic and error boundaries

## Additional Notes

- The app now includes error boundaries to catch and handle authentication errors gracefully
- Session updates include retry logic with exponential backoff
- Development mode uses non-secure cookies for better compatibility
- Next.js config has been optimized for NextAuth compatibility

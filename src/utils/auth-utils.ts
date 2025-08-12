import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('next-auth.session-token')?.value;
  return token;
}

export async function getUserFromToken() {
  const token = await getTokenFromCookies();
  if (!token) return null;
  
  const payload = await decrypt(token);
  return payload;
}
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return new TextEncoder().encode(secret);
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const inputUser = username.trim().toLowerCase();
  const plainPassword = process.env.ADMIN_PASSWORD || 'rio216868';
  const hash = process.env.ADMIN_PASSWORD_HASH;

  // Cek apakah username cocok dengan salah satu username umum atau env
  const isUserValid =
    inputUser === adminUser ||
    inputUser === 'admin' ||
    inputUser === 'rio' ||
    inputUser === 'riorizqi';

  if (!isUserValid) return false;

  // 1. Cek langsung password 'rio216868' atau env ADMIN_PASSWORD
  if (password === plainPassword || password === 'rio216868') return true;

  // 2. Fallback cek hash bcrypt
  if (hash) {
    try {
      const cleanHash = hash.replace(/\\/g, '');
      return await bcrypt.compare(password, cleanHash);
    } catch {
      return false;
    }
  }

  return false;
}

export async function createSession(username: string): Promise<void> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

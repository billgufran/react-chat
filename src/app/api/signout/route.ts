import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (session) {
    try {
      const decoded = await adminAuth.verifySessionCookie(session, true);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // ignore
    }
  }

  const res = NextResponse.json({ status: 'signed-out' });
  const isProd = process.env.NODE_ENV === 'production';
  res.headers.append(
    'Set-Cookie',
    `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${isProd ? 'Secure;' : ''}`.trim()
  );
  return res;
}


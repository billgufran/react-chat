import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // Max 14 days per Firebase docs
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const isProd = process.env.NODE_ENV === 'production';
    const res = NextResponse.json({ status: 'ok' });
    res.headers.append(
      'Set-Cookie',
      [
        `session=${sessionCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expiresIn / 1000}; ${isProd ? 'Secure;' : ''}`.trim(),
      ].join(', ')
    );
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create session', e }, { status: 401 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!user) {
    return NextResponse.json({ error: 'Unknown user.' }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, userId, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  return res;
}

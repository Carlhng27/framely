import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getDb } from '@/lib/db';
import { toggleLike } from '@/lib/queries';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const me = getCurrentUser();
  const db = getDb();
  const exists = db.prepare('SELECT 1 FROM posts WHERE id = ?').get(params.id);
  if (!exists) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }
  const liked = toggleLike(params.id, me.id);
  const likeCount = (db.prepare('SELECT COUNT(*) as c FROM likes WHERE post_id = ?').get(params.id) as { c: number }).c;
  return NextResponse.json({ liked, likeCount });
}

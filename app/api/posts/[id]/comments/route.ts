import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getDb } from '@/lib/db';
import { addComment, listComments } from '@/lib/queries';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = getCurrentUser();
  const db = getDb();
  const exists = db.prepare('SELECT 1 FROM posts WHERE id = ?').get(params.id);
  if (!exists) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }
  const { body } = await req.json();
  const text = String(body || '').trim().slice(0, 500);
  if (!text) {
    return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 });
  }
  addComment(params.id, me.id, text);
  const comments = listComments(params.id);
  return NextResponse.json({ comments });
}

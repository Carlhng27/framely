import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/session';
import { createPost } from '@/lib/queries';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(req: NextRequest) {
  const me = getCurrentUser();
  const formData = await req.formData();
  const file = formData.get('image');
  const caption = String(formData.get('caption') || '').slice(0, 2000);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a photo first.' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'That image looks empty.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Images must be under 8MB.' }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Use a JPG, PNG, WEBP, or GIF image.' }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const id = createPost(me.id, `/uploads/${filename}`, caption);
  return NextResponse.json({ id });
}

import { getDb } from './db';
import type { Post, PostWithMeta, User, Comment } from './types';

function hydratePost(db: ReturnType<typeof getDb>, post: Post, viewerId: string): PostWithMeta {
  const author = db.prepare('SELECT * FROM users WHERE id = ?').get(post.user_id) as User;
  const like_count = (db.prepare('SELECT COUNT(*) as c FROM likes WHERE post_id = ?').get(post.id) as { c: number }).c;
  const comment_count = (db.prepare('SELECT COUNT(*) as c FROM comments WHERE post_id = ?').get(post.id) as { c: number }).c;
  const liked_by_me = !!db.prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?').get(post.id, viewerId);
  return { ...post, author, like_count, comment_count, liked_by_me };
}

export function listFeed(viewerId: string): PostWithMeta[] {
  const db = getDb();
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as Post[];
  return posts.map((p) => hydratePost(db, p, viewerId));
}

export function getPost(id: string, viewerId: string): PostWithMeta | null {
  const db = getDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
  if (!post) return null;
  return hydratePost(db, post, viewerId);
}

export function listComments(postId: string): Comment[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC')
    .all(postId) as (Comment & { user_id: string })[];
  return rows.map((c) => ({
    ...c,
    author: db.prepare('SELECT * FROM users WHERE id = ?').get(c.user_id) as User,
  }));
}

export function getUserByUsername(username: string): User | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined) ?? null;
}

export function listPostsByUser(userId: string, viewerId: string): PostWithMeta[] {
  const db = getDb();
  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Post[];
  return posts.map((p) => hydratePost(db, p, viewerId));
}

export function toggleLike(postId: string, userId: string): boolean {
  const db = getDb();
  const existing = db.prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?').get(postId, userId);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(postId, userId);
    return false;
  }
  db.prepare('INSERT INTO likes (post_id, user_id) VALUES (?, ?)').run(postId, userId);
  return true;
}

export function addComment(postId: string, userId: string, body: string) {
  const db = getDb();
  const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare('INSERT INTO comments (id, post_id, user_id, body) VALUES (?, ?, ?, ?)').run(id, postId, userId, body);
  return id;
}

export function createPost(userId: string, imageUrl: string, caption: string) {
  const db = getDb();
  const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  db.prepare('INSERT INTO posts (id, user_id, image_url, caption) VALUES (?, ?, ?, ?)').run(id, userId, imageUrl, caption);
  return id;
}

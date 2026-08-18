import { cookies } from 'next/headers';
import { getDb } from './db';
import type { User } from './types';

const COOKIE_NAME = 'framely_uid';

export function getCurrentUser(): User {
  const db = getDb();
  const uid = cookies().get(COOKIE_NAME)?.value;
  const found = uid ? (db.prepare('SELECT * FROM users WHERE id = ?').get(uid) as User | undefined) : undefined;
  if (found) return found;
  return db.prepare('SELECT * FROM users ORDER BY created_at ASC LIMIT 1').get() as User;
}

export function getAllUsers(): User[] {
  return getDb().prepare('SELECT * FROM users ORDER BY created_at ASC').all() as User[];
}

export const SESSION_COOKIE = COOKIE_NAME;

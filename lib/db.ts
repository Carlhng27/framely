import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || '/tmp/framely-data/framely.db';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __framelyDb: Database.Database | undefined;
}

function createConnection() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      avatar_color TEXT NOT NULL DEFAULT '#F1584C',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS likes (
      post_id TEXT NOT NULL REFERENCES posts(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
  `);
  return db;
}

export function getDb(): Database.Database {
  if (!global.__framelyDb) {
    global.__framelyDb = createConnection();
    seed(global.__framelyDb);
  }
  return global.__framelyDb;
}

function seed(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  if (count > 0) return;

  const users = [
    { id: 'u_mara', username: 'mara.light', display_name: 'Mara Light', bio: 'Golden hour chaser • film photography', avatar_color: '#F1584C' },
    { id: 'u_theo', username: 'theo.makes', display_name: 'Theo Makes', bio: 'Ceramicist. Coffee first, clay second.', avatar_color: '#2F6F68' },
    { id: 'u_ivy', username: 'ivy.on.foot', display_name: 'Ivy On Foot', bio: 'Slow travel, fast espresso.', avatar_color: '#E3A23C' },
  ];
  const insertUser = db.prepare(
    'INSERT INTO users (id, username, display_name, bio, avatar_color) VALUES (@id, @username, @display_name, @bio, @avatar_color)'
  );
  for (const u of users) insertUser.run(u);

  const posts = [
    { id: 'p1', user_id: 'u_mara', image_url: 'https://picsum.photos/seed/framely-1/900/900', caption: 'Rooftops at 6:52am, before the city wakes up.' },
    { id: 'p2', user_id: 'u_theo', image_url: 'https://picsum.photos/seed/framely-2/900/900', caption: 'Third glaze test this week. This one stuck.' },
    { id: 'p3', user_id: 'u_ivy', image_url: 'https://picsum.photos/seed/framely-3/900/900', caption: 'Got lost on purpose in Porto today.' },
    { id: 'p4', user_id: 'u_mara', image_url: 'https://picsum.photos/seed/framely-4/900/900', caption: 'Fog rolling over the bridge, shot on film.' },
    { id: 'p5', user_id: 'u_ivy', image_url: 'https://picsum.photos/seed/framely-5/900/900', caption: 'Market stalls, first light.' },
    { id: 'p6', user_id: 'u_theo', image_url: 'https://picsum.photos/seed/framely-6/900/900', caption: 'Studio floor after a long Sunday.' },
  ];
  const insertPost = db.prepare(
    'INSERT INTO posts (id, user_id, image_url, caption, created_at) VALUES (@id, @user_id, @image_url, @caption, datetime(\'now\', @offset))'
  );
  posts.forEach((p, i) => insertPost.run({ ...p, offset: `-${(posts.length - i) * 3} hours` }));

  const insertLike = db.prepare('INSERT OR IGNORE INTO likes (post_id, user_id) VALUES (?, ?)');
  insertLike.run('p1', 'u_theo');
  insertLike.run('p1', 'u_ivy');
  insertLike.run('p2', 'u_mara');
  insertLike.run('p3', 'u_mara');
  insertLike.run('p3', 'u_theo');

  const insertComment = db.prepare(
    "INSERT INTO comments (id, post_id, user_id, body) VALUES (?, ?, ?, ?)"
  );
  insertComment.run('c1', 'p1', 'u_theo', 'This light is unreal.');
  insertComment.run('c2', 'p3', 'u_mara', 'Take me with you next time');
}

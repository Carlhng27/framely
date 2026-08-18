import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getUserByUsername, listPostsByUser } from '@/lib/queries';
import Avatar from '@/components/Avatar';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const me = getCurrentUser();
  const user = getUserByUsername(params.username);
  if (!user) notFound();
  const posts = listPostsByUser(user.id, me.id);

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <Avatar name={user.display_name} color={user.avatar_color} size={72} />
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">{user.display_name}</h1>
          <p className="text-sm text-ink/50">@{user.username}</p>
          <p className="mt-1 text-sm text-ink/70">{user.bio}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/50">
          {user.id === me.id ? "You haven't posted anything yet." : `${user.display_name} hasn't posted yet.`}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="focus-ring relative aspect-square overflow-hidden rounded-md bg-line"
            >
              <Image src={post.image_url} alt={post.caption || 'Post image'} fill sizes="200px" className="object-cover" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

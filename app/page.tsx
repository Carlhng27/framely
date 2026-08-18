import { getCurrentUser } from '@/lib/session';
import { listFeed } from '@/lib/queries';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
  const me = getCurrentUser();
  const posts = listFeed(me.id);

  if (posts.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="font-display text-xl text-ink">No posts yet</p>
        <p className="mt-2 text-sm text-ink/60">Be the first to share something today.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
